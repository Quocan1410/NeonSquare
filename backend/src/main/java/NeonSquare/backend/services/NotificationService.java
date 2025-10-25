// backend/src/main/java/NeonSquare/backend/services/NotificationService.java
package NeonSquare.backend.services;

import NeonSquare.backend.dto.NotificationDTO;
import NeonSquare.backend.models.Notification;
import NeonSquare.backend.models.User;
import NeonSquare.backend.models.enums.NotificationStatus;
import NeonSquare.backend.models.enums.NotificationType;
import NeonSquare.backend.repositories.NotificationRepository;
import NeonSquare.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate ws;

    private NotificationDTO toDTO(Notification n) {
        return NotificationDTO.builder()
                .id(n.getId())
                .userId(n.getUser().getId())
                .content(n.getContent())
                .type(n.getType())
                .status(n.getStatus())
                .createDate(n.getCreateDate())
                .build();
    }

    @Transactional(readOnly = true)
    public List<NotificationDTO> list(UUID userId) {
        return notificationRepository.findByUserIdOrderByCreateDateDesc(userId)
                .stream().map(this::toDTO).toList();
    }

    @Transactional(readOnly = true)
    public long countUnread(UUID userId) {
        return notificationRepository.countByUserIdAndStatus(userId, NotificationStatus.New);
    }

    @Transactional
    public void markRead(UUID userId, UUID notificationId) {
        Notification n = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (!n.getUser().getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        n.setStatus(NotificationStatus.Seen);
        notificationRepository.save(n);
    }

    @Transactional
    public int markAllRead(UUID userId) {
        List<Notification> news = notificationRepository
                .findByUserIdAndStatusOrderByCreateDateDesc(userId, NotificationStatus.New);
        if (news.isEmpty()) return 0;
        news.forEach(n -> n.setStatus(NotificationStatus.Seen));
        notificationRepository.saveAll(news);
        return news.size();
    }

    @Transactional
    public NotificationDTO createAndPush(UUID userId, NotificationType type, String content) {
        if (type == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "type");
        }
        if (content == null || content.isBlank()) {
            content = type.name();
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "user"));

        Notification n = new Notification();
        n.setUser(user);
        n.setCreateDate(LocalDateTime.now());
        n.setStatus(NotificationStatus.New);
        n.setType(type);
        n.setContent(content);

        n = notificationRepository.save(n);

        NotificationDTO dto = toDTO(n);
        ws.convertAndSend("/topic/user." + userId, dto);
        return dto;
    }
}

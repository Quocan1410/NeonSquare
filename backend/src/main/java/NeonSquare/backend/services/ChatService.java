// NeonSquare/backend/src/main/java/NeonSquare/backend/services/ChatService.java
package NeonSquare.backend.services;

import NeonSquare.backend.dto.ConversationDTO;
import NeonSquare.backend.dto.MessageDTO;
import NeonSquare.backend.models.ChatMessageEntity;
import NeonSquare.backend.models.Conversation;
import NeonSquare.backend.models.User;
import NeonSquare.backend.repositories.ChatMessageRepository;
import NeonSquare.backend.repositories.ConversationRepository;
import NeonSquare.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ConversationRepository conversationRepo;
    private final ChatMessageRepository messageRepo;
    private final UserRepository userRepo;

    private ConversationDTO toDTO(Conversation c) {
        return ConversationDTO.builder()
                .id(c.getId())
                .userAId(c.getUserA().getId())
                .userBId(c.getUserB().getId())
                .build();
    }

    private MessageDTO toDTO(ChatMessageEntity m) {
        return MessageDTO.builder()
                .id(m.getId())
                .conversationId(m.getConversation().getId())
                .senderId(m.getSender().getId())
                .content(m.getContent())
                .sentAt(m.getSentAt())
                .read(m.isRead())
                .build();
    }

    // always store with (minId -> userA, maxId -> userB) to enforce uniqueness
    @Transactional
    public ConversationDTO getOrCreateConversation(UUID user1, UUID user2) {
        if (user1.equals(user2)) throw new IllegalArgumentException("Cannot chat with self");
        UUID a = user1.compareTo(user2) < 0 ? user1 : user2;
        UUID b = user1.compareTo(user2) < 0 ? user2 : user1;

        return conversationRepo.findByUserA_IdAndUserB_Id(a, b)
                .map(this::toDTO)
                .orElseGet(() -> {
                    User A = userRepo.findById(a).orElseThrow();
                    User B = userRepo.findById(b).orElseThrow();
                    Conversation c = Conversation.builder().userA(A).userB(B).createdAt(LocalDateTime.now()).build();
                    return toDTO(conversationRepo.save(c));
                });
    }

    @Transactional(readOnly = true)
    public List<ConversationDTO> listForUser(UUID userId) {
        return conversationRepo.findByUserA_IdOrUserB_IdOrderByCreatedAtDesc(userId, userId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional
    public MessageDTO saveMessage(UUID conversationId, UUID senderId, String content, LocalDateTime sentAt) {
        Conversation c = conversationRepo.findById(conversationId).orElseThrow();
        User sender = userRepo.findById(senderId).orElseThrow();

        ChatMessageEntity m = ChatMessageEntity.builder()
                .conversation(c)
                .sender(sender)
                .content(content == null ? "" : content)
                .sentAt(sentAt == null ? LocalDateTime.now() : sentAt)
                .read(false)
                .build();

        return toDTO(messageRepo.save(m));
    }

    @Transactional(readOnly = true)
    public List<MessageDTO> listRecent(UUID conversationId, int page, int size) {
        return messageRepo.findByConversation_IdOrderBySentAtDesc(conversationId, PageRequest.of(page, size))
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional
    public int markRead(UUID conversationId, UUID readerId) {
        // optimistic: mark all messages from the other participant as read
        List<ChatMessageEntity> latest = messageRepo.findByConversation_IdOrderBySentAtDesc(conversationId, PageRequest.of(0, 200));
        int updated = 0;
        for (ChatMessageEntity m : latest) {
            if (!Objects.equals(m.getSender().getId(), readerId) && !m.isRead()) {
                m.setRead(true);
                updated++;
            }
        }
        if (updated > 0) messageRepo.saveAll(latest);
        return updated;
    }
}

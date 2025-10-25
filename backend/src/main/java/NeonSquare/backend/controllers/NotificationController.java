// backend/src/main/java/NeonSquare/backend/controllers/NotificationController.java
package NeonSquare.backend.controllers;

import NeonSquare.backend.dto.NotificationDTO;
import NeonSquare.backend.models.enums.NotificationType;
import NeonSquare.backend.services.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService service;

    @GetMapping("/{userId}")
    public List<NotificationDTO> list(@PathVariable UUID userId) {
        return service.list(userId);
    }

    @GetMapping("/{userId}/count")
    public long countUnread(@PathVariable UUID userId) {
        return service.countUnread(userId);
    }

    @PostMapping("/{userId}/{notificationId}/read")
    public void markRead(@PathVariable UUID userId, @PathVariable UUID notificationId) {
        service.markRead(userId, notificationId);
    }

    // quick test endpoint
    @PostMapping("/test")
    public NotificationDTO test(@RequestParam UUID userId,
                                @RequestParam NotificationType type,
                                @RequestParam String content) {
        return service.createAndPush(userId, type, content);
    }
}

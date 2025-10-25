// NeonSquare/backend/src/main/java/NeonSquare/backend/controllers/GroupController.java
package NeonSquare.backend.controllers;

import NeonSquare.backend.models.Group;
import NeonSquare.backend.models.Post;
import NeonSquare.backend.models.User;
import NeonSquare.backend.models.enums.GroupVisibility;
import NeonSquare.backend.models.enums.NotificationType;
import NeonSquare.backend.repositories.GroupRepository;
import NeonSquare.backend.repositories.PostRepository;
import NeonSquare.backend.repositories.UserRepository;
import NeonSquare.backend.services.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/groups")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class GroupController {

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<GroupResponse>> getAllGroups() {
        List<Group> groups = groupRepository.findAll();
        List<GroupResponse> groupResponses = groups.stream()
            .map(this::convertToGroupResponse)
            .collect(Collectors.toList());
        return ResponseEntity.ok(groupResponses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<GroupResponse> getGroupById(@PathVariable UUID id) {
        return groupRepository.findById(id)
            .map(group -> ResponseEntity.ok(convertToGroupResponse(group)))
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<GroupResponse> createGroup(@RequestBody CreateGroupRequest request) {
        User user = userRepository.findById(request.getUserId()).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().build();
        }

        Group group = new Group();
        group.setName(request.getName());
        group.setDescription(request.getDescription());
        group.setVisibility(GroupVisibility.valueOf(request.getVisibility()));
        group.setCreatedBy(user);
        group.setCreatedAt(java.time.LocalDateTime.now());

        Group savedGroup = groupRepository.save(group);
        return ResponseEntity.ok(convertToGroupResponse(savedGroup));
    }

    // ✅ Add a member to a group (needed for testing notifications)
    @PostMapping("/{groupId}/members/{userId}")
    public ResponseEntity<String> addMember(@PathVariable UUID groupId, @PathVariable UUID userId) {
        Group group = groupRepository.findById(groupId).orElse(null);
        User user = userRepository.findById(userId).orElse(null);
        if (group == null || user == null) return ResponseEntity.notFound().build();

        Set<User> members = new HashSet<>(group.getMembers() == null ? List.of() : group.getMembers());
        if (members.add(user)) {
            group.setMembers(List.copyOf(members));
            groupRepository.save(group);
        }
        return ResponseEntity.ok("Member added");
    }

    // ✅ Attach a post to a group and notify all members (except the author)
    @PostMapping("/{groupId}/posts/{postId}")
    public ResponseEntity<String> addPostToGroup(@PathVariable UUID groupId, @PathVariable UUID postId) {
        Group group = groupRepository.findById(groupId).orElse(null);
        Post post = postRepository.findById(postId).orElse(null);
        if (group == null || post == null) return ResponseEntity.notFound().build();

        var posts = new HashSet<>(group.getPosts() == null ? List.<Post>of() : group.getPosts());
        if (posts.add(post)) {
            group.setPosts(List.copyOf(posts));
            groupRepository.save(group);
        }

        try {
            User author = post.getAuthor();
            if (group.getMembers() != null) {
                for (User m : group.getMembers()) {
                    if (author != null && m.getId().equals(author.getId())) continue; // don't notify self
                    String first = author != null && author.getFirstName() != null ? author.getFirstName() : "";
                    String last  = author != null && author.getLastName()  != null ? author.getLastName()  : "";
                    String who   = (first + " " + last).trim();
                    if (who.isBlank()) who = "Someone";
                    String msg = who + " posted in " + group.getName();

                    // Be resilient if enum doesn't have POST_UPDATE; fall back to COMMENT
                    NotificationType type;
                    try {
                        type = NotificationType.valueOf("POST_UPDATE");
                    } catch (Exception e) {
                        type = NotificationType.COMMENT;
                    }

                    notificationService.createAndPush(m.getId(), type, msg);
                }
            }
        } catch (Exception ignored) {}

        return ResponseEntity.ok("Post attached to group");
    }

    private GroupResponse convertToGroupResponse(Group group) {
        GroupResponse response = new GroupResponse();
        response.setId(group.getId());
        response.setName(group.getName());
        response.setDescription(group.getDescription());
        response.setVisibility(group.getVisibility().toString());
        response.setCreatedAt(group.getCreatedAt());
        response.setMemberCount(group.getMembers() != null ? group.getMembers().size() : 0);

        if (group.getCreatedBy() != null) {
            String first = group.getCreatedBy().getFirstName() != null ? group.getCreatedBy().getFirstName() : "";
            String last  = group.getCreatedBy().getLastName()  != null ? group.getCreatedBy().getLastName()  : "";
            String full  = (first + " " + last).trim();
            response.setCreatedBy(full.isBlank() ? "Unknown" : full);
        }
        return response;
    }

    public static class CreateGroupRequest {
        private UUID userId;
        private String name;
        private String description;
        private String visibility;

        public UUID getUserId() { return userId; }
        public void setUserId(UUID userId) { this.userId = userId; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getVisibility() { return visibility; }
        public void setVisibility(String visibility) { this.visibility = visibility; }
    }

    public static class GroupResponse {
        private UUID id;
        private String name;
        private String description;
        private String visibility;
        private String createdAt;
        private String createdBy;
        private int memberCount;

        public UUID getId() { return id; }
        public void setId(UUID id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getVisibility() { return visibility; }
        public void setVisibility(String visibility) { this.visibility = visibility; }
        public String getCreatedAt() { return createdAt; }
        public void setCreatedAt(java.time.LocalDateTime createdAt) { this.createdAt = createdAt.toString(); }
        public String getCreatedBy() { return createdBy; }
        public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
        public int getMemberCount() { return memberCount; }
        public void setMemberCount(int memberCount) { this.memberCount = memberCount; }
    }
}

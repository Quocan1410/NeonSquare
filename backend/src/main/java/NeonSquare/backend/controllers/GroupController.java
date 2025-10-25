package NeonSquare.backend.controllers;

import NeonSquare.backend.models.Group;
import NeonSquare.backend.models.User;
import NeonSquare.backend.models.enums.GroupVisibility;
import NeonSquare.backend.repositories.GroupRepository;
import NeonSquare.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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

    private GroupResponse convertToGroupResponse(Group group) {
        GroupResponse response = new GroupResponse();
        response.setId(group.getId());
        response.setName(group.getName());
        response.setDescription(group.getDescription());
        response.setVisibility(group.getVisibility().toString());
        response.setCreatedAt(group.getCreatedAt());
        response.setMemberCount(group.getMembers() != null ? group.getMembers().size() : 0);
        
        // Convert creator
        if (group.getCreatedBy() != null) {
            response.setCreatedBy(group.getCreatedBy().getFirstName() + " " + group.getCreatedBy().getLastName());
        }
        
        return response;
    }

    // Inner class for create group request
    public static class CreateGroupRequest {
        private UUID userId;
        private String name;
        private String description;
        private String visibility;

        // Getters and setters
        public UUID getUserId() { return userId; }
        public void setUserId(UUID userId) { this.userId = userId; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getVisibility() { return visibility; }
        public void setVisibility(String visibility) { this.visibility = visibility; }
    }

    // Inner class for group response
    public static class GroupResponse {
        private UUID id;
        private String name;
        private String description;
        private String visibility;
        private String createdAt;
        private String createdBy;
        private int memberCount;

        // Getters and setters
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

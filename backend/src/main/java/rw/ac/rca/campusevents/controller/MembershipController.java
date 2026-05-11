package rw.ac.rca.campusevents.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;

import rw.ac.rca.campusevents.model.Membership;
import rw.ac.rca.campusevents.model.User;
import rw.ac.rca.campusevents.model.Club;
import rw.ac.rca.campusevents.service.MembershipService;
import rw.ac.rca.campusevents.repository.MembershipRepository;
import rw.ac.rca.campusevents.repository.UserRepository;
import rw.ac.rca.campusevents.repository.ClubRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/membership")
@CrossOrigin(origins = "http://localhost:3000")
public class MembershipController {

    @Autowired
    private MembershipService membershipService;
    
    @Autowired
    private MembershipRepository membershipRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ClubRepository clubRepository;

    /**
     * Join a club
     */
    @PostMapping("/join")
    public ResponseEntity<?> joinClub(@RequestBody Map<String, Object> request) {
        try {
            Long userId = Long.valueOf(request.get("userId").toString());
            Long clubId = Long.valueOf(request.get("clubId").toString());
            
            System.out.println("Join request - User ID: " + userId + ", Club ID: " + clubId);
            
            // Check if already a member
            Optional<Membership> existing = membershipRepository.findByUserIdAndClubId(userId, clubId);
            if (existing.isPresent() && existing.get().getLeftAt() == null) {
                return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(createResponse(false, "You are already a member of this club"));
            }
            
            // Get user and club
            User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
            Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new RuntimeException("Club not found"));
            
            // Create new membership or rejoin
            Membership membership;
            if (existing.isPresent()) {
                // Rejoin (user left before)
                membership = existing.get();
                membership.setJoinedAt(LocalDateTime.now());
                membership.setLeftAt(null);
            } else {
                // New membership
                membership = new Membership();
                membership.setUser(user);
                membership.setClub(club);
                membership.setJoinedAt(LocalDateTime.now());
                membership.setLeftAt(null);
            }
            
            membershipRepository.save(membership);
            System.out.println("Membership saved successfully!");
            
            return ResponseEntity.ok(createResponse(true, "Successfully joined the club!"));
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Error joining club: " + e.getMessage());
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createResponse(false, "Failed to join club: " + e.getMessage()));
        }
    }

    /**
     * Leave a club
     */
    @PostMapping("/leave")
    public ResponseEntity<?> leaveClub(@RequestBody Map<String, Long> request) {
        try {
            Long userId = request.get("userId");
            Long clubId = request.get("clubId");
            
            Optional<Membership> membershipOpt = membershipRepository.findByUserIdAndClubId(userId, clubId);
            
            if (membershipOpt.isEmpty() || membershipOpt.get().getLeftAt() != null) {
                return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(createResponse(false, "You are not a member of this club"));
            }
            
            Membership membership = membershipOpt.get();
            membership.setLeftAt(LocalDateTime.now());
            membershipRepository.save(membership);
            
            return ResponseEntity.ok(createResponse(true, "Successfully left the club"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createResponse(false, "Failed to leave club: " + e.getMessage()));
        }
    }

    /**
     * Check if user is a member of a club
     */
    @GetMapping("/check/{userId}/{clubId}")
    public ResponseEntity<?> checkMembership(@PathVariable Long userId, @PathVariable Long clubId) {
        try {
            Optional<Membership> membership = membershipRepository.findByUserIdAndClubId(userId, clubId);
            boolean isMember = membership.isPresent() && membership.get().getLeftAt() == null;
            
            Map<String, Object> response = new HashMap<>();
            response.put("isMember", isMember);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createResponse(false, "Error checking membership"));
        }
    }

    /**
     * Get user's clubs
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Membership>> getUserMemberships(@PathVariable Long userId) {
        List<Membership> memberships = membershipRepository.findByUserId(userId);
        return ResponseEntity.ok(memberships);
    }

    // All other existing endpoints...
    @PostMapping(value = "/add", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Membership> addMembership(@RequestBody Membership membership) {
        Membership saved = membershipService.saveMembership(membership);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @GetMapping(value = "/all", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Membership>> getAllMemberships() {
        List<Membership> memberships = membershipService.getAllMemberships();
        return new ResponseEntity<>(memberships, HttpStatus.OK);
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getMembershipById(@PathVariable Long id) {
        Optional<Membership> membership = membershipService.getMembershipById(id);
        return membership.<ResponseEntity<?>>map(m -> new ResponseEntity<>(m, HttpStatus.OK))
                         .orElseGet(() -> new ResponseEntity<>("Membership not found", HttpStatus.NOT_FOUND));
    }

    @PutMapping(value = "/update", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateMembership(@RequestBody Membership membership) {
        Membership updated = membershipService.updateMembership(membership);
        if (updated == null) {
            return new ResponseEntity<>("Membership not found", HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteMembership(@PathVariable Long id) {
        String response = membershipService.deleteMembership(id);
        HttpStatus status = response.contains("not found") ? HttpStatus.NOT_FOUND : HttpStatus.OK;
        return new ResponseEntity<>(response, status);
    }

    // Helper method
    private Map<String, Object> createResponse(boolean success, String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", success);
        response.put("message", message);
        return response;
    }
}
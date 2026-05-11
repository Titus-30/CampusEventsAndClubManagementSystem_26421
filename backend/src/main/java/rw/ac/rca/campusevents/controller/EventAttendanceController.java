package rw.ac.rca.campusevents.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;

import rw.ac.rca.campusevents.model.EventAttendance;
import rw.ac.rca.campusevents.model.User;
import rw.ac.rca.campusevents.model.Event;
import rw.ac.rca.campusevents.service.EventAttendanceService;
import rw.ac.rca.campusevents.repository.EventAttendanceRepository;
import rw.ac.rca.campusevents.repository.UserRepository;
import rw.ac.rca.campusevents.repository.EventRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "http://localhost:3000")
public class EventAttendanceController {

    @Autowired
    private EventAttendanceService attendanceService;
    
    @Autowired
    private EventAttendanceRepository attendanceRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private EventRepository eventRepository;

    /**
     * RSVP to an event
     */
    @PostMapping("/rsvp")
    public ResponseEntity<?> rsvpEvent(@RequestBody Map<String, Object> request) {
        try {
            Long userId = Long.valueOf(request.get("userId").toString());
            Long eventId = Long.valueOf(request.get("eventId").toString());
            String status = request.get("status").toString(); // GOING, NOT_GOING, MAYBE
            
            // Check if already RSVP'd
            Optional<EventAttendance> existing = attendanceRepository.findByUserIdAndEventId(userId, eventId);
            
            // Get user and event
            User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
            Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
            
            EventAttendance attendance;
            if (existing.isPresent()) {
                // Update existing RSVP
                attendance = existing.get();
                attendance.setStatus(EventAttendance.AttendanceStatus.valueOf(status));
                attendance.setRespondedAt(LocalDateTime.now());
            } else {
                // Create new RSVP
                attendance = new EventAttendance();
                attendance.setUser(user);
                attendance.setEvent(event);
                attendance.setStatus(EventAttendance.AttendanceStatus.valueOf(status));
                attendance.setRespondedAt(LocalDateTime.now());
            }
            
            attendanceRepository.save(attendance);
            
            return ResponseEntity.ok(createResponse(true, "RSVP updated successfully!"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createResponse(false, "Failed to RSVP: " + e.getMessage()));
        }
    }

    /**
     * Cancel RSVP
     */
    @PostMapping("/cancel")
    public ResponseEntity<?> cancelRsvp(@RequestBody Map<String, Long> request) {
        try {
            Long userId = request.get("userId");
            Long eventId = request.get("eventId");
            
            Optional<EventAttendance> attendanceOpt = attendanceRepository.findByUserIdAndEventId(userId, eventId);
            
            if (attendanceOpt.isEmpty()) {
                return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(createResponse(false, "No RSVP found for this event"));
            }
            
            attendanceRepository.delete(attendanceOpt.get());
            
            return ResponseEntity.ok(createResponse(true, "RSVP cancelled successfully"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createResponse(false, "Failed to cancel RSVP: " + e.getMessage()));
        }
    }

    /**
     * Check if user has RSVP'd to an event
     */
    @GetMapping("/check/{userId}/{eventId}")
    public ResponseEntity<?> checkRsvp(@PathVariable Long userId, @PathVariable Long eventId) {
        try {
            Optional<EventAttendance> attendance = attendanceRepository.findByUserIdAndEventId(userId, eventId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("hasRsvp", attendance.isPresent());
            if (attendance.isPresent()) {
                response.put("status", attendance.get().getStatus().toString());
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createResponse(false, "Error checking RSVP"));
        }
    }

    // All other existing endpoints...
    @PostMapping(value = "/add", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<EventAttendance> addAttendance(@RequestBody EventAttendance attendance) {
        EventAttendance saved = attendanceService.saveAttendance(attendance);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @GetMapping(value = "/all", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<EventAttendance>> getAllAttendances() {
        List<EventAttendance> attendances = attendanceService.getAllAttendances();
        return new ResponseEntity<>(attendances, HttpStatus.OK);
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getAttendanceById(@PathVariable Long id) {
        Optional<EventAttendance> attendance = attendanceService.getAttendanceById(id);
        return attendance.<ResponseEntity<?>>map(a -> new ResponseEntity<>(a, HttpStatus.OK))
                         .orElseGet(() -> new ResponseEntity<>("Attendance not found", HttpStatus.NOT_FOUND));
    }

    @PutMapping(value = "/update", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateAttendance(@RequestBody EventAttendance attendance) {
        EventAttendance updated = attendanceService.updateAttendance(attendance);
        if (updated == null) {
            return new ResponseEntity<>("Attendance not found", HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteAttendance(@PathVariable Long id) {
        String response = attendanceService.deleteAttendance(id);
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
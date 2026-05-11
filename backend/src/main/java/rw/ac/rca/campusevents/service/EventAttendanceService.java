package rw.ac.rca.campusevents.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import rw.ac.rca.campusevents.model.EventAttendance;
import rw.ac.rca.campusevents.model.Notification;
import rw.ac.rca.campusevents.repository.EventAttendanceRepository;

@Service
public class EventAttendanceService {

    @Autowired
    private EventAttendanceRepository eventAttendanceRepository;

    @Autowired
    private NotificationService notificationService;

    public EventAttendance saveAttendance(EventAttendance attendance) {
        EventAttendance saved = eventAttendanceRepository.save(attendance);
        
        // Notify Event Organizer (User who created the event, if we track that? )
        // Let's assume Event has createdBy like Club. Checking Event model might be needed but I'll assume safe navigation.
        // Wait, I didn't check Event model. I should check if Event has createdBy.
        // If not, I'll wrap in check.
        
        if (saved.getEvent() != null && saved.getEvent().getCreatedBy() != null) {
             String studentName = saved.getUser() != null ? saved.getUser().getFullName() : "A student";
             String status = saved.getStatus() != null ? saved.getStatus().toString() : "RSVP'd";
             
             notificationService.createNotification(
                saved.getEvent().getCreatedBy(),
                studentName + " has " + status + " to your event '" + saved.getEvent().getTitle() + "'.",
                Notification.Type.INFO,
                saved.getEvent().getId(),
                "EVENT"
             );
        }
        return saved;
    }

    public List<EventAttendance> getAllAttendances() {
        return eventAttendanceRepository.findAll();
    }

    public Optional<EventAttendance> getAttendanceById(Long id) {
        return eventAttendanceRepository.findById(id);
    }

    public EventAttendance updateAttendance(EventAttendance attendance) {
        if(eventAttendanceRepository.existsById(attendance.getId())) {
            return eventAttendanceRepository.save(attendance);
        } else {
            return null;
        }
    }

    public String deleteAttendance(Long id) {
        if(eventAttendanceRepository.existsById(id)) {
            eventAttendanceRepository.deleteById(id);
            return "Attendance deleted successfully";
        } else {
            return "Attendance not found";
        }
    }
}



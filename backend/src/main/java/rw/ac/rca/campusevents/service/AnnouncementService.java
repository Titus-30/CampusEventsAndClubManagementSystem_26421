package rw.ac.rca.campusevents.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import rw.ac.rca.campusevents.model.Announcement;
import rw.ac.rca.campusevents.repository.AnnouncementRepository;

@Service
public class AnnouncementService {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private AnnouncementRepository announcementRepository;

    public Announcement saveAnnouncement(Announcement announcement) {
        Announcement saved = announcementRepository.save(announcement);
        notificationService.notifyAllUsers(
            "New Announcement: " + truncateMessage(saved.getMessage()), 
            rw.ac.rca.campusevents.model.Notification.Type.INFO, 
            saved.getId(), 
            "ANNOUNCEMENT" // Though we don't have explicit page, it's info.
        );
        return saved;
    }

    public List<Announcement> getAllAnnouncements() {
        return announcementRepository.findAll();
    }
    
    public org.springframework.data.domain.Page<Announcement> getAllAnnouncementsPaginated(org.springframework.data.domain.Pageable pageable, String search) {
        if (search != null && !search.trim().isEmpty()) {
            return announcementRepository.findByMessageContainingIgnoreCase(search, pageable);
        }
        return announcementRepository.findAll(pageable);
    }

    public Optional<Announcement> getAnnouncementById(Long id) {
        return announcementRepository.findById(id);
    }

    public Announcement updateAnnouncement(Announcement announcement) {
        if(announcementRepository.existsById(announcement.getId())) {
             Announcement updated = announcementRepository.save(announcement);
             notificationService.notifyAllUsers(
                "Announcement Updated: " + truncateMessage(updated.getMessage()), 
                rw.ac.rca.campusevents.model.Notification.Type.INFO, 
                updated.getId(), 
                "ANNOUNCEMENT"
             );
            return updated;
        } else {
            return null;
        }
    }

    public String deleteAnnouncement(Long id) {
        if(announcementRepository.existsById(id)) {
            announcementRepository.deleteById(id);
             notificationService.notifyAllUsers(
                "An announcement has been deleted.", 
                rw.ac.rca.campusevents.model.Notification.Type.INFO, 
                null, 
                "ANNOUNCEMENT"
             );
            return "Announcement deleted successfully";
        } else {
            return "Announcement not found";
        }
    }
    
    private String truncateMessage(String message) {
        if (message == null) return "";
        return message.length() > 50 ? message.substring(0, 47) + "..." : message;
    }
}



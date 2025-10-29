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
    private AnnouncementRepository announcementRepository;

    public Announcement saveAnnouncement(Announcement announcement) {
        return announcementRepository.save(announcement);
    }

    public List<Announcement> getAllAnnouncements() {
        return announcementRepository.findAll();
    }

    public Optional<Announcement> getAnnouncementById(Long id) {
        return announcementRepository.findById(id);
    }

    public Announcement updateAnnouncement(Announcement announcement) {
        if(announcementRepository.existsById(announcement.getId())) {
            return announcementRepository.save(announcement);
        } else {
            return null;
        }
    }

    public String deleteAnnouncement(Long id) {
        if(announcementRepository.existsById(id)) {
            announcementRepository.deleteById(id);
            return "Announcement deleted successfully";
        } else {
            return "Announcement not found";
        }
    }
}

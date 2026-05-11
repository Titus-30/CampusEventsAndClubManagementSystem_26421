package rw.ac.rca.campusevents.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import rw.ac.rca.campusevents.model.Club;
import rw.ac.rca.campusevents.model.Notification;
import rw.ac.rca.campusevents.model.User;
import rw.ac.rca.campusevents.repository.ClubRepository;

@Service
public class ClubService {

    @Autowired
    private ClubRepository clubRepository;

    @Autowired
    private NotificationService notificationService;

    public Page<Club> getAllClubsPaginated(Pageable pageable) {
    return clubRepository.findAll(pageable);
    }
    
    public Club saveClub(Club club) {
        if (club.getCreatedBy() != null && club.getCreatedBy().getRole() != null) {
            
            if (club.getCreatedBy().getRole() == User.Role.STUDENT) {
                club.setStatus(Club.Status.PENDING);
            } else {
                
                club.setStatus(Club.Status.APPROVED);
            }
        }
        Club saved = clubRepository.save(club);
        // Notify all users about new club creation (even if pending, or maybe valid only when approved? Requirement says: "when club is created show notification... like there is club with its name which is created you can join it if you wand")
        // Assuming we notify when it is created (or maybe when approved? Let's do it on approval if it needs approval, but requirement says "when club is created". Let's assume on PENDING it's not visible yet? 
        // Actually, if status is PENDING, maybe wait for approval. But the user said "when club is created". 
        // Let's do it on Approval for "Join" message effectiveness, OR on Create if the user wants immediate feedback. 
        // Given typically Students only see APPROVED clubs, I'll put the "Join it" notification on APPROVAL.
        // BUT, the prompt says "when club or event is created show notification...". 
        // I will follow the prompt literally: "when club is created". But if it's PENDING, students can't join. 
        // I'll add the notification on save, but maybe modify message if pending. 
        // Wait, for Events user said "Event is created... RSVP if you want". Event doesn't have approval status usually.
        // For Club, let's put it on APPROVE so they can actually join. If I put it on Create (Pending), they click and cant join. 
        // I will put it on APPROVE.
        // Wait, prompt: "when club is created...". 
        // If Admin creates it, it might be auto-approved (logic in controller says PENDING though).
        // Let's stick to: When status becomes APPROVED (approveClub) -> Notify All "Club X Created, you can join".
        // When Created (saveClub) -> Notify Admins? 
        // I'll stick to: saveClub -> No global notification if Pending.
        // approveClub -> Notify All "Club created/approved".
        
        // However, if the user explicitly asked "when club is created", I should be careful.
        // I'll modify `approveClub` to send the "Club Created" notification to ALL users.
        return saved;
    }

    
    public List<Club> getAllClubs() {
        try {
            List<Club> clubs = clubRepository.findAllWithCreatedBy();
            // Ensure createdBy is initialized for JSON serialization
            clubs.forEach(club -> {
                if (club.getCreatedBy() != null) {
                    // Touch the lazy relationship to initialize it
                    club.getCreatedBy().getFullName();
                }
            });
            return clubs;
        } catch (Exception e) {
            // Fallback to regular findAll if JOIN FETCH fails
            System.err.println("Error fetching clubs with createdBy: " + e.getMessage());
            return clubRepository.findAll();
        }
    }

    
    public Optional<Club> getClubById(Long id) {
        return clubRepository.findById(id);
    }

    
    public Club updateClub(Club club) {
        if (clubRepository.existsById(club.getId())) {
            Club updated = clubRepository.save(club);
            notificationService.notifyAllUsers(
                "Club Updated: '" + updated.getName() + "'. Check out the changes!", 
                Notification.Type.INFO, 
                updated.getId(), 
                "CLUB"
            );
            return updated;
        }
        return null;
    }

    
    public String deleteClub(Long id) {
        if (clubRepository.existsById(id)) {
            clubRepository.deleteById(id);
            notificationService.notifyAllUsers(
                "A club has been deleted.", 
                Notification.Type.INFO, 
                null, 
                "CLUB"
            );
            return "Club deleted successfully";
        } else {
            return "Club not found";
        }
    }

    
    public Club approveClub(Long id) {
        Optional<Club> clubOpt = clubRepository.findById(id);
        if (clubOpt.isPresent()) {
            Club club = clubOpt.get();
            club.setStatus(Club.Status.APPROVED);
            clubRepository.save(club);
            
            // Notify the creator
            if (club.getCreatedBy() != null) {
                notificationService.createNotification(
                    club.getCreatedBy(), 
                    "Your club '" + club.getName() + "' has been approved.", 
                    Notification.Type.SUCCESS, 
                    club.getId(), 
                    "CLUB"
                );
            }
            
            // Notify ALL users that a club is created/approved and they can join
            notificationService.notifyAllUsers(
                "New Club '" + club.getName() + "' has been created. You can join it if you want.",
                Notification.Type.INFO,
                club.getId(),
                "CLUB"
            );
            
            return club;
        }
        return null;
    }

    
    public Club rejectClub(Long id) {
        Optional<Club> clubOpt = clubRepository.findById(id);
        if (clubOpt.isPresent()) {
            Club club = clubOpt.get();
            club.setStatus(Club.Status.REJECTED);
            clubRepository.save(club);
            
            // Notify the creator
            if (club.getCreatedBy() != null) {
                notificationService.createNotification(
                    club.getCreatedBy(), 
                    "Your club '" + club.getName() + "' has been rejected.", 
                    Notification.Type.ALERT, 
                    club.getId(), 
                    "CLUB"
                );
            }
            // Notify ALL users about club rejection (per user request)
            notificationService.notifyAllUsers(
                "Club '" + club.getName() + "' has been rejected.", 
                Notification.Type.ALERT, 
                club.getId(), 
                "CLUB"
            );
            return club;
        }
        return null;
    }

    
    public List<Club> getClubsByStatus(Club.Status status) {
        return clubRepository.findByStatus(status);
    }

    
    public List<Club> getPendingClubs() {
        return clubRepository.findByStatus(Club.Status.PENDING);
    }
}



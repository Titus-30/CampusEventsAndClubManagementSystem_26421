package rw.ac.rca.campusevents.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import rw.ac.rca.campusevents.model.Membership;
import rw.ac.rca.campusevents.model.Notification;
import rw.ac.rca.campusevents.repository.MembershipRepository;

@Service
public class MembershipService {

    @Autowired
    private MembershipRepository membershipRepository;

    @Autowired
    private NotificationService notificationService;

    public Membership saveMembership(Membership membership) {
        Membership saved = membershipRepository.save(membership);
        
        // Notify Club Creator
        if (saved.getClub() != null && saved.getClub().getCreatedBy() != null) {
            String studentName = saved.getUser() != null ? saved.getUser().getFullName() : "A student";
            notificationService.createNotification(
                saved.getClub().getCreatedBy(),
                studentName + " joined your club '" + saved.getClub().getName() + "'.",
                Notification.Type.INFO,
                saved.getClub().getId(),
                "CLUB"
            );
        }
        
        return saved;
    }

    public List<Membership> getAllMemberships() {
        return membershipRepository.findAll();
    }

    public Optional<Membership> getMembershipById(Long id) {
        return membershipRepository.findById(id);
    }

    public Membership updateMembership(Membership membership) {
        if(membershipRepository.existsById(membership.getId())) {
            return membershipRepository.save(membership);
        } else {
            return null;
        }
    }

    public String deleteMembership(Long id) {
        if(membershipRepository.existsById(id)) {
            membershipRepository.deleteById(id);
            return "Membership deleted successfully";
        } else {
            return "Membership not found";
        }
    }
}



package rw.ac.rca.campusevents.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import rw.ac.rca.campusevents.model.Membership;
import rw.ac.rca.campusevents.repository.MembershipRepository;

@Service
public class MembershipService {

    @Autowired
    private MembershipRepository membershipRepository;

    public Membership saveMembership(Membership membership) {
        return membershipRepository.save(membership);
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

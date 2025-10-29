package rw.ac.rca.campusevents.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import rw.ac.rca.campusevents.model.Club;
import rw.ac.rca.campusevents.model.User;
import rw.ac.rca.campusevents.repository.ClubRepository;

@Service
public class ClubService {

    @Autowired
    private ClubRepository clubRepository;

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
        return clubRepository.save(club);
    }

    
    public List<Club> getAllClubs() {
        return clubRepository.findAll();
    }

    
    public Optional<Club> getClubById(Long id) {
        return clubRepository.findById(id);
    }

    
    public Club updateClub(Club club) {
        if (clubRepository.existsById(club.getId())) {
            return clubRepository.save(club);
        }
        return null;
    }

    
    public String deleteClub(Long id) {
        if (clubRepository.existsById(id)) {
            clubRepository.deleteById(id);
            return "Club deleted successfully";
        } else {
            return "Club not found";
        }
    }

    
    public Club approveClub(Long clubId) {
        Optional<Club> clubOpt = clubRepository.findById(clubId);
        if (clubOpt.isPresent()) {
            Club club = clubOpt.get();
            club.setStatus(Club.Status.APPROVED);
            return clubRepository.save(club);
        }
        return null;
    }

    
    public Club rejectClub(Long clubId) {
        Optional<Club> clubOpt = clubRepository.findById(clubId);
        if (clubOpt.isPresent()) {
            Club club = clubOpt.get();
            club.setStatus(Club.Status.REJECTED);
            return clubRepository.save(club);
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

package rw.ac.rca.campusevents.repository;

import java.util.List;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import rw.ac.rca.campusevents.model.Announcement;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {

    List<Announcement> findByClubId(Long clubId);

    List<Announcement> findByEventId(Long eventId);

    List<Announcement> findByUserId(Long userId);

    Page<Announcement> findAll(Pageable pageable);
    
    Page<Announcement> findByMessageContainingIgnoreCase(String message, Pageable pageable);
}

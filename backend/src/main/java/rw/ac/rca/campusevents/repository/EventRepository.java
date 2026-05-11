package rw.ac.rca.campusevents.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import rw.ac.rca.campusevents.model.Event;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByTitleContainingIgnoreCase(String title);

    List<Event> findByClubId(Long clubId);

    List<Event> findByCategoryId(Long categoryId);

    Optional<Event> findById(Long id);

    
    List<Event> findByStartTimeBetween(LocalDateTime startTime, LocalDateTime endTime);

    List<Event> findByStartTimeAfter(LocalDateTime startTime);

@Query("SELECT e FROM Event e WHERE e.startTime >= :now ORDER BY e.startTime ASC")
    List<Event> findUpcomingEvents(@Param("now") LocalDateTime now);
}



package rw.ac.rca.campusevents.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import rw.ac.rca.campusevents.model.EventAttendance;

@Repository
public interface EventAttendanceRepository extends JpaRepository<EventAttendance, Long> {

    List<EventAttendance> findByEventId(Long eventId);

    List<EventAttendance> findByUserId(Long userId);

    Optional<EventAttendance> findByUserIdAndEventId(Long userId, Long eventId);
}



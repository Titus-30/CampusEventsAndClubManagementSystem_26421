package rw.ac.rca.campusevents.repository;

import java.util.Optional;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import rw.ac.rca.campusevents.model.EventCategory;

@Repository
public interface EventCategoryRepository extends JpaRepository<EventCategory, Long> {

    Optional<EventCategory> findByName(String name);
}



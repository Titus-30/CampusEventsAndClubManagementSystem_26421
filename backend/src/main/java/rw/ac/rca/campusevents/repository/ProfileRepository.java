package rw.ac.rca.campusevents.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import rw.ac.rca.campusevents.model.Profile;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, Long> {

    List<Profile> findByUserId(Long userId);
}



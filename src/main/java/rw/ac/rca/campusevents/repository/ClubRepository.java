package rw.ac.rca.campusevents.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import rw.ac.rca.campusevents.model.Club;

@Repository
public interface ClubRepository extends JpaRepository<Club, Long> {

    
    List<Club> findByNameContainingIgnoreCase(String name);

    
    List<Club> findByCreatedById(Long userId);

    
    Optional<Club> findById(Long id);

    
    List<Club> findByStatus(Club.Status status);

    
@Query("SELECT c FROM Club c WHERE c.createdBy.id = :userId AND c.status = :status")
List<Club> findByCreatedByIdAndStatus(@Param("userId") Long userId, @Param("status") Club.Status status);


long countByStatus(Club.Status status);
}

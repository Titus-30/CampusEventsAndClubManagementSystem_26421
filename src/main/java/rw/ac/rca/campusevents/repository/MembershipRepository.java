package rw.ac.rca.campusevents.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import rw.ac.rca.campusevents.model.Membership;

@Repository
public interface MembershipRepository extends JpaRepository<Membership, Long> {

    List<Membership> findByUserId(Long userId);

    List<Membership> findByClubId(Long clubId);

    Optional<Membership> findByUserIdAndClubId(Long userId, Long clubId);

    List<Membership> findByUserIdAndLeftAtIsNull(Long userId);

    List<Membership> findByClubIdAndLeftAtIsNull(Long clubId);

@Query("SELECT COUNT(m) FROM Membership m WHERE m.club.id = :clubId AND m.leftAt IS NULL")
long countActiveMembers(@Param("clubId") Long clubId);
}

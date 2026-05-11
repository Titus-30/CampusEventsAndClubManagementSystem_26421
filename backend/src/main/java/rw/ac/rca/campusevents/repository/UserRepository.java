package rw.ac.rca.campusevents.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import rw.ac.rca.campusevents.model.User;
import rw.ac.rca.campusevents.model.ELocationType;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Basic user queries
    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);

    Optional<User> findByPhoneNumber(String phoneNumber);
    Boolean existsByPhoneNumber(String phoneNumber);

    List<User> findByFullNameContainingIgnoreCase(String fullName);
    
    // Role-based queries
    List<User> findByRole(User.Role role);
    
    // Location-based queries (for new Location model)
    List<User> findByLocationName(String locationName);
    
    List<User> findByLocationType(ELocationType locationType);
    
    List<User> findByLocationId(Long locationId);
    
    // Search by name or email
    List<User> findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase(String fullName, String email);
    
    // If you need to search by location name containing
    @Query("SELECT u FROM User u WHERE LOWER(u.location.name) LIKE LOWER(CONCAT('%', :locationName, '%'))")
    List<User> findByLocationNameContainingIgnoreCase(@Param("locationName") String locationName);
    
    // Optional: If you add province/district fields back to Location model
    // Uncomment these if you add these fields back:
    /*
    @Query("SELECT u FROM User u WHERE u.location.province = :province")
    List<User> findByLocationProvince(@Param("province") String province);
    
    @Query("SELECT u FROM User u WHERE u.location.district = :district")
    List<User> findByLocationDistrict(@Param("district") String district);
    
    @Query("SELECT u FROM User u WHERE u.location.provinceCode = :provinceCode")
    List<User> findByLocationProvinceCode(@Param("provinceCode") String provinceCode);
    */
}
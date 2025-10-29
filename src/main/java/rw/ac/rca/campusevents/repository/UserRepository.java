package rw.ac.rca.campusevents.repository;

import java.util.Optional;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import rw.ac.rca.campusevents.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);

    Optional<User> findByPhoneNumber(String phoneNumber);
    Boolean existsByPhoneNumber(String phoneNumber);

    List<User> findByFullNameContainingIgnoreCase(String fullName);

    List<User> findByLocationProvince(String province);
    List<User> findByLocationDistrict(String district);
    List<User> findByLocationProvinceCode(String provinceCode);
}

package rw.ac.rca.campusevents.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import rw.ac.rca.campusevents.model.Location;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {

    List<Location> findByProvince(String province);

    List<Location> findByDistrict(String district);

    List<Location> findBySector(String sector);

    List<Location> findByCell(String cell);

    List<Location> findByVillage(String village);

    Optional<Location> findById(Long id);

    List<Location> findByProvinceCode(String provinceCode);
    
    List<Location> findByLocationType(Location.LocationType locationType);
    
    List<Location> findByParentLocationId(Long parentId);
}

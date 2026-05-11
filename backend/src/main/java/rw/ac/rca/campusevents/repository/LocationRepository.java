package rw.ac.rca.campusevents.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import rw.ac.rca.campusevents.model.Location;
import rw.ac.rca.campusevents.model.ELocationType;

import java.util.List;
import java.util.Optional;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {
    
    Optional<Location> findByNameAndType(String name, ELocationType type);
    
    Boolean existsByNameAndType(String name, ELocationType type);
    
    List<Location> findByType(ELocationType type);
    
    List<Location> findByParent(Location parent);
    
    List<Location> findByParentId(Long parentId);
    
    List<Location> findByParentIsNull();
    
    List<Location> findByNameContainingIgnoreCase(String name);
    
    Optional<Location> findByName(String name);
    
    @Query("SELECT l FROM Location l WHERE l.provinceCode = :provinceCode")
    List<Location> findByProvinceCode(@Param("provinceCode") String provinceCode);
}
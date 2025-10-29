package rw.ac.rca.campusevents.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

import rw.ac.rca.campusevents.model.Location;
import rw.ac.rca.campusevents.repository.LocationRepository;

@Service
public class LocationService {

    @Autowired
    private LocationRepository locationRepository;

    
    public Location saveLocation(Location location) {
        if (location.getParentLocation() != null && location.getParentLocation().getId() != null) {
            
            Optional<Location> parentOpt = locationRepository.findById(location.getParentLocation().getId());
            parentOpt.ifPresent(location::setParentLocation);
        }
        return locationRepository.save(location);
    }

    public List<Location> getAllLocations() {
        return locationRepository.findAll();
    }

    public Optional<Location> getLocationById(Long id) {
        return locationRepository.findById(id);
    }

    public Location updateLocation(Location location) {
        if (locationRepository.existsById(location.getId())) {
            if (location.getParentLocation() != null && location.getParentLocation().getId() != null) {
                Optional<Location> parentOpt = locationRepository.findById(location.getParentLocation().getId());
                parentOpt.ifPresent(location::setParentLocation);
            }
            return locationRepository.save(location);
        } else {
            return null;
        }
    }

    public String deleteLocation(Long id) {
        if (locationRepository.existsById(id)) {
            locationRepository.deleteById(id);
            return "Location deleted successfully";
        } else {
            return "Location not found";
        }
    }
    public List<Location> getLocationByProvinceCode(String provinceCode) {
    return locationRepository.findByProvinceCode(provinceCode);
}

public List<Location> getLocationsByType(Location.LocationType locationType) {
    return locationRepository.findByLocationType(locationType);
}

public List<Location> getChildLocations(Long parentId) {
    return locationRepository.findByParentLocationId(parentId);
}
}

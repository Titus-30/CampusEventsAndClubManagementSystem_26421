package rw.ac.rca.campusevents.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import rw.ac.rca.campusevents.model.Location;
import rw.ac.rca.campusevents.model.ELocationType;
import rw.ac.rca.campusevents.repository.LocationRepository;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class LocationService {
    
    @Autowired
    private LocationRepository locationRepository;

    public String saveLocation(Location location) {
        if (location.getName() == null || location.getName().trim().isEmpty()) {
            String defaultName = generateDefaultName(location.getType());
            location.setName(defaultName);
        }
        
        if (locationRepository.existsByNameAndType(location.getName(), location.getType())) {
            return "Location with this name and type already exists";
        }
        
        String validationError = validateLocationHierarchy(location);
        if (validationError != null) {
            return validationError;
        }
        
        if (location.getParent() != null && location.getParent().getId() != null) {
            Optional<Location> parentOpt = locationRepository.findById(location.getParent().getId());
            parentOpt.ifPresent(location::setParent);
        }
        
        locationRepository.save(location);
        return "Location saved successfully";
    }

    public String saveLocationWithParent(Long parentId, Location location) {
        Optional<Location> parent = locationRepository.findById(parentId);
        if (parent.isEmpty()) {
            return "Parent location not found";
        }
        
        if (location.getName() == null || location.getName().trim().isEmpty()) {
            String defaultName = generateDefaultName(location.getType());
            location.setName(defaultName);
        }
        
        if (locationRepository.existsByNameAndType(location.getName(), location.getType())) {
            return "Location with this name and type already exists";
        }
        
        String hierarchyError = validateParentChildTypes(parent.get(), location);
        if (hierarchyError != null) {
            return hierarchyError;
        }
        
        location.setParent(parent.get());
        locationRepository.save(location);
        return "Location saved successfully";
    }

    public List<Location> getAllLocations() {
        return locationRepository.findAll();
    }

    public Optional<Location> getLocationById(Long id) {
        return locationRepository.findById(id);
    }

    public List<Location> getLocationsByType(ELocationType type) {
        return locationRepository.findByType(type);
    }

    public String updateLocation(Long id, Location location) {
        Optional<Location> existing = locationRepository.findById(id);
        if (existing.isPresent()) {
            Location loc = existing.get();
            
            if (location.getName() == null || location.getName().trim().isEmpty()) {
                String defaultName = generateDefaultName(location.getType());
                location.setName(defaultName);
            }
            
            if (!loc.getName().equals(location.getName()) || !loc.getType().equals(location.getType())) {
                if (locationRepository.existsByNameAndType(location.getName(), location.getType())) {
                    return "Another location with this name and type already exists";
                }
            }
            
            String validationError = validateLocationHierarchyForUpdate(loc, location);
            if (validationError != null) {
                return validationError;
            }
            
            loc.setName(location.getName());
            loc.setType(location.getType());
            
            if (location.getParent() != null) {
                Optional<Location> parentOpt = locationRepository.findById(location.getParent().getId());
                if (parentOpt.isPresent()) {
                    String parentError = validateParentChildTypes(parentOpt.get(), location);
                    if (parentError != null) {
                        return parentError;
                    }
                    loc.setParent(parentOpt.get());
                }
            } else {
                loc.setParent(null);
            }
            
            loc.setProvinceCode(location.getProvinceCode());
            loc.setAddress(location.getAddress());
            
            locationRepository.save(loc);
            return "Location updated successfully";
        }
        return "Location not found";
    }

    public String deleteLocation(Long id) {
        Optional<Location> loc = locationRepository.findById(id);
        if (loc.isPresent()) {
            Location location = loc.get();
            
            List<Location> children = locationRepository.findByParent(location);
            if (!children.isEmpty()) {
                return "Cannot delete location that has child locations. Delete child locations first.";
            }
            
            if (!location.getUsers().isEmpty()) {
                return "Cannot delete location that has associated users. Reassign users first.";
            }
            
            locationRepository.deleteById(id);
            return "Location deleted successfully";
        }
        return "Location not found";
    }
    
    public List<Location> getLocationsByParent(Location parent) {
        return locationRepository.findByParent(parent);
    }
    
    public List<Location> getLocationsByParentId(Long parentId) {
        return locationRepository.findByParentId(parentId);
    }
    
    public List<Location> getRootLocations() {
        return locationRepository.findByParentIsNull();
    }
    
    public List<Location> searchLocationsByName(String name) {
        return locationRepository.findByNameContainingIgnoreCase(name);
    }
    
    public Optional<Location> findByNameAndType(String name, ELocationType type) {
        return locationRepository.findByNameAndType(name, type);
    }
    
    public boolean locationExists(Long id) {
        return locationRepository.existsById(id);
    }
    
    private String generateDefaultName(ELocationType type) {
        if (type == null) {
            return "Unnamed Location";
        }
        
        switch (type) {
            case PROVINCE:
                return "New Province";
            case DISTRICT:
                return "New District";
            case SECTOR:
                return "New Sector";
            case CELL:
                return "New Cell";
            case VILLAGE:
                return "New Village";
            default:
                return "New Location";
        }
    }
    
    private String validateLocationHierarchy(Location location) {
        if (location.getParent() != null && location.getParent().getId() != null) {
            Optional<Location> parentOpt = locationRepository.findById(location.getParent().getId());
            if (parentOpt.isPresent()) {
                return validateParentChildTypes(parentOpt.get(), location);
            }
        }
        return null;
    }
    
    private String validateParentChildTypes(Location parent, Location child) {
        switch (parent.getType()) {
            case PROVINCE:
                if (child.getType() != ELocationType.DISTRICT) {
                    return "A Province can only have Districts as children";
                }
                break;
            case DISTRICT:
                if (child.getType() != ELocationType.SECTOR) {
                    return "A District can only have Sectors as children";
                }
                break;
            case SECTOR:
                if (child.getType() != ELocationType.CELL) {
                    return "A Sector can only have Cells as children";
                }
                break;
            case CELL:
                if (child.getType() != ELocationType.VILLAGE) {
                    return "A Cell can only have Villages as children";
                }
                break;
            case VILLAGE:
                return "A Village cannot have child locations";
        }
        return null;
    }
    
    private String validateLocationHierarchyForUpdate(Location existing, Location updated) {
        boolean parentChanged = false;
        if (existing.getParent() == null && updated.getParent() != null) {
            parentChanged = true;
        } else if (existing.getParent() != null && updated.getParent() == null) {
            parentChanged = true;
        } else if (existing.getParent() != null && updated.getParent() != null && 
                  !existing.getParent().getId().equals(updated.getParent().getId())) {
            parentChanged = true;
        }
        
        if (parentChanged && updated.getParent() != null) {
            return validateParentChildTypes(updated.getParent(), updated);
        }
        
        return null;
    }
    
    public Location getLocationWithHierarchy(Long id) {
        return locationRepository.findById(id).orElse(null);
    }
    
    public List<Location> getLocationsByTypeWithParents(ELocationType type) {
        return locationRepository.findByType(type);
    }
    
    public List<Location> getLocationsByProvinceCode(String provinceCode) {
        return locationRepository.findByProvinceCode(provinceCode);
    }
    
    public boolean canBeParent(Long potentialParentId, ELocationType childType) {
        if (potentialParentId == null) {
            return childType == ELocationType.PROVINCE;
        }
        
        Optional<Location> parent = locationRepository.findById(potentialParentId);
        if (parent.isEmpty()) {
            return false;
        }
        
        Location parentLocation = parent.get();
        String error = validateParentChildTypes(parentLocation, 
                new Location("Test", childType, parentLocation));
        
        return error == null;
    }
    
    // NEW METHODS ADDED
    public List<Location> getChildrenByType(Long parentId, ELocationType childType) {
        Optional<Location> parent = locationRepository.findById(parentId);
        if (parent.isEmpty()) {
            return Collections.emptyList();
        }
        
        List<Location> children = locationRepository.findByParent(parent.get());
        return children.stream()
                .filter(child -> child.getType() == childType)
                .collect(Collectors.toList());
    }
    
    public List<Location> getLocationChain(Long locationId) {
        List<Location> chain = new ArrayList<>();
        Optional<Location> current = locationRepository.findById(locationId);
        
        while (current.isPresent()) {
            chain.add(0, current.get());
            current = current.get().getParent() != null 
                ? locationRepository.findById(current.get().getParent().getId())
                : Optional.empty();
        }
        
        return chain;
    }
    
    public Page<Location> getLocationsPaginated(int page, int size, String sortBy, String sortDirection) {
        Sort sort = sortDirection.equalsIgnoreCase("asc") 
                ? Sort.by(sortBy).ascending() 
                : Sort.by(sortBy).descending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        return locationRepository.findAll(pageable);
    }
    
    public String seedRwandaLocations() {
        try {
            if (!locationRepository.findByType(ELocationType.PROVINCE).isEmpty()) {
                return "Locations already seeded";
            }
            
            Location kigali = new Location("Kigali", ELocationType.PROVINCE);
            kigali.setProvinceCode("KGL");
            locationRepository.save(kigali);
            
            Location eastern = new Location("Eastern Province", ELocationType.PROVINCE);
            eastern.setProvinceCode("E");
            locationRepository.save(eastern);
            
            Location western = new Location("Western Province", ELocationType.PROVINCE);
            western.setProvinceCode("W");
            locationRepository.save(western);
            
            Location northern = new Location("Northern Province", ELocationType.PROVINCE);
            northern.setProvinceCode("N");
            locationRepository.save(northern);
            
            Location southern = new Location("Southern Province", ELocationType.PROVINCE);
            southern.setProvinceCode("S");
            locationRepository.save(southern);
            
            Location gasabo = new Location("Gasabo", ELocationType.DISTRICT);
            gasabo.setParent(kigali);
            gasabo.setProvinceCode("KGL");
            locationRepository.save(gasabo);
            
            Location kicukiro = new Location("Kicukiro", ELocationType.DISTRICT);
            kicukiro.setParent(kigali);
            kicukiro.setProvinceCode("KGL");
            locationRepository.save(kicukiro);
            
            Location nyarugenge = new Location("Nyarugenge", ELocationType.DISTRICT);
            nyarugenge.setParent(kigali);
            nyarugenge.setProvinceCode("KGL");
            locationRepository.save(nyarugenge);
            
            Location bumbogo = new Location("Bumbogo", ELocationType.SECTOR);
            bumbogo.setParent(gasabo);
            bumbogo.setProvinceCode("KGL");
            locationRepository.save(bumbogo);
            
            Location bumbogoCell = new Location("Bumbogo", ELocationType.CELL);
            bumbogoCell.setParent(bumbogo);
            bumbogoCell.setProvinceCode("KGL");
            locationRepository.save(bumbogoCell);
            
            Location bwiza = new Location("Bwiza", ELocationType.VILLAGE);
            bwiza.setParent(bumbogoCell);
            bwiza.setProvinceCode("KGL");
            locationRepository.save(bwiza);
            
            Location cyamuhinda = new Location("Cyamuhinda", ELocationType.VILLAGE);
            cyamuhinda.setParent(bumbogoCell);
            cyamuhinda.setProvinceCode("KGL");
            locationRepository.save(cyamuhinda);
            
            return "Rwanda locations seeded successfully!";
            
        } catch (Exception e) {
            return "Failed to seed locations: " + e.getMessage();
        }
    }
}
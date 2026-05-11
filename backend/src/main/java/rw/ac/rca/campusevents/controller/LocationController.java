package rw.ac.rca.campusevents.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import rw.ac.rca.campusevents.model.Location;
import rw.ac.rca.campusevents.model.ELocationType;
import rw.ac.rca.campusevents.service.LocationService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/locations")
public class LocationController {

    @Autowired
    private LocationService locationService;

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createLocation(@RequestBody Location location) {
        String response = locationService.saveLocation(location);
        if (response.equals("Location saved successfully")) {
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        }
        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }

    @PostMapping(value = "/with-parent", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createLocationWithParent(
            @RequestParam Long parentId, 
            @RequestBody Location location) {
        String response = locationService.saveLocationWithParent(parentId, location);
        if (response.equals("Location saved successfully")) {
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } else if (response.equals("Parent location not found")) {
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Location>> getAllLocations() {
        List<Location> locations = locationService.getAllLocations();
        return new ResponseEntity<>(locations, HttpStatus.OK);
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getLocationById(@PathVariable Long id) {
        Optional<Location> location = locationService.getLocationById(id);
        if (location.isPresent()) {
            return new ResponseEntity<>(location.get(), HttpStatus.OK);
        }
        return new ResponseEntity<>("Location not found", HttpStatus.NOT_FOUND);
    }

    @GetMapping(value = "/by-type", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Location>> getLocationsByType(@RequestParam ELocationType type) {
        List<Location> locations = locationService.getLocationsByType(type);
        return new ResponseEntity<>(locations, HttpStatus.OK);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateLocation(@PathVariable Long id, @RequestBody Location location) {
        String response = locationService.updateLocation(id, location);
        if (response.equals("Location updated successfully")) {
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @DeleteMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> deleteLocation(@PathVariable Long id) {
        String response = locationService.deleteLocation(id);
        if (response.equals("Location deleted successfully")) {
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @GetMapping(value = "/by-province-code/{provinceCode}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getLocationByProvinceCode(@PathVariable String provinceCode) {
        List<Location> locations = locationService.getLocationsByProvinceCode(provinceCode);
        if (locations.isEmpty()) {
            return new ResponseEntity<>("No locations found with province code: " + provinceCode, HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(locations, HttpStatus.OK);
    }

    @GetMapping(value = "/{id}/children", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Location>> getChildLocations(@PathVariable Long id) {
        List<Location> children = locationService.getLocationsByParentId(id);
        return new ResponseEntity<>(children, HttpStatus.OK);
    }

    @GetMapping(value = "/roots", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Location>> getRootLocations() {
        List<Location> roots = locationService.getRootLocations();
        return new ResponseEntity<>(roots, HttpStatus.OK);
    }

    @GetMapping(value = "/search", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Location>> searchLocations(@RequestParam String name) {
        List<Location> locations = locationService.searchLocationsByName(name);
        return new ResponseEntity<>(locations, HttpStatus.OK);
    }

    @GetMapping(value = "/find", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> findByNameAndType(@RequestParam String name, @RequestParam ELocationType type) {
        Optional<Location> location = locationService.findByNameAndType(name, type);
        if (location.isPresent()) {
            return new ResponseEntity<>(location.get(), HttpStatus.OK);
        }
        return new ResponseEntity<>("Location not found", HttpStatus.NOT_FOUND);
    }

    @GetMapping(value = "/provinces", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Location>> getAllProvinces() {
        List<Location> provinces = locationService.getLocationsByType(ELocationType.PROVINCE);
        return new ResponseEntity<>(provinces, HttpStatus.OK);
    }
    
    @GetMapping(value = "/provinces/{provinceId}/districts", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getDistrictsByProvinceId(@PathVariable Long provinceId) {
        List<Location> districts = locationService.getChildrenByType(provinceId, ELocationType.DISTRICT);
        if (districts.isEmpty()) {
            return new ResponseEntity<>("No districts found for province", HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(districts, HttpStatus.OK);
    }
    
    @GetMapping(value = "/districts/{districtId}/sectors", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getSectorsByDistrictId(@PathVariable Long districtId) {
        List<Location> sectors = locationService.getChildrenByType(districtId, ELocationType.SECTOR);
        if (sectors.isEmpty()) {
            return new ResponseEntity<>("No sectors found for district", HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(sectors, HttpStatus.OK);
    }
    
    @GetMapping(value = "/sectors/{sectorId}/cells", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getCellsBySectorId(@PathVariable Long sectorId) {
        List<Location> cells = locationService.getChildrenByType(sectorId, ELocationType.CELL);
        if (cells.isEmpty()) {
            return new ResponseEntity<>("No cells found for sector", HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(cells, HttpStatus.OK);
    }
    
    @GetMapping(value = "/cells/{cellId}/villages", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getVillagesByCellId(@PathVariable Long cellId) {
        List<Location> villages = locationService.getChildrenByType(cellId, ELocationType.VILLAGE);
        if (villages.isEmpty()) {
            return new ResponseEntity<>("No villages found for cell", HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(villages, HttpStatus.OK);
    }
    
    @GetMapping(value = "/{id}/chain", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getLocationChain(@PathVariable Long id) {
        List<Location> chain = locationService.getLocationChain(id);
        if (chain.isEmpty()) {
            return new ResponseEntity<>("Location not found", HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(chain, HttpStatus.OK);
    }
    
    @PostMapping(value = "/seed/rwanda", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> seedRwandaLocations() {
        String result = locationService.seedRwandaLocations();
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }
}
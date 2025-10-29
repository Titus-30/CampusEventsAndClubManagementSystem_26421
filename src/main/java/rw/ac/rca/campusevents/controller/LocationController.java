package rw.ac.rca.campusevents.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;

import rw.ac.rca.campusevents.model.Location;
import rw.ac.rca.campusevents.model.User;
import rw.ac.rca.campusevents.service.LocationService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/location")
public class LocationController {

    @Autowired
    private LocationService locationService;

    @PostMapping(value = "/add", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Location> addLocation(@RequestBody Location location) {
        Location saved = locationService.saveLocation(location);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @GetMapping(value = "/all", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Location>> getAllLocations() {
        List<Location> locations = locationService.getAllLocations();
        return new ResponseEntity<>(locations, HttpStatus.OK);
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getLocationById(@PathVariable Long id) {
        Optional<Location> loc = locationService.getLocationById(id);
        return loc.<ResponseEntity<?>>map(location -> new ResponseEntity<>(location, HttpStatus.OK))
                  .orElseGet(() -> new ResponseEntity<>("Location not found", HttpStatus.NOT_FOUND));
    }

    @PutMapping(value = "/update", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateLocation(@RequestBody Location location) {
        Location updated = locationService.updateLocation(location);
        if (updated == null) {
            return new ResponseEntity<>("Location not found", HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteLocation(@PathVariable Long id) {
        String response = locationService.deleteLocation(id);
        HttpStatus status = response.contains("not found") ? HttpStatus.NOT_FOUND : HttpStatus.OK;
        return new ResponseEntity<>(response, status);
    }
    

@GetMapping(value = "/by-province-code/{provinceCode}", produces = MediaType.APPLICATION_JSON_VALUE)
public ResponseEntity<?> getLocationByProvinceCode(@PathVariable String provinceCode) {
    List<Location> loc = locationService.getLocationByProvinceCode(provinceCode);
    
    if (loc.isEmpty()) {
        return new ResponseEntity<>("Location not found", HttpStatus.NOT_FOUND);
    }
    
    return new ResponseEntity<>(loc, HttpStatus.OK);
}


@GetMapping(value = "/type/{locationType}", produces = MediaType.APPLICATION_JSON_VALUE)
public ResponseEntity<List<Location>> getLocationsByType(@PathVariable Location.LocationType locationType) {
    List<Location> locations = locationService.getLocationsByType(locationType);
    return new ResponseEntity<>(locations, HttpStatus.OK);
}

@GetMapping(value = "/{id}/children", produces = MediaType.APPLICATION_JSON_VALUE)
public ResponseEntity<List<Location>> getChildLocations(@PathVariable Long id) {
    List<Location> children = locationService.getChildLocations(id);
    return new ResponseEntity<>(children, HttpStatus.OK);
}

@GetMapping(value = "/{id}/users", produces = MediaType.APPLICATION_JSON_VALUE)
public ResponseEntity<?> getUsersInLocation(@PathVariable Long id) {
    Optional<Location> locOptional = locationService.getLocationById(id);
    
    if (locOptional.isEmpty()) {
        return new ResponseEntity<>("Location not found", HttpStatus.NOT_FOUND);
    }
    
    Location location = locOptional.get();
    List<User> users = location.getUsers();
    
    if (users.isEmpty()) {
        return new ResponseEntity<>("No users found in this location", HttpStatus.NOT_FOUND);
    }
    
    return new ResponseEntity<>(users, HttpStatus.OK);
}
}

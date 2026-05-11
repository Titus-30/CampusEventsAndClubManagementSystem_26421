package rw.ac.rca.campusevents.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;

import rw.ac.rca.campusevents.model.Profile;
import rw.ac.rca.campusevents.service.ProfileService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @PostMapping(value = "/add", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Profile> addProfile(@RequestBody Profile profile) {
        Profile saved = profileService.saveProfile(profile);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @GetMapping(value = "/all", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Profile>> getAllProfiles() {
        List<Profile> profiles = profileService.getAllProfiles();
        return new ResponseEntity<>(profiles, HttpStatus.OK);
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getProfileById(@PathVariable Long id) {
        Optional<Profile> prof = profileService.getProfileById(id);
        return prof.<ResponseEntity<?>>map(profile -> new ResponseEntity<>(profile, HttpStatus.OK))
                   .orElseGet(() -> new ResponseEntity<>("Profile not found", HttpStatus.NOT_FOUND));
    }

    @GetMapping(value = "/user/{userId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getProfileByUserId(@PathVariable Long userId) {
        Optional<Profile> prof = profileService.getProfileByUserId(userId);
        return prof.<ResponseEntity<?>>map(profile -> new ResponseEntity<>(profile, HttpStatus.OK))
                   .orElseGet(() -> new ResponseEntity<>("Profile not found", HttpStatus.NOT_FOUND));
    }

    @PutMapping(value = "/update", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateProfile(@RequestBody Profile profile) {
        Profile updated = profileService.updateProfile(profile);
        if (updated == null) {
            return new ResponseEntity<>("Profile not found", HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteProfile(@PathVariable Long id) {
        String response = profileService.deleteProfile(id);
        HttpStatus status = response.contains("not found") ? HttpStatus.NOT_FOUND : HttpStatus.OK;
        return new ResponseEntity<>(response, status);
    }
}



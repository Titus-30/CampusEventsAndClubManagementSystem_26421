package rw.ac.rca.campusevents.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;

import rw.ac.rca.campusevents.model.Announcement;
import rw.ac.rca.campusevents.service.AnnouncementService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/announcement")
public class AnnouncementController {

    @Autowired
    private AnnouncementService announcementService;

    @PostMapping(value = "/add", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Announcement> addAnnouncement(@RequestBody Announcement announcement) {
        Announcement saved = announcementService.saveAnnouncement(announcement);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @GetMapping(value = "/all", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Object> getAllAnnouncements(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(required = false) String search) {
        
        if (page != null && size != null) {
            // Return Page
            org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size, org.springframework.data.domain.Sort.by("postedAt").descending());
            return new ResponseEntity<>(announcementService.getAllAnnouncementsPaginated(pageable, search), HttpStatus.OK);
        } else {
            // Return List (backward compatibility if needed, or just list all)
            return new ResponseEntity<>(announcementService.getAllAnnouncements(), HttpStatus.OK);
        }
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getAnnouncementById(@PathVariable Long id) {
        Optional<Announcement> announcement = announcementService.getAnnouncementById(id);
        return announcement.<ResponseEntity<?>>map(a -> new ResponseEntity<>(a, HttpStatus.OK))
                           .orElseGet(() -> new ResponseEntity<>("Announcement not found", HttpStatus.NOT_FOUND));
    }

    @PutMapping(value = "/update", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateAnnouncement(@RequestBody Announcement announcement) {
        Announcement updated = announcementService.updateAnnouncement(announcement);
        if (updated == null) {
            return new ResponseEntity<>("Announcement not found", HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteAnnouncement(@PathVariable Long id) {
        String response = announcementService.deleteAnnouncement(id);
        HttpStatus status = response.contains("not found") ? HttpStatus.NOT_FOUND : HttpStatus.OK;
        return new ResponseEntity<>(response, status);
    }
}



package rw.ac.rca.campusevents.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import rw.ac.rca.campusevents.model.Club;
import rw.ac.rca.campusevents.service.ClubService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/club")
public class ClubController {

    @Autowired
    private ClubService clubService;

     
    @PostMapping(value = "/add", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Club> addClub(@RequestBody Club club) {
        club.setStatus(Club.Status.PENDING);  
        Club saved = clubService.saveClub(club);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    
    @PutMapping("/approve/{id}")
    public ResponseEntity<?> approveClub(@PathVariable Long id) {
        Club club = clubService.approveClub(id);
        if (club != null) {
            return new ResponseEntity<>(club, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Club not found", HttpStatus.NOT_FOUND);
        }
    }

    
    @PutMapping("/reject/{id}")
    public ResponseEntity<?> rejectClub(@PathVariable Long id) {
        Club club = clubService.rejectClub(id);
        if (club != null) {
            return new ResponseEntity<>(club, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Club not found", HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping(value = "/paginated", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Page<Club>> getAllClubsPaginated(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "name") String sortBy,
        @RequestParam(defaultValue = "asc") String sortDirection) {

    Sort sort = sortDirection.equalsIgnoreCase("asc")
            ? Sort.by(sortBy).ascending()
            : Sort.by(sortBy).descending();

    Pageable pageable = PageRequest.of(page, size, sort);
    Page<Club> clubs = clubService.getAllClubsPaginated(pageable);

    return new ResponseEntity<>(clubs, HttpStatus.OK);
}
    @GetMapping(value = "/all", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Club>> getAllClubs() {
        List<Club> clubs = clubService.getAllClubs();
        return new ResponseEntity<>(clubs, HttpStatus.OK);
    }

    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Club>> getClubsByStatus(@PathVariable Club.Status status) {
        List<Club> clubs = clubService.getClubsByStatus(status);
        return new ResponseEntity<>(clubs, HttpStatus.OK);
    }

    
    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getClubById(@PathVariable Long id) {
        Optional<Club> club = clubService.getClubById(id);
        return club.<ResponseEntity<?>>map(c -> new ResponseEntity<>(c, HttpStatus.OK))
                   .orElseGet(() -> new ResponseEntity<>("Club not found", HttpStatus.NOT_FOUND));
    }

    
    @PutMapping(value = "/update", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateClub(@RequestBody Club club) {
        Club updated = clubService.updateClub(club);
        if (updated == null) {
            return new ResponseEntity<>("Club not found", HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteClub(@PathVariable Long id) {
        String response = clubService.deleteClub(id);
        HttpStatus status = response.contains("not found") ? HttpStatus.NOT_FOUND : HttpStatus.OK;
        return new ResponseEntity<>(response, status);
    }
}

package rw.ac.rca.campusevents.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;

import rw.ac.rca.campusevents.model.Membership;
import rw.ac.rca.campusevents.service.MembershipService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/membership")
public class MembershipController {

    @Autowired
    private MembershipService membershipService;

    @PostMapping(value = "/add", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Membership> addMembership(@RequestBody Membership membership) {
        Membership saved = membershipService.saveMembership(membership);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @GetMapping(value = "/all", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Membership>> getAllMemberships() {
        List<Membership> memberships = membershipService.getAllMemberships();
        return new ResponseEntity<>(memberships, HttpStatus.OK);
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getMembershipById(@PathVariable Long id) {
        Optional<Membership> membership = membershipService.getMembershipById(id);
        return membership.<ResponseEntity<?>>map(m -> new ResponseEntity<>(m, HttpStatus.OK))
                         .orElseGet(() -> new ResponseEntity<>("Membership not found", HttpStatus.NOT_FOUND));
    }

    @PutMapping(value = "/update", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateMembership(@RequestBody Membership membership) {
        Membership updated = membershipService.updateMembership(membership);
        if (updated == null) {
            return new ResponseEntity<>("Membership not found", HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteMembership(@PathVariable Long id) {
        String response = membershipService.deleteMembership(id);
        HttpStatus status = response.contains("not found") ? HttpStatus.NOT_FOUND : HttpStatus.OK;
        return new ResponseEntity<>(response, status);
    }
}

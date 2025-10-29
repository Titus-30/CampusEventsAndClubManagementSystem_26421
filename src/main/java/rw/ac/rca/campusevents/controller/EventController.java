package rw.ac.rca.campusevents.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;


import rw.ac.rca.campusevents.model.Event;
import rw.ac.rca.campusevents.service.EventService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/event")
public class EventController {

    @Autowired
    private EventService eventService;

    @PostMapping(value = "/add", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Event> addEvent(@RequestBody Event event) {
        Event saved = eventService.saveEvent(event);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @GetMapping(value = "/paginated", produces = MediaType.APPLICATION_JSON_VALUE)
public ResponseEntity<Page<Event>> getAllEventsPaginated(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "startTime") String sortBy,
        @RequestParam(defaultValue = "asc") String sortDirection) {

    Sort sort = sortDirection.equalsIgnoreCase("asc")
            ? Sort.by(sortBy).ascending()
            : Sort.by(sortBy).descending();

    Pageable pageable = PageRequest.of(page, size, sort);
    Page<Event> events = eventService.getAllEventsPaginated(pageable);

    return new ResponseEntity<>(events, HttpStatus.OK);
}

    @GetMapping(value = "/all", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Event>> getAllEvents() {
        List<Event> events = eventService.getAllEvents();
        return new ResponseEntity<>(events, HttpStatus.OK);
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getEventById(@PathVariable Long id) {
        Optional<Event> event = eventService.getEventById(id);
        return event.<ResponseEntity<?>>map(e -> new ResponseEntity<>(e, HttpStatus.OK))
                    .orElseGet(() -> new ResponseEntity<>("Event not found", HttpStatus.NOT_FOUND));
    }

    @PutMapping(value = "/update", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateEvent(@RequestBody Event event) {
        Event updated = eventService.updateEvent(event);
        if (updated == null) {
            return new ResponseEntity<>("Event not found", HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteEvent(@PathVariable Long id) {
        String response = eventService.deleteEvent(id);
        HttpStatus status = response.contains("not found") ? HttpStatus.NOT_FOUND : HttpStatus.OK;
        return new ResponseEntity<>(response, status);
    }
}

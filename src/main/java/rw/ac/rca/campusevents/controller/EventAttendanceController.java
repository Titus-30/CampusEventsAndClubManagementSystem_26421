package rw.ac.rca.campusevents.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;

import rw.ac.rca.campusevents.model.EventAttendance;
import rw.ac.rca.campusevents.service.EventAttendanceService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/attendance")
public class EventAttendanceController {

    @Autowired
    private EventAttendanceService attendanceService;

    @PostMapping(value = "/add", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<EventAttendance> addAttendance(@RequestBody EventAttendance attendance) {
        EventAttendance saved = attendanceService.saveAttendance(attendance);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @GetMapping(value = "/all", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<EventAttendance>> getAllAttendances() {
        List<EventAttendance> attendances = attendanceService.getAllAttendances();
        return new ResponseEntity<>(attendances, HttpStatus.OK);
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getAttendanceById(@PathVariable Long id) {
        Optional<EventAttendance> attendance = attendanceService.getAttendanceById(id);
        return attendance.<ResponseEntity<?>>map(a -> new ResponseEntity<>(a, HttpStatus.OK))
                         .orElseGet(() -> new ResponseEntity<>("Attendance not found", HttpStatus.NOT_FOUND));
    }

    @PutMapping(value = "/update", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateAttendance(@RequestBody EventAttendance attendance) {
        EventAttendance updated = attendanceService.updateAttendance(attendance);
        if (updated == null) {
            return new ResponseEntity<>("Attendance not found", HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteAttendance(@PathVariable Long id) {
        String response = attendanceService.deleteAttendance(id);
        HttpStatus status = response.contains("not found") ? HttpStatus.NOT_FOUND : HttpStatus.OK;
        return new ResponseEntity<>(response, status);
    }
}

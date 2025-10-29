package rw.ac.rca.campusevents.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import rw.ac.rca.campusevents.model.EventAttendance;
import rw.ac.rca.campusevents.repository.EventAttendanceRepository;

@Service
public class EventAttendanceService {

    @Autowired
    private EventAttendanceRepository eventAttendanceRepository;

    public EventAttendance saveAttendance(EventAttendance attendance) {
        return eventAttendanceRepository.save(attendance);
    }

    public List<EventAttendance> getAllAttendances() {
        return eventAttendanceRepository.findAll();
    }

    public Optional<EventAttendance> getAttendanceById(Long id) {
        return eventAttendanceRepository.findById(id);
    }

    public EventAttendance updateAttendance(EventAttendance attendance) {
        if(eventAttendanceRepository.existsById(attendance.getId())) {
            return eventAttendanceRepository.save(attendance);
        } else {
            return null;
        }
    }

    public String deleteAttendance(Long id) {
        if(eventAttendanceRepository.existsById(id)) {
            eventAttendanceRepository.deleteById(id);
            return "Attendance deleted successfully";
        } else {
            return "Attendance not found";
        }
    }
}

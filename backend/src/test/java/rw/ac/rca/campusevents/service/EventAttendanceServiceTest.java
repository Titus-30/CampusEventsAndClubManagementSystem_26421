package rw.ac.rca.campusevents.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import rw.ac.rca.campusevents.model.EventAttendance;
import rw.ac.rca.campusevents.model.Event;
import rw.ac.rca.campusevents.model.User;
import rw.ac.rca.campusevents.repository.EventAttendanceRepository;

@ExtendWith(MockitoExtension.class)
public class EventAttendanceServiceTest {

    @Mock
    private EventAttendanceRepository eventAttendanceRepository;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private EventAttendanceService eventAttendanceService;

    private EventAttendance attendance;
    private Event event;
    private User student;

    @BeforeEach
    void setUp() {
        student = new User();
        student.setId(1L);
        student.setFullName("Student Attendee");

        User organizer = new User();
        organizer.setId(2L);

        event = new Event();
        event.setId(1L);
        event.setTitle("Hackathon");
        event.setCreatedBy(organizer);

        attendance = new EventAttendance();
        attendance.setId(1L);
        attendance.setUser(student);
        attendance.setEvent(event);
    }

    @Test
    void saveAttendance_Success() {
        when(eventAttendanceRepository.save(any(EventAttendance.class))).thenReturn(attendance);

        EventAttendance saved = eventAttendanceService.saveAttendance(attendance);

        assertNotNull(saved);
        verify(eventAttendanceRepository, times(1)).save(attendance);
        verify(notificationService, times(1)).createNotification(any(), anyString(), any(), anyLong(), anyString());
    }

    @Test
    void getAttendanceById_Found() {
        when(eventAttendanceRepository.findById(1L)).thenReturn(Optional.of(attendance));

        Optional<EventAttendance> found = eventAttendanceService.getAttendanceById(1L);

        assertTrue(found.isPresent());
        assertEquals(1L, found.get().getId());
    }
}

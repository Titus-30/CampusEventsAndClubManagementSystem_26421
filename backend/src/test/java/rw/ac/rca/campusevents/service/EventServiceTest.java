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
import rw.ac.rca.campusevents.model.Event;
import rw.ac.rca.campusevents.repository.EventRepository;

@ExtendWith(MockitoExtension.class)
public class EventServiceTest {

    @Mock
    private EventRepository eventRepository;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private EventService eventService;

    private Event event;

    @BeforeEach
    void setUp() {
        event = new Event();
        event.setId(1L);
        event.setTitle("Workshop");
        event.setDescription("AUCA ML Workshop");
        event.setVenue("Room 1");
    }

    @Test
    void saveEvent_Success() {
        when(eventRepository.save(any(Event.class))).thenReturn(event);

        Event savedEvent = eventService.saveEvent(event);

        assertNotNull(savedEvent);
        assertEquals("Workshop", savedEvent.getTitle());
        verify(eventRepository, times(1)).save(event);
        verify(notificationService, times(1)).notifyAllUsers(anyString(), any(), anyLong(), anyString());
    }

    @Test
    void getEventById_Found() {
        when(eventRepository.findById(1L)).thenReturn(Optional.of(event));

        Optional<Event> found = eventService.getEventById(1L);

        assertTrue(found.isPresent());
        assertEquals("Workshop", found.get().getTitle());
    }

    @Test
    void deleteEvent_Success() {
        when(eventRepository.existsById(1L)).thenReturn(true);

        String result = eventService.deleteEvent(1L);

        assertEquals("Event deleted successfully", result);
        verify(eventRepository, times(1)).deleteById(1L);
    }
}

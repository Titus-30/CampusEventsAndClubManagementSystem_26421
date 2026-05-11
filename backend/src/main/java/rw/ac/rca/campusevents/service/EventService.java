package rw.ac.rca.campusevents.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import rw.ac.rca.campusevents.model.Event;
import rw.ac.rca.campusevents.model.Notification;
import rw.ac.rca.campusevents.repository.EventRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private NotificationService notificationService;

    public Page<Event> getAllEventsPaginated(Pageable pageable) {
    return eventRepository.findAll(pageable);
}

    public Event saveEvent(Event event) {
        Event saved = eventRepository.save(event);
        // Notify all users
        notificationService.notifyAllUsers(
            "New Event '" + saved.getTitle() + "' has been created. You can RSVP to it if you want.",
            Notification.Type.INFO,
            saved.getId(),
            "EVENT"
        );
        return saved;
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Optional<Event> getEventById(Long id) {
        return eventRepository.findById(id);
    }

    public Event updateEvent(Event event) {
        if(eventRepository.existsById(event.getId())) {
            Event updated = eventRepository.save(event);
            notificationService.notifyAllUsers(
                "Event Updated: '" + updated.getTitle() + "'. Check details!", 
                Notification.Type.INFO, 
                updated.getId(), 
                "EVENT"
            );
            return updated;
        } else {
            return null;
        }
    }

    public String deleteEvent(Long id) {
        if(eventRepository.existsById(id)) {
            eventRepository.deleteById(id);
             notificationService.notifyAllUsers(
                "An event has been deleted.", 
                Notification.Type.INFO, 
                null, 
                "EVENT"
            );
            return "Event deleted successfully";
        } else {
            return "Event not found";
        }
    }
}



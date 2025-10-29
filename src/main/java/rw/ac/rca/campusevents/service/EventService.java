package rw.ac.rca.campusevents.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import rw.ac.rca.campusevents.model.Event;
import rw.ac.rca.campusevents.repository.EventRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    public Page<Event> getAllEventsPaginated(Pageable pageable) {
    return eventRepository.findAll(pageable);
}

    public Event saveEvent(Event event) {
        return eventRepository.save(event);
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Optional<Event> getEventById(Long id) {
        return eventRepository.findById(id);
    }

    public Event updateEvent(Event event) {
        if(eventRepository.existsById(event.getId())) {
            return eventRepository.save(event);
        } else {
            return null;
        }
    }

    public String deleteEvent(Long id) {
        if(eventRepository.existsById(id)) {
            eventRepository.deleteById(id);
            return "Event deleted successfully";
        } else {
            return "Event not found";
        }
    }
}

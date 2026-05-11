package rw.ac.rca.campusevents.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "events")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    @Column(length = 2000)
    private String description;
    private String venue;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "club_id")
    @JsonIgnoreProperties({"events", "memberships", "hibernateLazyInitializer", "handler"})
    private Club club;

    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private EventCategory category;

    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    @JsonIgnoreProperties({"eventAttendances", "memberships", "location", "profile", "hibernateLazyInitializer", "handler"})
    private User createdBy;

    
    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<EventAttendance> eventAttendances = new ArrayList<>();

    // Constructors, getters, setters remain the same
    public Event() {}

    public Event(Long id, String title, String description, String venue, LocalDateTime startTime, LocalDateTime endTime, Club club, EventCategory category, User createdBy, List<EventAttendance> eventAttendances) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.venue = venue;
        this.startTime = startTime;
        this.endTime = endTime;
        this.club = club;
        this.category = category;
        this.createdBy = createdBy;
        this.eventAttendances = eventAttendances;
    }

    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getVenue() { return venue; }
    public void setVenue(String venue) { this.venue = venue; }

    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }

    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }

    public Club getClub() { return club; }
    public void setClub(Club club) { this.club = club; }

    public EventCategory getCategory() { return category; }
    public void setCategory(EventCategory category) { this.category = category; }

    public User getCreatedBy() { return createdBy; }
    public void setCreatedBy(User createdBy) { this.createdBy = createdBy; }

    public List<EventAttendance> getEventAttendances() { return eventAttendances; }
    public void setEventAttendances(List<EventAttendance> eventAttendances) { this.eventAttendances = eventAttendances; }
}
package rw.ac.rca.campusevents.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "event_attendances",
       uniqueConstraints = {@UniqueConstraint(columnNames = {"user_id", "event_id"})})
public class EventAttendance {

    public enum AttendanceStatus {
        GOING, NOT_GOING, MAYBE
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id")
    private Event event;

    @Enumerated(EnumType.STRING)
    private AttendanceStatus status;

    private LocalDateTime respondedAt;

    public EventAttendance() {}

    public EventAttendance(Long id, User user, Event event, AttendanceStatus status, LocalDateTime respondedAt) {
        this.id = id;
        this.user = user;
        this.event = event;
        this.status = status;
        this.respondedAt = respondedAt;
    }

    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Event getEvent() { return event; }
    public void setEvent(Event event) { this.event = event; }

    public AttendanceStatus getStatus() { return status; }
    public void setStatus(AttendanceStatus status) { this.status = status; }

    public LocalDateTime getRespondedAt() { return respondedAt; }
    public void setRespondedAt(LocalDateTime respondedAt) { this.respondedAt = respondedAt; }
}



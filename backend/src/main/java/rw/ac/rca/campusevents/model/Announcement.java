package rw.ac.rca.campusevents.model;

 
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "announcements")
public class Announcement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

     
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

     
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "club_id")
    private Club club;

    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id")
    private Event event;

    @Column(length = 2000)
    private String message;

    private LocalDateTime postedAt;

    public Announcement() {}

    public Announcement(Long id, User user, Club club, Event event, String message, LocalDateTime postedAt) {
        this.id = id;
        this.user = user;
        this.club = club;
        this.event = event;
        this.message = message;
        this.postedAt = postedAt;
    }

    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Club getClub() { return club; }
    public void setClub(Club club) { this.club = club; }

    public Event getEvent() { return event; }
    public void setEvent(Event event) { this.event = event; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public LocalDateTime getPostedAt() { return postedAt; }
    public void setPostedAt(LocalDateTime postedAt) { this.postedAt = postedAt; }
}



package rw.ac.rca.campusevents.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "clubs")

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Club {

    public enum Status {
        PENDING, APPROVED, REJECTED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;

    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "location"}) // ignore problematic lazy fields
    private User createdBy;

    
    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;

    
    @OneToMany(mappedBy = "club", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Membership> memberships = new ArrayList<>();

    
    @OneToMany(mappedBy = "club", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Event> events = new ArrayList<>();

    public Club() {}

    public Club(Long id, String name, String description, User createdBy, Status status,
                List<Membership> memberships, List<Event> events) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.createdBy = createdBy;
        this.status = status;
        this.memberships = memberships;
        this.events = events;
    }

    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public User getCreatedBy() { return createdBy; }
    public void setCreatedBy(User createdBy) { this.createdBy = createdBy; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public List<Membership> getMemberships() { return memberships; }
    public void setMemberships(List<Membership> memberships) { this.memberships = memberships; }

    public List<Event> getEvents() { return events; }
    public void setEvents(List<Event> events) { this.events = events; }
}



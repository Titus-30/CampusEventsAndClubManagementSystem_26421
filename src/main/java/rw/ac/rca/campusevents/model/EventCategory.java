package rw.ac.rca.campusevents.model;

import jakarta.persistence.*;

@Entity
@Table(name = "event_categories")
public class EventCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    public EventCategory() {}

    public EventCategory(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}

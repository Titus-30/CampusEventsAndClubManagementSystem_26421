package rw.ac.rca.campusevents.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {

    public enum Type {
        INFO, ALERT, SUCCESS
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String message;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_id")
    private User recipient;

    private boolean isRead = false;

    private LocalDateTime createdAt = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    private Type type = Type.INFO;

    // Optional: Link to related entity ID (e.g., Club ID, Event ID) for navigation
    private Long relatedId;
    private String relatedEntity; // "CLUB", "EVENT", "MEMBERSHIP"

    public Notification() {}

    public Notification(String message, User recipient, Type type) {
        this.message = message;
        this.recipient = recipient;
        this.type = type;
    }

    public Notification(String message, User recipient, Type type, Long relatedId, String relatedEntity) {
        this.message = message;
        this.recipient = recipient;
        this.type = type;
        this.relatedId = relatedId;
        this.relatedEntity = relatedEntity;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public User getRecipient() { return recipient; }
    public void setRecipient(User recipient) { this.recipient = recipient; }

    public boolean isRead() { return isRead; }
    public void setRead(boolean read) { isRead = read; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public Type getType() { return type; }
    public void setType(Type type) { this.type = type; }

    public Long getRelatedId() { return relatedId; }
    public void setRelatedId(Long relatedId) { this.relatedId = relatedId; }

    public String getRelatedEntity() { return relatedEntity; }
    public void setRelatedEntity(String relatedEntity) { this.relatedEntity = relatedEntity; }
}

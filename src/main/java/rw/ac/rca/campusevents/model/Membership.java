package rw.ac.rca.campusevents.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "memberships",
       uniqueConstraints = {@UniqueConstraint(columnNames = {"user_id", "club_id"})})
public class Membership {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "club_id")
    private Club club;

    private LocalDateTime joinedAt;
    private LocalDateTime leftAt; 

    public Membership() {}

    public Membership(Long id, User user, Club club, LocalDateTime joinedAt, LocalDateTime leftAt) {
        this.id = id;
        this.user = user;
        this.club = club;
        this.joinedAt = joinedAt;
        this.leftAt = leftAt;
    }

    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Club getClub() { return club; }
    public void setClub(Club club) { this.club = club; }

    public LocalDateTime getJoinedAt() { return joinedAt; }
    public void setJoinedAt(LocalDateTime joinedAt) { this.joinedAt = joinedAt; }

    public LocalDateTime getLeftAt() { return leftAt; }
    public void setLeftAt(LocalDateTime leftAt) { this.leftAt = leftAt; }
}

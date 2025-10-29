package rw.ac.rca.campusevents.model;

import jakarta.persistence.*;

@Entity
@Table(name = "profiles")
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String phone;
    private String bio;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    public Profile() {}

    public Profile(Long id, String phone, String bio, User user) {
        this.id = id;
        this.phone = phone;
        this.bio = bio;
        this.user = user;
    }

    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}

package ar.uba.fi.ingsoft1.todo_template.user.verificacion;

import ar.uba.fi.ingsoft1.todo_template.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import java.time.Instant;

@Entity
public class VerificationToken {

    @Id
    private String content;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false)
    private Instant expiresAt;

    public VerificationToken() {}

    public VerificationToken(String content, User user, Instant expiresAt) {
        this.content = content;
        this.user = user;
        this.expiresAt = expiresAt;
    }

    public String value() {
        return content;
    }

    public void setValue(String content) {
        this.content = content;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setExpiresAt(Instant expiresAt) {
        this.expiresAt = expiresAt;
    }

    public boolean isExpired() {
        return expiresAt.isBefore(Instant.now());
    }
}

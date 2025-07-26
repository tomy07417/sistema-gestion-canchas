package ar.uba.fi.ingsoft1.todo_template.user;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.List;

@Entity(name = "users")
public class User implements UserDetails, UserCredentials {

    @Id
    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column()
    private String gender;

    @Column()
    private Integer age;

    @Column()
    private String zone;

    @Column(nullable = false)
    private boolean verified;

    @Column(nullable = false)
    private String role;

    @Column()
    private String pendingInviteToken;

    public User() {}

    public User(String username, String password, String email, String firstName, String lastName, String gender, Integer age, String zone, String role) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.gender = gender;
        this.age = age;
        this.zone = zone;
        this.verified = false;
        this.role = role;
        this.pendingInviteToken = null;
    }

    public String getPendingInviteToken() {
        return pendingInviteToken;
    }

    public void setPendingInviteToken(String pendingInviteToken) {
        this.pendingInviteToken = pendingInviteToken;
    }

    @Override
    public String email() {
        return this.email;
    }

    @Override
    public String password() {
        return this.password;
    }

    @Override
    public String getUsername() {
        return this.username;
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public void setVerified(boolean verified) {
        this.verified = verified;
    }

    public boolean isVerified() {
        return verified;
    }

    public String getNombre() {
        return firstName + " " + lastName;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role));
    }
}

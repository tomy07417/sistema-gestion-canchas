package ar.uba.fi.ingsoft1.todo_template.equipo;

import java.util.Optional;

import ar.uba.fi.ingsoft1.todo_template.equipo.dtos.EquipoDTO;
import ar.uba.fi.ingsoft1.todo_template.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Equipo {
    
    @Id
    @Column(unique = true, nullable = false)
    private String id;

    @ManyToOne
    @JoinColumn(name = "captain_id", nullable = false, referencedColumnName = "username")
    private User captain;

    @Column(nullable = true)
    private String category;

    @Column(nullable = true)
    private String mainColors;

    @Column(nullable = true)
    private String secondaryColors;

    public Equipo() {}

    public Equipo(String id, User captain, String category, String mainColors, String secondaryColors) {
        this.id = id;
        this.captain = captain;
        this.category = category;
        this.mainColors = mainColors;
        this.secondaryColors = secondaryColors;
    }

    public String getId() {
        return id;
    }

    public User getCaptain() {
        return captain;
    }

    public EquipoDTO asEquipoDTO() {
        return new EquipoDTO(id, category, mainColors, secondaryColors, captain.getUsername());
    }

    public void update(String id,
                       Optional<String> category,
                       Optional<String> mainColors,
                       Optional<String> secondaryColors) {
        this.id = id;
        this.category = category.orElse(this.category);
        this.mainColors = mainColors.orElse(this.mainColors);
        this.secondaryColors = secondaryColors.orElse(this.secondaryColors);
    }
}

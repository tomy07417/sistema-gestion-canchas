package ar.uba.fi.ingsoft1.todo_template.user.dtos;

import jakarta.validation.constraints.NotBlank;
import java.util.Optional;
import java.util.function.Function;

import ar.uba.fi.ingsoft1.todo_template.user.User;
import ar.uba.fi.ingsoft1.todo_template.user.UserCredentials;

public record UserCreateDTO(
        @NotBlank String username,
        @NotBlank String password,
        @NotBlank String email,
        @NotBlank String firstName,
        @NotBlank String lastName,
        Optional<String> gender,
        Optional<Integer> age,
        Optional<String> zone,
        @NotBlank String rol,
        Optional<String> pendingInviteToken
) implements UserCredentials {
    public User asUser(Function<String, String> encryptPassword) {
        User user = new User(
                username,
                encryptPassword.apply(password),
                email,
                firstName,
                lastName,
                gender.orElse(null),
                age.orElse(null),
                zone.orElse(null),
                rol
        );
        pendingInviteToken.ifPresent(user::setPendingInviteToken);
        return user;
    }
}

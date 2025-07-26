package ar.uba.fi.ingsoft1.todo_template.user.verificacion;

import org.springframework.data.jpa.repository.JpaRepository;

public interface VerificationTokenRepository extends JpaRepository<VerificationToken, String> {
}


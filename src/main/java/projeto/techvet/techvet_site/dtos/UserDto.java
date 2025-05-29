package projeto.techvet.techvet_site.dtos;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Valid
public record UserDto(@NotBlank String nomePet,
    @NotBlank String nomeDono,
    @NotBlank String descricaoProblema,
    @NotNull LocalDate data,
    @NotNull LocalTime hora,
    @Email @NotBlank String email

) {}

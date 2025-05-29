package projeto.techvet.techvet_site.dtos;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UserUpdateDto(
    @NotBlank String nomePet,
    @NotBlank String nomeDono,
    @NotBlank String descricaoProblema,
    @NotNull LocalDate data,
    @NotNull LocalTime hora
) {
    // Nenhum getter manual necessário
}
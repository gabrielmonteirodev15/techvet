package projeto.techvet.techvet_site.repositories;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import projeto.techvet.techvet_site.models.UserModel;

public interface TechvetRepository extends JpaRepository<UserModel, UUID> {
    List<UserModel> findByDataHoraConsultaBetween(LocalDateTime inicio, LocalDateTime fim);

    @Query("SELECT DISTINCT a.dataHoraConsulta FROM UserModel a ORDER BY a.dataHoraConsulta ASC")
    List<LocalDateTime> findDatasComAgendamentos();

    boolean existsByDataHoraConsulta(LocalDateTime dataHoraConsulta);
}

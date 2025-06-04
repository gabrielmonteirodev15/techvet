package projeto.techvet.techvet_site.controllers;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.Optional;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import projeto.techvet.techvet_site.dtos.UserDto;
import projeto.techvet.techvet_site.dtos.UserUpdateDto;
import projeto.techvet.techvet_site.models.UserModel;
import projeto.techvet.techvet_site.repositories.TechvetRepository;

@RestController
@RequestMapping("/agendamentos")
public class TechvetController {

    @Autowired
    private TechvetRepository userRepository;

    @PostMapping
    public ResponseEntity<?> agendarConsulta(@RequestBody @Valid UserDto dto) {
        LocalDateTime dataHoraConsulta = LocalDateTime.of(dto.data(), dto.hora());
        
        if(userRepository.existsByDataHoraConsulta(dataHoraConsulta)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Já existe um agendamento para este horário.");
        }

        var userModel = new UserModel();
        BeanUtils.copyProperties(dto, userModel);
        userModel.setDataHoraConsulta(dataHoraConsulta);

        return ResponseEntity.status(HttpStatus.CREATED).body(userRepository.save(userModel));
    }

    @GetMapping
    public ResponseEntity<List<UserModel>> listarConsultas() {
        return ResponseEntity.status(HttpStatus.OK).body(userRepository.findAll());
    }

    public TechvetController(TechvetRepository techvetRepository) {
        this.userRepository = techvetRepository;
    }

    @GetMapping("/datas-disponiveis")
    public List<LocalDate> listarDatasDisponiveis() {
        return userRepository.findDatasComAgendamentos().stream()
            .map(LocalDateTime::toLocalDate)
            .distinct()
            .sorted()
            .toList();
    }


    @GetMapping("/dia")
    public ResponseEntity<List<UserModel>> getAgendamentosPorData(@RequestParam("data") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data) {
        List<UserModel> agendamentos = userRepository.findByDataHoraConsultaBetween(
            data.atStartOfDay(),
            data.plusDays(1).atStartOfDay()
        );
        return ResponseEntity.status(HttpStatus.OK).body(agendamentos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> consultarPorId(@PathVariable UUID id) {
        return userRepository.findById(id)
            .<ResponseEntity<Object>>map(ResponseEntity::ok)
            .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Consulta não encontrada."));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletarConsulta(@PathVariable UUID id) {
        return userRepository.findById(id).map(user -> {
            userRepository.delete(user);
            return ResponseEntity.ok("Consulta cancelada com sucesso.");
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Consulta não encontrada."));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> alterarConsulta(@PathVariable UUID id, @RequestBody @Valid UserUpdateDto userUpdateDto) {
        Optional<UserModel> userTechVet = userRepository.findById(id);
        if(userTechVet.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        
        UserModel userModel = userTechVet.get();
        
        LocalDateTime novaDataHora = LocalDateTime.of(userUpdateDto.data(), userUpdateDto.hora());
        
        if(!novaDataHora.equals(userModel.getDataHoraConsulta()) && userRepository.existsByDataHoraConsulta(novaDataHora)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Já existe um agendamento para este horário.");
        }
        userModel.setNomePet(userUpdateDto.nomePet());
        userModel.setNomeDono(userUpdateDto.nomeDono());
        userModel.setDataHoraConsulta(novaDataHora);
        userModel.setDescricaoProblema(userUpdateDto.descricaoProblema());

        userRepository.save(userModel);
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}

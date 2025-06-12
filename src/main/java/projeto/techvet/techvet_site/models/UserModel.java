package projeto.techvet.techvet_site.models;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "TB_Clientes")
public class UserModel implements Serializable{

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID idCliente;

    @Column(name = "animal")
    private String nomePet;

    @Column(name = "dono")
    private String nomeDono;

    @Column(name = "problema")
    private String descricaoProblema;

    @Column(name = "email")
    private String email;

    private LocalDateTime dataHoraConsulta;
    
    public String getDescricaoProblema() {
        return descricaoProblema;
    }

    public void setDescricaoProblema(String descricaoProblema) {
        this.descricaoProblema = descricaoProblema;
    }

    public UUID getIdCliente() {
        return idCliente;
    }
    public void setIdCliente(UUID idCliente) {
        this.idCliente = idCliente;
    }
    public String getNomePet() {
        return nomePet;
    }
    public void setNomePet(String nomePet) {
        this.nomePet = nomePet;
    }
    public String getNomeDono() {
        return nomeDono;
    }
    public void setNomeDono(String nomeDono) {
        this.nomeDono = nomeDono;
    }
    public LocalDateTime getDataHoraConsulta() {
        return dataHoraConsulta;
    }
    public void setDataHoraConsulta(LocalDateTime dataHoraConsulta) {
        this.dataHoraConsulta = dataHoraConsulta;
    }

    public String getEmail() {
        return email;
    }



    public void setEmail(String email) {
        this.email = email;
    }

}

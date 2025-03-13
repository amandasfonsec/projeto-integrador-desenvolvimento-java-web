package br.com.altf4.futstore.model;

import br.com.altf4.futstore.enums.Grupo;
import br.com.altf4.futstore.enums.Status;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data

@Entity
@Table(name = "Usuario")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @NotBlank(message = "O campo nome é obrigatório")
    @Column(name = "nome", length = 100, nullable = false)
    private String nome;

    @Email(message = "Insira um email válido")
    @NotBlank(message = "O campo email é obrigatório")
    @Column(name = "email", length = 100, nullable = false)
    private String email;

    @NotBlank(message = "O campo senha é obrigatório")
    @Column(name = "senha", length = 100, nullable = false)
    private String senha;

    @NotBlank(message = "O campo cpf é obrigatório")
    @Column(name = "cpf", length = 14, nullable = false)
    private String cpf;

    //@NotBlank(message = "O campo grupo é obrigatório")
    @Enumerated(EnumType.STRING) 
    @Column(name = "grupo", length = 100, nullable = false)
    private Grupo grupo;

    @Enumerated(EnumType.STRING) 
    @Column(name = "status", length = 100, nullable = false)
    private Status status = Status.ATIVO;

    
}



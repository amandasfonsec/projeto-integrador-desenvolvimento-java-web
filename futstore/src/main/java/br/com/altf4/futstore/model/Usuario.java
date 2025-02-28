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

@Entity
@Table(name = "usuario")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "nome", length = 100, nullable = false)
    private String nome;

    @Column(name = "email", length = 100, nullable = false)
    private String email;

    @Column(name = "senha", length = 100, nullable = false)
    private String senha;

    @Column(name = "cpf", length = 14, nullable = false)
    private String cpf;

    @Enumerated(EnumType.STRING) 
    @Column(name = "grupo", length = 100, nullable = false)
    private Grupo grupo;

    @Enumerated(EnumType.STRING) 
    @Column(name = "status", length = 100, nullable = false)
    private Status status;

    public Usuario() {}

    public Usuario(int id, String nome, String email, String senha, String cpf, Grupo grupo, Status status) {
        super();
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.cpf = cpf;
        this.grupo = grupo;
        this.status = status;
    }

    public Usuario(String nome, String email, String senha, String cpf, Grupo grupo, Status status) {
        super();
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.cpf = cpf;
        this.grupo = grupo;
        this.status = status;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public Grupo getGrupo() {
        return grupo;
    }

    public void setGrupo(Grupo grupo) {
        this.grupo = grupo;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }
}



package br.com.altf4.futstore.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "endereco")
public class Endereco {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_endereco")
    private Long id_endereco;

    @Column(name = "cep", length = 9, nullable = false)
    private String cep;

    @Column(name = "logradouro", length = 100, nullable = false)
    private String logradouro;

    @Column(name = "numero", length = 10)
    private String numero;

    @Column(name = "complemento", length = 100)
    private String complemento;

    @Column(name = "bairro", length = 100)
    private String bairro;

    @Column(name = "cidade", length = 100)
    private String cidade;

    @Column(name = "uf", length = 2)
    private String uf;

    @Column(name = "tipo", length = 20)
    private String tipo;

    @Column(name = "endereco_padrao", nullable = false)
    private boolean enderecoPadrao = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fk_cliente_id", nullable = false)
    @JsonIgnore
    private Cliente cliente;

}

package br.com.altf4.futstore.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "ProdutoImagem")
public class ProdutoImagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) // ou EAGER se quiser carregar sempre
    @JoinColumn(name = "produto_codigo", nullable = false)
    @JsonIgnore
    private Produto produto;

    @Column(name = "tipo_arquivo", length = 100)
    private String tipoArquivo;

    @Lob
    @Column(name = "dados", columnDefinition = "LONGBLOB", nullable = false)
    private byte[] dados;

    @Column(name = "principal")
    private boolean principal;
}

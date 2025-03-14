package br.com.altf4.futstore.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Entity
@Table(name = "Produto")
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "codigo")
    private Long codigo;

    @NotBlank(message = "O nome do produto é obrigatório")
    @Column(name = "nome", length = 200, nullable = false)
    private String nome;

    @NotNull(message = "A avaliação do produto é obrigatória")
    @Column(name = "avaliacao", nullable = false)
    private Integer avaliacao;

    @NotBlank(message = "A descrição do produto é obrigatória")
    @Column(name = "descricao", columnDefinition = "TEXT", nullable = false)
    private String descricao;

    @NotNull(message = "O valor do produto é obrigatório")
    @Column(name = "valor", precision = 10, scale = 2, nullable = false)
    private BigDecimal valor;

    @NotNull(message = "A quantidade em estoque é obrigatória")
    @Column(name = "qtd_estoque", nullable = false)
    private Integer qtdEstoque;

    // Relacionamento com ProdutoImagem
    @OneToMany(mappedBy = "produto", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ProdutoImagem> imagens;

    @Column(name = "ativo", nullable = false)
    private boolean ativo = true; // Padrão: ativo ao cadastrar

}

package br.com.altf4.futstore.dto;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProdutoDTO {
    private String nome;
    private Integer avaliacao;
    private String descricao;
    private BigDecimal valor;
    private Integer qtdEstoque;
    private Integer imagemPrincipal; 
}

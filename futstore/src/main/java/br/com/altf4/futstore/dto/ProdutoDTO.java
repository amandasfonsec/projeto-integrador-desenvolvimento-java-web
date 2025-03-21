package br.com.altf4.futstore.dto;
import lombok.Data;

import java.math.BigDecimal;

import br.com.altf4.futstore.enums.Status;

@Data
public class ProdutoDTO {
    private String nome;
    private Integer avaliacao;
    private String descricao;
    private BigDecimal valor;
    private Integer qtdEstoque;
    private boolean ativo;
    private Integer imagemPrincipal; 
}

package br.com.altf4.futstore.model;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "ItemPedido")
public class ItemPedido {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idItemPedido")
    private Long idItemPedido;

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "fk_pedido_id", nullable = false)
    private Pedido pedido;

    @ManyToOne
    @JoinColumn(name = "fk_produto_id", nullable = false)
    private Produto produto;

    @Column(name = "qtd_produto")
    private Integer qtdProduto;

    @Column(name = "valor_unitario")
    private double valorUnitario;

    @Column(name = "sub_total")
    private double subTotal;
    
}

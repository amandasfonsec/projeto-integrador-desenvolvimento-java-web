package br.com.altf4.futstore.model;

import jakarta.persistence.*;
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
    @JoinColumn(name = "fk_pedido_id", nullable = false)
    private Pedido pedido;

    @ManyToOne
    @JoinColumn(name = "fk_produto_id", nullable = false)
    private Produto produto;

    @Column(name = "quantidade")
    private Integer quantidade;

    @Column(name = "valor_unitario")
    private double valorUnitario;

    @Column(name = "sub_total")
    private double subTotal;
}

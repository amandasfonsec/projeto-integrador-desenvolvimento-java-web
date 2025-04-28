package br.com.altf4.futstore.model;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "Pedido")
public class Pedido {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idPedido")
    private Long idPedido;

    @Column(name = "dtPedido")
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate dtPedido;

    @ManyToOne
    @JoinColumn(name = "fk_cliente_id", nullable = false)
    @JsonIgnore
    private Cliente cliente;

    @ManyToOne
    @JoinColumn(name = "fk_endereco_id", nullable = false)
    @JsonIgnore
    private Endereco endereco;

    @Column(name = "forma_pagamento")
    private String formaPagamento;

    @Column(name = "valor_frete")
    private Double valorFrete;

    @Column(name = "valor_total_pedido")
    private Double valorTotalPedido;

    @Column(name = "status_pedido")
    private String statusPedido;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<ItemPedido> itensPedido;
}

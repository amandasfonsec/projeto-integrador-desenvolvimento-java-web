package br.com.altf4.futstore.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.altf4.futstore.model.Pedido;

public interface IPedidoRespository extends JpaRepository<Pedido, Long>{

    List<Pedido> findByCliente_IdCliente(Long idCliente);
    Pedido findByIdPedido(Long idPedido);
    
}

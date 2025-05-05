package br.com.altf4.futstore.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import br.com.altf4.futstore.model.Pedido;

public interface IPedidoRepository extends JpaRepository<Pedido, Long> {

    Pedido findByIdPedido(Long idPedido);

    List<Pedido> findByCliente_IdCliente(Long idCliente);

    @Query("SELECT MAX(p.numeroPedido) FROM Pedido p")
    Long buscarUltimoNumeroPedido();
}

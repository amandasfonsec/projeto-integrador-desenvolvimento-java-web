package br.com.altf4.futstore.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.altf4.futstore.model.Pedido;
import br.com.altf4.futstore.repository.IClienteRepository;
import br.com.altf4.futstore.repository.IPedidoRespository;

@Service
public class PedidoService {
    private IPedidoRespository pedidoRepository;
    private IClienteRepository clienteRepository;

    @Autowired
    public PedidoService(IPedidoRespository pedidoRepository, IClienteRepository clienteRepository) {
        this.pedidoRepository = pedidoRepository;
        this.clienteRepository = clienteRepository;
    }

    public List<Pedido> listarPedidos() {
        return pedidoRepository.findAll();
    }

    public Pedido buscarPorId(Long idPedido) {
        return pedidoRepository.findByIdPedido(idPedido);
    }

    public List<Pedido> listarPedidosCliente(Long idCliente) {
        return pedidoRepository.findByCliente_IdCliente(idCliente);
    }
}

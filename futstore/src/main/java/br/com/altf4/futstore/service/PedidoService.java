package br.com.altf4.futstore.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.altf4.futstore.dto.ItemCarrinhoDTO;
import br.com.altf4.futstore.dto.PedidoDTO;
import br.com.altf4.futstore.model.Cliente;
import br.com.altf4.futstore.model.Endereco;
import br.com.altf4.futstore.model.ItemPedido;
import br.com.altf4.futstore.model.Pedido;
import br.com.altf4.futstore.model.Produto;
import br.com.altf4.futstore.repository.IClienteRepository;
import br.com.altf4.futstore.repository.IEnderecoRepository;
import br.com.altf4.futstore.repository.IPedidoRepository;
import br.com.altf4.futstore.repository.IProdutoRepository;

@Service
public class PedidoService {

    private final IPedidoRepository pedidoRepository;
    private final IClienteRepository clienteRepository;
    private final IEnderecoRepository enderecoRepository;
    private final IProdutoRepository produtoRepository; // <-- Adicionado

    @Autowired
    public PedidoService(
        IPedidoRepository pedidoRepository,
        IClienteRepository clienteRepository,
        IEnderecoRepository enderecoRepository,
        IProdutoRepository produtoRepository // <-- Adicionado
    ) {
        this.pedidoRepository = pedidoRepository;
        this.clienteRepository = clienteRepository;
        this.enderecoRepository = enderecoRepository;
        this.produtoRepository = produtoRepository; // <-- Adicionado
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

    public Pedido criarPedido(PedidoDTO dto) {
        Cliente cliente = clienteRepository.findById(dto.getIdCliente())
            .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado"));

        Endereco endereco = enderecoRepository.findById(dto.getIdEndereco())
            .orElseThrow(() -> new IllegalArgumentException("Endereço não encontrado"));

        Pedido pedido = new Pedido();
        pedido.setCliente(cliente);
        pedido.setEndereco(endereco);
        pedido.setDtPedido(LocalDate.now());
        pedido.setFormaPagamento(dto.getFormaPagamento());
        pedido.setStatus("AGUARDANDO PAGAMENTO");

        double total = 0.0;
        List<ItemPedido> itens = new ArrayList<>();

        for (ItemCarrinhoDTO itemDto : dto.getItens()) {
            Produto produto = produtoRepository.findById(itemDto.getIdProduto())
                .orElseThrow(() -> new IllegalArgumentException("Produto não encontrado"));

            ItemPedido item = new ItemPedido();
            item.setProduto(produto);
            item.setQuantidade(itemDto.getQuantidade());
            item.setValorUnitario(itemDto.getPrecoUnitario());
            item.setSubTotal(itemDto.getQuantidade() * itemDto.getPrecoUnitario());
            item.setPedido(pedido);

            total += item.getSubTotal();
            itens.add(item);
        }

        pedido.setItens(itens);
        pedido.setValorTotal(total);

        Long ultimoNumero = pedidoRepository.buscarUltimoNumeroPedido();
        pedido.setNumeroPedido(ultimoNumero != null ? ultimoNumero + 1 : 1L);

        return pedidoRepository.save(pedido);
    }
}

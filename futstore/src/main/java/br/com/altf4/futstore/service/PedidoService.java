package br.com.altf4.futstore.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.altf4.futstore.model.Cliente;
import br.com.altf4.futstore.model.Endereco;
import br.com.altf4.futstore.model.ItemPedido;
import br.com.altf4.futstore.model.Pedido;
import br.com.altf4.futstore.model.Produto;
import br.com.altf4.futstore.repository.IClienteEnderecoRepository;
import br.com.altf4.futstore.repository.IClienteRepository;
import br.com.altf4.futstore.repository.IPedidoRespository;
import br.com.altf4.futstore.repository.IProdutoRepository;

@Service
public class PedidoService {
    private IPedidoRespository pedidoRepository;
    private IClienteRepository clienteRepository;
    private IClienteEnderecoRepository enderecoRepository;
    private IProdutoRepository produtoRepository;

    @Autowired
    public PedidoService(IPedidoRespository pedidoRepository, IClienteRepository clienteRepository,
            IClienteEnderecoRepository enderecoRepository, IProdutoRepository produtoRepository) {
        this.pedidoRepository = pedidoRepository;
        this.clienteRepository = clienteRepository;
        this.enderecoRepository = enderecoRepository;
        this.produtoRepository = produtoRepository;
    }

    public List<Pedido> listarPedidos() {
        return pedidoRepository.findAll();
    }

    public Pedido buscarPorId(Long idPedido) {
        return pedidoRepository.findByIdPedido(idPedido);
    }

    public Pedido criarPedido(Pedido pedido) {
        if (pedido.getCliente() == null || pedido.getCliente().getIdCliente() == null) {
            throw new RuntimeException("ID do cliente não pode ser nulo");
        }

        if (pedido.getEndereco() == null) {
            throw new RuntimeException("Endereço não pode ser nulo");
        }

        if (pedidoRepository.existsByIdPedido(pedido.getIdPedido())) {
            throw new RuntimeException("Pedido já cadastrado!");
        }

        Cliente cliente = clienteRepository.findByIdCliente(pedido.getCliente().getIdCliente());
        if (cliente == null) {
            throw new RuntimeException("Cliente não encontrado");
        }

        Endereco endereco;
        if (pedido.getEndereco().getId_endereco() != null) {
            endereco = enderecoRepository.findById(pedido.getEndereco().getId_endereco())
                    .orElseThrow(() -> new RuntimeException("Endereço não encontrado"));
        } else {
            endereco = new Endereco();
            endereco.setCep(pedido.getEndereco().getCep());
            endereco.setLogradouro(pedido.getEndereco().getLogradouro());
            endereco.setNumero(pedido.getEndereco().getNumero());
            endereco.setComplemento(pedido.getEndereco().getComplemento());
            endereco.setBairro(pedido.getEndereco().getBairro());
            endereco.setCidade(pedido.getEndereco().getCidade());
            endereco.setUf(pedido.getEndereco().getUf());
            endereco.setTipo(pedido.getEndereco().getTipo());
            endereco.setEnderecoPadrao(pedido.getEndereco().isEnderecoPadrao());
            endereco.setCliente(cliente);
            enderecoRepository.save(endereco);
        }

        pedido.setCliente(cliente);
        pedido.setEndereco(endereco);

        if (pedido.getItensPedido() != null) {
            for (ItemPedido item : pedido.getItensPedido()) {
                if (item.getProduto() == null || item.getProduto().getCodigo() == null) {
                    throw new RuntimeException("Produto ou ID do produto não pode ser nulo");
                }

                Produto produto = produtoRepository.findById(item.getProduto().getCodigo())
                        .orElseThrow(() -> new RuntimeException(
                                "Produto com ID " + item.getProduto().getCodigo() + " não encontrado"));

                item.setProduto(produto);
                item.setPedido(pedido);
            }
        }

        return pedidoRepository.save(pedido);
    }

    // ✅ Alterado: agora retorna pedidos ordenados por data decrescente
    public List<Pedido> listarPedidosCliente(Long idCliente) {
        return pedidoRepository.findByCliente_IdClienteOrderByDtPedidoDesc(idCliente);
    }

    // ✅ Novo método para atualizar o status do pedido
    public Pedido atualizarStatusPedido(Long idPedido, String novoStatus) {
        Pedido pedido = pedidoRepository.findByIdPedido(idPedido);
        if (pedido == null) {
            throw new RuntimeException("Pedido não encontrado");
        }

        pedido.setStatusPedido(novoStatus);
        return pedidoRepository.save(pedido);
    }
}

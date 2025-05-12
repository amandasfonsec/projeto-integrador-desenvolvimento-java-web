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

    // Buscar cliente no banco
    Cliente cliente = clienteRepository.findByIdCliente(pedido.getCliente().getIdCliente());
    if (cliente == null) {
        throw new RuntimeException("Cliente não encontrado");
    }

    Endereco endereco;

    // Se o endereço já existir (tem ID), buscar no banco
    if (pedido.getEndereco().getId_endereco() != null) {
        endereco = enderecoRepository.findById(pedido.getEndereco().getId_endereco())
                .orElseThrow(() -> new RuntimeException("Endereço não encontrado"));
   } else {
    // Novo endereço – associar ao cliente
    endereco = new Endereco();
    endereco.setCep(pedido.getEndereco().getCep()); // Garantir que o CEP está definido
    endereco.setLogradouro(pedido.getEndereco().getLogradouro()); // Garantir que o Logradouro está definido
    endereco.setNumero(pedido.getEndereco().getNumero()); // Garantir que o Número está definido
    endereco.setComplemento(pedido.getEndereco().getComplemento()); // Garantir que o Complemento está definido
    endereco.setBairro(pedido.getEndereco().getBairro()); // Garantir que o Bairro está definido
    endereco.setCidade(pedido.getEndereco().getCidade()); // Garantir que a Cidade está definida
    endereco.setUf(pedido.getEndereco().getUf()); // Garantir que a UF está definida
    endereco.setTipo(pedido.getEndereco().getTipo()); // Garantir que o Tipo está definido
    endereco.setEnderecoPadrao(pedido.getEndereco().isEnderecoPadrao()); // Garantir que o Endereço Padrão está definido

    endereco.setCliente(cliente); // Associar o cliente ao endereço
    enderecoRepository.save(endereco); // Salvar o novo endereço
    
}
    

    // Associar cliente e endereço ao pedido
    pedido.setCliente(cliente);
    pedido.setEndereco(endereco);

    // Configurar itens do pedido
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


    public List<Pedido> listarPedidosCliente(Long idCliente) {
        return pedidoRepository.findByCliente_IdCliente(idCliente);
    }
}

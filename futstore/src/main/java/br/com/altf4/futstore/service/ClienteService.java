package br.com.altf4.futstore.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import br.com.altf4.futstore.dto.ClienteDTO;
import br.com.altf4.futstore.model.Cliente;
import br.com.altf4.futstore.model.Endereco;
import br.com.altf4.futstore.model.Produto;
import br.com.altf4.futstore.model.Usuario;
import br.com.altf4.futstore.repository.IClienteEnderecoRepository;
import br.com.altf4.futstore.repository.IClienteRepository;
import br.com.altf4.futstore.security.Token;
import br.com.altf4.futstore.security.TokenUtil;


@Service
public class ClienteService {
    private IClienteRepository clienteRepository;
    private IClienteEnderecoRepository clienteEnderecoRepository;
    private PasswordEncoder passwordEncoder;

    @Autowired
    public ClienteService(IClienteRepository repository, PasswordEncoder passwordEncoder, IClienteEnderecoRepository clienteEnderecoRepository) {
        this.clienteRepository = repository;
        this.passwordEncoder = passwordEncoder;
        this.clienteEnderecoRepository = clienteEnderecoRepository;
    }

    public List<Endereco> listarEnderecos(Long idCliente){
        Cliente cliente = buscarPorId(idCliente);
        if(cliente == null){
            throw new RuntimeException("Cliente não encontrado");
        }
        return clienteEnderecoRepository.findByCliente(cliente);
    }

    public List<Cliente> listarClientes() {
        return clienteRepository.findAll();
    }

    public Cliente buscarPorId(Long idCliente) {
        return clienteRepository.findByIdCliente(idCliente);
    }

    public Cliente editarCliente(Cliente cliente) {
        if (cliente == null || cliente.getIdCliente() == null) {
            throw new IllegalArgumentException("Cliente inválido");
        }
    
        // Se a senha ainda não estiver codificada (por exemplo, se ela foi alterada no Controller),
        // encode aqui:
        cliente.setSenha(passwordEncoder.encode(cliente.getSenha()));
    
        return clienteRepository.save(cliente);
    }
    


    public Cliente criarCliente(Cliente cliente) {

        if (clienteRepository.existsByEmail(cliente.getEmail())) {
            throw new RuntimeException("E-mail já cadastrado!");
        }
        if (clienteRepository.existsByCpf(cliente.getCpf())) {
            throw new RuntimeException("CPF já cadastrado!");
        }
        
        cliente.setSenha(passwordEncoder.encode(cliente.getSenha()));
        return clienteRepository.save(cliente);
    }

    public Map<String, Object> gerarTokenComDados(ClienteDTO clienteDTO) {
        Cliente cliente = clienteRepository.findByEmail(clienteDTO.getEmail());

        if (cliente == null || !passwordEncoder.matches(clienteDTO.getSenha(), cliente.getSenha())) {
            return null;
        }
        
        Token token = new Token(TokenUtil.createToken(cliente));

        Map<String, Object> resposta = new HashMap<>();
        resposta.put("id", cliente.getIdCliente());
        resposta.put("token", token.getToken());
        resposta.put("nome", cliente.getNome());

        return resposta;
    }


}

package br.com.altf4.futstore.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import br.com.altf4.futstore.dto.ClienteDTO;
import br.com.altf4.futstore.model.Cliente;
import br.com.altf4.futstore.model.Usuario;
import br.com.altf4.futstore.repository.IClienteRepository;
import br.com.altf4.futstore.security.Token;
import br.com.altf4.futstore.security.TokenUtil;


@Service
public class ClienteService {
    private IClienteRepository repository;
    private PasswordEncoder passwordEncoder;

    @Autowired
    public ClienteService(IClienteRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Cliente> listarClientes() {
        return repository.findAll();
    }

    public Cliente criarUsuario(Cliente cliente) {

        if (repository.existsByEmail(cliente.getEmail())) {
            throw new RuntimeException("E-mail já cadastrado!");
        }
        if (repository.existsByCpf(cliente.getCpf())) {
            throw new RuntimeException("CPF já cadastrado!");
        }
        
        cliente.setSenha(passwordEncoder.encode(cliente.getSenha()));
        return repository.save(cliente);
    }

    public Map<String, Object> gerarTokenComDados(ClienteDTO clienteDTO) {
        Cliente cliente = repository.findByEmail(clienteDTO.getEmail());

        if (cliente == null || !passwordEncoder.matches(clienteDTO.getSenha(), cliente.getSenha())) {
            return null;
        }
        
        Token token = new Token(TokenUtil.createToken(cliente));

        Map<String, Object> resposta = new HashMap<>();
        resposta.put("id", cliente.getId_cliente());
        resposta.put("token", token.getToken());
        resposta.put("nome", cliente.getNome());

        return resposta;
    }


}

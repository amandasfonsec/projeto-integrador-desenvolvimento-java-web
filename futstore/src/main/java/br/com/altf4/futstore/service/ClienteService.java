package br.com.altf4.futstore.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import br.com.altf4.futstore.model.Cliente;
import br.com.altf4.futstore.repository.IClienteRepository;


@Service
public class ClienteService {
    private IClienteRepository repository;
    private PasswordEncoder passwordEncoder;

    @Autowired
    public ClienteService(IClienteRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    public Cliente criarUsuario(Cliente cliente) {
        cliente.setSenha(passwordEncoder.encode(cliente.getSenha()));
        return repository.save(cliente);
    }


}

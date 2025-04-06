package br.com.altf4.futstore.controller;

import br.com.altf4.futstore.dto.ClienteDTO;
import br.com.altf4.futstore.model.Cliente;
import br.com.altf4.futstore.service.ClienteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/clientes")
public class ClienteController {

    private ClienteService clienteService;

    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @PostMapping
    public ResponseEntity<?> criarCliente(@Valid @RequestBody Cliente cliente) {
        try {
            cliente.getEnderecos().forEach(endereco -> endereco.setCliente(cliente));

            Cliente clienteSalvo = clienteService.criarUsuario(cliente);
            return ResponseEntity.status(HttpStatus.CREATED).body(clienteSalvo);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erro ao cadastrar cliente: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> logar(@Valid @RequestBody ClienteDTO cliente) {
        Map<String, Object> resposta = clienteService.gerarTokenComDados(cliente);

        if (resposta == null || resposta.containsKey("erro")) {
            return ResponseEntity.status(403).body("Erro: Email ou senha inválidos.");
        }

        return ResponseEntity.ok(resposta);
    }

    
    @GetMapping
    public List<Cliente> listarClientes() {
        return clienteService.listarClientes();
    }

      
}

package br.com.altf4.futstore.controller;

import br.com.altf4.futstore.model.Cliente;
import br.com.altf4.futstore.service.ClienteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    /* 
    @GetMapping
    public List<Cliente> listarClientes() {
        return clienteService.findAll();
    }

    @GetMapping("/{id}")
    public Cliente buscarClientePorId(@PathVariable Long id) {
        return clienteRepository.findById(id).orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
    }
        */
}

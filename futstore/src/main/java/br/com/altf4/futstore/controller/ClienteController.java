package br.com.altf4.futstore.controller;

import br.com.altf4.futstore.dto.ClienteDTO;
import br.com.altf4.futstore.model.Cliente;
import br.com.altf4.futstore.model.Endereco;
import br.com.altf4.futstore.service.ClienteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
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

            Cliente clienteSalvo = clienteService.criarCliente(cliente);
            return ResponseEntity.status(HttpStatus.CREATED).body(clienteSalvo);
        } catch (Exception e) {
            if (e.getMessage().contains("E-mail já cadastrado")) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
            }
            if (e.getMessage().contains("CPF já cadastrado")) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
            }
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

    @PutMapping("/{idCliente}")
    public ResponseEntity<Cliente> editarCliente(@PathVariable Long idCliente, @RequestBody Cliente cliente) {
        Cliente clienteExistente = clienteService.buscarPorId(idCliente);
        
        if (clienteExistente == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    
        // Atualiza os campos permitidos
        clienteExistente.setNome(cliente.getNome());
        clienteExistente.setDataNascimento(cliente.getDataNascimento());
        clienteExistente.setGenero(cliente.getGenero());
    
        // Atualiza a senha, se fornecida
        
            clienteExistente.setSenha(cliente.getSenha());
        
    
        // Mapeia os endereços existentes usando um HashMap (sem stream)
        Map<Long, Endereco> enderecosExistentesMap = new HashMap<>();
        List<Endereco> enderecosExistentes = clienteExistente.getEnderecos();
        if (enderecosExistentes != null) {
            for (Endereco endereco : enderecosExistentes) {
                if (endereco.getId_endereco() != null) {
                    enderecosExistentesMap.put(endereco.getId_endereco(), endereco);
                }
            }
        }
    
        // Limpa a lista existente, preservando a referência (evita erro do Hibernate)
        enderecosExistentes.clear();
    
        if (cliente.getEnderecos() != null) {
            for (Endereco endereco : cliente.getEnderecos()) {
                if (endereco.getId_endereco() != null && enderecosExistentesMap.containsKey(endereco.getId_endereco())) {
                    // Atualiza apenas o campo 'padrao'
                    Endereco existente = enderecosExistentesMap.get(endereco.getId_endereco());
                    existente.setEnderecoPadrao(endereco.isEnderecoPadrao());
                    enderecosExistentes.add(existente);
                } else {
                    // Novo endereço
                    endereco.setCliente(clienteExistente);
                    enderecosExistentes.add(endereco);
                }
            }
        }
    
        // Não precisa setar a lista novamente, pois foi atualizada por referência
    
        Cliente clienteAtualizado = clienteService.editarCliente(clienteExistente);
        return ResponseEntity.ok(clienteAtualizado);
    }
    


    
    @GetMapping
    public List<Cliente> listarClientes() {
        return clienteService.listarClientes();
    }

    @GetMapping("/{idCliente}")
    public ResponseEntity<Cliente> buscarClientePorId(@PathVariable Long idCliente) {
        Cliente cliente = clienteService.buscarPorId(idCliente);
        return cliente != null ? ResponseEntity.ok(cliente) : ResponseEntity.notFound().build();
    }

    //Listar os enderecos do usuario, usado para editar perfil
    @GetMapping("/{idCliente}/enderecos")
    public ResponseEntity<List<Map<String,String>>> listarEnderecosCliente(@PathVariable Long idCliente){
        try {
            List<Endereco> enderecos = clienteService.listarEnderecos(idCliente);

            List<Map<String, String>> listaMappingEnderecos = new ArrayList<>(); 
            for(Endereco endereco : enderecos){
                Map<String, String> enderecoInfo = new HashMap<>();
                enderecoInfo.put("id_Endereco", (endereco.getId_endereco().toString()));
                enderecoInfo.put("bairro",endereco.getBairro());
                enderecoInfo.put("cidade",endereco.getCidade());
                enderecoInfo.put("complemento",endereco.getComplemento());
                enderecoInfo.put("padrao",endereco.isEnderecoPadrao()? "true" : "false");
                enderecoInfo.put("logradouro",endereco.getLogradouro());
                enderecoInfo.put("numero",endereco.getNumero());
                enderecoInfo.put("tipo",endereco.getTipo());
                enderecoInfo.put("uf",endereco.getUf());
                enderecoInfo.put("cep",endereco.getCep());

                listaMappingEnderecos.add(enderecoInfo);
            }
            return ResponseEntity.ok(listaMappingEnderecos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(List.of(Map.of("erro","Erro ao listar Imagens do produto:" +e.getMessage())));
        }
        
    }



      
}

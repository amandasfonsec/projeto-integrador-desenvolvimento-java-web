package br.com.altf4.futstore.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.com.altf4.futstore.model.Pedido;
import br.com.altf4.futstore.service.PedidoService;
import jakarta.validation.Valid;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/pedidos")
public class PedidoController {

    private PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @PostMapping
    public ResponseEntity<?> criarPedido(@Valid @RequestBody Pedido pedido) {
        try {
            if (pedido.getItensPedido() != null) {
                pedido.getItensPedido().forEach(itensPedido -> itensPedido.setPedido(pedido));
            }

            Pedido pedidoSalvo = pedidoService.criarPedido(pedido);
            return ResponseEntity.status(HttpStatus.CREATED).body(pedidoSalvo);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erro ao cadastrar Pedido: " + e.getMessage());
        }
    }

    @GetMapping
    public List<Pedido> listarPedidos() {
        return pedidoService.listarPedidos();
    }

    @GetMapping("/{idPedido}")
    public ResponseEntity<Pedido> buscarPedidoPorId(@PathVariable Long idPedido) {
        Pedido pedido = pedidoService.buscarPorId(idPedido);
        return pedido != null ? ResponseEntity.ok(pedido) : ResponseEntity.notFound().build();
    }

    @GetMapping("/cliente/{idCliente}")
    public ResponseEntity<List<Pedido>> listarPedidosPorCliente(@PathVariable Long idCliente) {
        List<Pedido> pedidos = pedidoService.listarPedidosCliente(idCliente);
        if (pedidos.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(pedidos);
    }

    // ✅ NOVO ENDPOINT PARA ALTERAR STATUS
    @PutMapping("/{idPedido}/status")
    public ResponseEntity<?> atualizarStatusPedido(@PathVariable Long idPedido, @RequestParam String status) {
        try {
            Pedido atualizado = pedidoService.atualizarStatusPedido(idPedido, status);
            return ResponseEntity.ok(atualizado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erro ao atualizar status: " + e.getMessage());
        }
    }
}

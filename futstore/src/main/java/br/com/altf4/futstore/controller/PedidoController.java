package br.com.altf4.futstore.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.com.altf4.futstore.dto.PedidoDTO;
import br.com.altf4.futstore.model.Pedido;
import br.com.altf4.futstore.service.PedidoService;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/pedidos")
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
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
        return pedidos.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(pedidos);
    }

    @PostMapping
    public ResponseEntity<?> criarPedido(@RequestBody PedidoDTO dto) {
        try {
            Pedido pedido = pedidoService.criarPedido(dto);
            return ResponseEntity.ok(pedido);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao registrar pedido: " + e.getMessage());
        }
    }
}
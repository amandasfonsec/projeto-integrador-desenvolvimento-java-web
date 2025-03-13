
package br.com.altf4.futstore.controller;

import java.io.IOException;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import br.com.altf4.futstore.model.Produto;
import br.com.altf4.futstore.service.ProdutoService;

@RestController
@CrossOrigin("*")
@RequestMapping("/produtos")
public class ProdutoController {

    @Autowired
    private ProdutoService produtoService;

    @PostMapping
    public ResponseEntity<Produto> criarProduto(
        @ModelAttribute Produto produto,
        @RequestParam("imagensProduto") List<MultipartFile> imagens,
        @RequestParam("indicePrincipal") int indicePrincipal) {

        try {
            if (produto.getAvaliacao() < 1.0 || produto.getAvaliacao() > 5.0) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
            }

            Produto novo = produtoService.salvarProduto(produto, imagens, indicePrincipal);
            return ResponseEntity.status(HttpStatus.CREATED).body(novo);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping
    public ResponseEntity<List<Produto>> listarProdutos() {
        return ResponseEntity.ok(produtoService.listarProdutos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Produto> buscarPorId(@PathVariable Long id) {
        Produto p = produtoService.buscarPorId(id);
        return p != null ? ResponseEntity.ok(p) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluirProduto(@PathVariable Long id) {
        produtoService.excluirProduto(id);
        return ResponseEntity.noContent().build();
    }
}

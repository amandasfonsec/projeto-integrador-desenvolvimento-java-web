package br.com.altf4.futstore.controller;

import br.com.altf4.futstore.dto.ProdutoDTO;
import br.com.altf4.futstore.model.Produto;
import br.com.altf4.futstore.model.ProdutoImagem;
import br.com.altf4.futstore.repository.IProdutoImagemRepository;
import br.com.altf4.futstore.repository.IProdutoRepository;
import br.com.altf4.futstore.service.ProdutoService;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin("*")
@RequestMapping("/produtos")
public class ProdutoController {

    private final ProdutoService produtoService;

    @Autowired
    private IProdutoImagemRepository produtoImagemRepository;

    @Autowired
    private IProdutoRepository produtoRepository;

    public ProdutoController(ProdutoService produtoService) {
        this.produtoService = produtoService;
    }

    @GetMapping
    public ResponseEntity<List<Produto>> listarProdutos() {
        return ResponseEntity.ok(produtoService.listarProdutos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Produto> buscarProdutoPorId(@PathVariable Long id) {
        Produto produto = produtoService.buscarPorId(id);
        return produto != null ? ResponseEntity.ok(produto) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Produto> criarProduto(@Valid @RequestBody Produto produto) {
        return ResponseEntity.status(201).body(produtoService.criarProduto(produto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Produto> editarProduto(@PathVariable Long id, @Valid @RequestBody Produto produto) {
        return ResponseEntity.ok(produtoService.editarProduto(id, produto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluirProduto(@PathVariable Long id) {
        produtoService.excluirProduto(id);
        return ResponseEntity.noContent().build();
    }

    // Upload de imagens para um produto
    @PostMapping("/{id}/imagens")
    public ResponseEntity<?> adicionarImagensAoProduto(
            @PathVariable Long id,
            @RequestParam("imagens") List<MultipartFile> imagens) {

        produtoService.adicionarImagensAoProduto(id, imagens);
        return ResponseEntity.ok().build();
    }

    // Listar imagens do produto
    @GetMapping("/{id}/imagens")
    public ResponseEntity<List<ProdutoImagem>> listarImagensDoProduto(@PathVariable Long id) {
        return ResponseEntity.ok(produtoService.listarImagensDoProduto(id));
    }

    @PostMapping(consumes = { "multipart/form-data" })
    public ResponseEntity<?> cadastrarProduto(
            @RequestPart("produto") ProdutoDTO produtoDTO,
            @RequestPart("imagensProduto") List<MultipartFile> imagens) {
        try {
            Produto produto = new Produto();
            produto.setNome(produtoDTO.getNome());
            produto.setAvaliacao(produtoDTO.getAvaliacao());
            produto.setDescricao(produtoDTO.getDescricao());
            produto.setValor(produtoDTO.getValor());
            produto.setQtdEstoque(produtoDTO.getQtdEstoque());

            produto = produtoRepository.save(produto);

            for (int i = 0; i < imagens.size(); i++) {
                MultipartFile arquivo = imagens.get(i);
                ProdutoImagem imagem = new ProdutoImagem();
                imagem.setProduto(produto);
                imagem.setTipoArquivo(arquivo.getContentType());
                imagem.setDados(arquivo.getBytes());

                if (produtoDTO.getImagemPrincipal() != null && produtoDTO.getImagemPrincipal() == i) {
                    imagem.setPrincipal(true);
                }

                produtoImagemRepository.save(imagem);
            }

            return ResponseEntity.ok(Map.of("mensagem", "Produto cadastrado com sucesso!"));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("erro", "Erro ao cadastrar produto: " + e.getMessage()));
        }
    }

}

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

import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
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

    @PutMapping(value = "/{id}", consumes = { "multipart/form-data" })
    public ResponseEntity<?> editarProduto(
        @PathVariable Long id,
        @RequestPart("produto") ProdutoDTO produtoDTO,
        @RequestPart(value = "imagensProduto", required = false) MultipartFile imagem) {

    try {
        Produto produto = produtoService.buscarPorId(id);
        if (produto == null) {
            return ResponseEntity.notFound().build();
        }

        produto.setNome(produtoDTO.getNome());
        produto.setDescricao(produtoDTO.getDescricao());
        produto.setValor(produtoDTO.getValor());
        produto.setQtdEstoque(produtoDTO.getQtdEstoque());

        produtoRepository.save(produto);

        // Se houver uma nova imagem, substituí-la
        if (imagem != null && !imagem.isEmpty()) {
            produtoImagemRepository.deleteByProduto(produto);
            
            ProdutoImagem novaImagem = new ProdutoImagem();
            novaImagem.setProduto(produto);
            novaImagem.setTipoArquivo(imagem.getContentType());
            novaImagem.setDados(imagem.getBytes());
            novaImagem.setPrincipal(true);
            produtoImagemRepository.save(novaImagem);
        }

        return ResponseEntity.ok(Map.of("mensagem", "Produto atualizado com sucesso!"));

    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("erro", "Erro ao editar produto: " + e.getMessage()));
    }
}

@PatchMapping("/{id}/status")
    public ResponseEntity<?> alterarStatusProduto(
            @PathVariable Long id, 
            @RequestParam boolean status) {  // Recebe o status como um valor booleano
        try {
            Produto produtoAtualizado = produtoService.alterarStatusProduto(id, status);
            return ResponseEntity.ok(produtoAtualizado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("erro", "Erro ao alterar status do produto: " + e.getMessage()));
        }
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
public ResponseEntity<List<Map<String, String>>> listarImagensDoProduto(@PathVariable Long id) {
    try {
        List<ProdutoImagem> imagens = produtoService.listarImagensDoProduto(id);

        List<Map<String, String>> imagensBase64 = new ArrayList<>();
        for (ProdutoImagem imagem : imagens) {
            Map<String, String> imagemInfo = new HashMap<>();
            imagemInfo.put("tipo", imagem.getTipoArquivo());
            imagemInfo.put("imagem", "data:" + imagem.getTipoArquivo() + ";base64," + Base64.getEncoder().encodeToString(imagem.getDados()));
            if(imagem.isPrincipal()){
                imagemInfo.put("principal", "true" );
            }else{
                imagemInfo.put("principal","false");
            }
            
            imagensBase64.add(imagemInfo);
        }

        return ResponseEntity.ok(imagensBase64);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(List.of(Map.of("erro", "Erro ao listar imagens do produto: " + e.getMessage())));
    }
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

    @GetMapping("/buscar")
    public ResponseEntity<List<Produto>> buscarProdutos(@RequestParam String nome) {
        List<Produto> produtos = produtoService.buscarPorNome(nome);
        return ResponseEntity.ok(produtos);
    }

}

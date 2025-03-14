package br.com.altf4.futstore.service;

import br.com.altf4.futstore.model.Produto;
import br.com.altf4.futstore.model.ProdutoImagem;
import br.com.altf4.futstore.repository.IProdutoImagemRepository;
import br.com.altf4.futstore.repository.IProdutoRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.transaction.Transactional;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class ProdutoService {

    private final IProdutoRepository produtoRepository;
    private final IProdutoImagemRepository imagemRepository;

    public ProdutoService(IProdutoRepository produtoRepository, IProdutoImagemRepository imagemRepository) {
        this.produtoRepository = produtoRepository;
        this.imagemRepository = imagemRepository;
    }

    public List<Produto> listarProdutos() {
        return produtoRepository.findAll();
    }

    public Produto buscarPorId(Long id) {
        return produtoRepository.findById(id).orElse(null);
    }

    public Produto criarProduto(Produto produto) {
        return produtoRepository.save(produto);
    }

    public Produto editarProduto(Long id, Produto produtoAtualizado) {
        Produto produtoExistente = buscarPorId(id);

        if (produtoExistente == null) return null;

        produtoExistente.setNome(produtoAtualizado.getNome());
        produtoExistente.setAvaliacao(produtoAtualizado.getAvaliacao());
        produtoExistente.setDescricao(produtoAtualizado.getDescricao());
        produtoExistente.setValor(produtoAtualizado.getValor());
        produtoExistente.setQtdEstoque(produtoAtualizado.getQtdEstoque());

        return produtoRepository.save(produtoExistente);
    }

    public void excluirProduto(Long id) {
        produtoRepository.deleteById(id);
    }

    @Transactional
    public void adicionarImagensAoProduto(Long produtoId, List<MultipartFile> arquivos) {
        Produto produto = buscarPorId(produtoId);
        if (produto == null) {
            throw new RuntimeException("Produto não encontrado");
        }

        List<ProdutoImagem> imagens = new ArrayList<>();

        for (MultipartFile arquivo : arquivos) {
            try {
                ProdutoImagem imagem = new ProdutoImagem();
                imagem.setProduto(produto);
                imagem.setTipoArquivo(arquivo.getContentType());
                imagem.setDados(arquivo.getBytes());
                imagens.add(imagem);
            } catch (IOException e) {
                throw new RuntimeException("Erro ao processar o arquivo " + arquivo.getOriginalFilename(), e);
            }
        }

        imagemRepository.saveAll(imagens);
    }

    public List<ProdutoImagem> listarImagensDoProduto(Long produtoId) {
        Produto produto = buscarPorId(produtoId);
        if (produto == null) {
            throw new RuntimeException("Produto não encontrado");
        }

        return imagemRepository.findByProduto(produto);
    }
}
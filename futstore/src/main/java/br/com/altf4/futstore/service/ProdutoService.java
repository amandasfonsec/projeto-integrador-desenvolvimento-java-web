
package br.com.altf4.futstore.service;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import br.com.altf4.futstore.model.Produto;
import br.com.altf4.futstore.model.ProdutoImagem;
import br.com.altf4.futstore.repository.ProdutoImagemRepository;
import br.com.altf4.futstore.repository.ProdutoRepository;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private ProdutoImagemRepository produtoImagemRepository;

    private final String uploadDir = "uploads/";

    public Produto salvarProduto(Produto produto, List<MultipartFile> arquivos, int indicePrincipal) throws IOException {
        File dir = new File(uploadDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        List<ProdutoImagem> listaImagens = new ArrayList<>();
        for (int i = 0; i < arquivos.size(); i++) {
            MultipartFile arquivo = arquivos.get(i);
            if (arquivo.isEmpty()) {
                continue;
            }

            String nomeOriginal = arquivo.getOriginalFilename();
            String extensao = nomeOriginal != null && nomeOriginal.contains(".") ? 
                              nomeOriginal.substring(nomeOriginal.lastIndexOf(".")) : "";

            String novoNome = UUID.randomUUID().toString() + extensao;
            String caminhoCompleto = uploadDir + novoNome;
            File destino = new File(caminhoCompleto);
            arquivo.transferTo(destino);

            ProdutoImagem produtoImagem = new ProdutoImagem();
            produtoImagem.setCaminho(caminhoCompleto);
            produtoImagem.setPrincipal(i == indicePrincipal);
            produtoImagem.setProduto(produto);

            listaImagens.add(produtoImagem);
        }

        produto.setImagens(listaImagens);
        return produtoRepository.save(produto);
    }

    public List<Produto> listarProdutos() {
        return produtoRepository.buscarTodosProdutos();
    }

    public Produto buscarPorId(Long id) {
        return produtoRepository.findById(id).orElse(null);
    }

    public void excluirProduto(Long id) {
        produtoRepository.deleteById(id);
    }
}

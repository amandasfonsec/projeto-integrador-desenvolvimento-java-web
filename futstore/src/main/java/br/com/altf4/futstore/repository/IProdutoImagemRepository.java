package br.com.altf4.futstore.repository;

import br.com.altf4.futstore.model.Produto;
import br.com.altf4.futstore.model.ProdutoImagem;
import jakarta.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IProdutoImagemRepository extends JpaRepository<ProdutoImagem, Long> {
    List<ProdutoImagem> findByProduto(Produto produto);
    @Transactional
    void deleteByProduto(Produto produto);

}
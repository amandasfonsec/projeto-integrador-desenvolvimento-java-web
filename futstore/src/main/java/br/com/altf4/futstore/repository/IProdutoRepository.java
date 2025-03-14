package br.com.altf4.futstore.repository;

import br.com.altf4.futstore.model.Produto;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface IProdutoRepository extends JpaRepository<Produto, Long> {
    List<Produto> findByNomeContainingIgnoreCase(String nome);
}

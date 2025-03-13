package br.com.altf4.futstore.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import br.com.altf4.futstore.model.ProdutoImagem;

public interface ProdutoImagemRepository extends JpaRepository<ProdutoImagem, Long> {
    // Métodos customizados, se necessário
}

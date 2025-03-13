
package br.com.altf4.futstore.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import br.com.altf4.futstore.model.Produto;
import java.util.List;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    
    @Query("SELECT DISTINCT p FROM Produto p LEFT JOIN FETCH p.imagens")
    List<Produto> buscarTodosProdutos();
}

package br.com.altf4.futstore.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.altf4.futstore.model.Endereco;

@Repository
public interface IEnderecoRepository extends JpaRepository<Endereco, Long> {
    // Métodos customizados (se precisar) vão aqui
}

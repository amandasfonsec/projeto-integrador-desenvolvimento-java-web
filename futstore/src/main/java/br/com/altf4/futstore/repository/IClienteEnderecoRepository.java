package br.com.altf4.futstore.repository;
import br.com.altf4.futstore.model.Cliente;
import br.com.altf4.futstore.model.Endereco;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IClienteEnderecoRepository extends JpaRepository<Endereco, Long>{
    List<Endereco> findByCliente(Cliente cliente);

    
}

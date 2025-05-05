package br.com.altf4.futstore.repository;

import br.com.altf4.futstore.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IClienteRepository extends JpaRepository<Cliente, Long> {
    Cliente findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByCpf(String cpf);
    Cliente findByIdCliente(Long idCliente);
}

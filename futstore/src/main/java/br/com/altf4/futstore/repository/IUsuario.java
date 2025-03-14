package br.com.altf4.futstore.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.altf4.futstore.model.Usuario;

public interface IUsuario extends JpaRepository<Usuario, Integer> {

    public Usuario findByEmail(String email);
    List<Usuario> findByNomeContainingIgnoreCase(String nome);
    boolean existsByEmail(String email);
    boolean existsByCpf(String cpf);
}

package br.com.altf4.futstore.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.altf4.futstore.model.Usuario;

public interface IUsuario extends JpaRepository<Usuario, Integer> {

    public Usuario findByEmail(String email);

}

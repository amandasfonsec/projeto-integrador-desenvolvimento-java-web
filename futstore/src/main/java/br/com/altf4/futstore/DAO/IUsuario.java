package br.com.altf4.futstore.DAO;

import org.springframework.data.repository.CrudRepository;

import br.com.altf4.futstore.model.Usuario;

public interface IUsuario extends CrudRepository<Usuario, Integer> {

}

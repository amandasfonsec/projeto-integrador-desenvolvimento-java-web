package br.com.altf4.futstore.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import br.com.altf4.futstore.dto.UsuarioDTO;
import br.com.altf4.futstore.model.Usuario;
import br.com.altf4.futstore.repository.IUsuario;
import br.com.altf4.futstore.security.Token;
import br.com.altf4.futstore.security.TokenUtil;

@Service
public class UsuarioService {
    private IUsuario repository;
    private PasswordEncoder passwordEncoder;

    @Autowired
    public UsuarioService(IUsuario repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Usuario> listarUsuario() {
        return repository.findAll();
    }

    public Usuario criarUsuario(Usuario usuario) {
        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        return repository.save(usuario);
    }

    public Usuario editarUsuario(Usuario usuario) {
        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        return repository.save(usuario);
    }

    public boolean excluirUsuario(Integer id) {
        repository.deleteById(id);
        return true;
    }

    public Token gerarToken(UsuarioDTO usuarioDTO) {
        Usuario user = repository.findByNomeOrEmail(usuarioDTO.getNome(), usuarioDTO.getEmail());

        if (user == null || !passwordEncoder.matches(usuarioDTO.getSenha(), user.getSenha())) {
            return null; 
        }

        return new Token(TokenUtil.createToken(user));
    }
}

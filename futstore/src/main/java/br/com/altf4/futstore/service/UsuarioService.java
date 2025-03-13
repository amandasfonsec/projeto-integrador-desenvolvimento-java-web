package br.com.altf4.futstore.service;

<<<<<<< HEAD
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
        Usuario user = repository.findByEmail(usuarioDTO.getEmail());

        if (user == null || !passwordEncoder.matches(usuarioDTO.getSenha(), user.getSenha())) {
            return null; 
        }

        return new Token(TokenUtil.createToken(user));
=======
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import br.com.altf4.futstore.DAO.IUsuario;
import br.com.altf4.futstore.model.Usuario;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private IUsuario usuarioRepository;

    // Listar todos os usuários
    public List<Usuario> listarUsuarios() {
        return (List<Usuario>) usuarioRepository.findAll();
    }

    // Buscar usuário por ID
    public Optional<Usuario> buscarPorId(Integer id) {
        return usuarioRepository.findById(id);
    }

    // Criar ou atualizar usuário
    public Usuario criarOuAtualizarUsuario(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    // Excluir usuário por ID
    public void excluirUsuario(Integer id) {
        usuarioRepository.deleteById(id);
>>>>>>> 1181a1e (sprint2-telaseconexaomysql)
    }
}

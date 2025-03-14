package br.com.altf4.futstore.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import br.com.altf4.futstore.dto.UsuarioDTO;
import br.com.altf4.futstore.enums.Status;
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

    public Map<String, Object> gerarTokenComDados(UsuarioDTO usuarioDTO) {
        Usuario user = repository.findByEmail(usuarioDTO.getEmail());

        if (user == null || !passwordEncoder.matches(usuarioDTO.getSenha(), user.getSenha())) {
            return null;
        }

        if (user.getStatus() == Status.INATIVO) {
            Map<String, Object> erro = new HashMap<>();
            erro.put("erro", "Usuário inativo. Contate o administrador.");
            return erro;
        }
        
        Token token = new Token(TokenUtil.createToken(user));

        Map<String, Object> resposta = new HashMap<>();
        resposta.put("id", user.getId());
        resposta.put("token", token.getToken());
        resposta.put("grupo", user.getGrupo());
        resposta.put("nome", user.getNome());

        return resposta;
    }

    public List<Usuario> buscarPorNome(String nome) {
        return repository.findByNomeContainingIgnoreCase(nome);
    }

    public Usuario alterarStatus(Integer id) {
        Usuario usuario = repository.findById(id).orElse(null);
    
        if (usuario != null) {
            // Alternar entre 'ATIVO' e 'INATIVO' com o enum
            if (Status.ATIVO.equals(usuario.getStatus())) {
                usuario.setStatus(Status.INATIVO); // Definindo o status como INATIVO
            } else {
                usuario.setStatus(Status.ATIVO); // Definindo o status como ATIVO
            }
            repository.save(usuario);  // Salva a alteração no banco de dados
        }
    
        return usuario;
    }

    public Map<String, Boolean> verificarUsuario(String email, String cpf) {
        boolean emailExistente = repository.existsByEmail(email);
        boolean cpfExistente = repository.existsByCpf(cpf);

        Map<String, Boolean> resposta = new HashMap<>();
        resposta.put("emailExistente", emailExistente);
        resposta.put("cpfExistente", cpfExistente);

        return resposta;
    }
    

}

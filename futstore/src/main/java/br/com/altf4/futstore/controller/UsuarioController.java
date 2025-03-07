package br.com.altf4.futstore.controller;

import java.util.List;
//import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.altf4.futstore.model.Usuario;
import br.com.altf4.futstore.service.UsuarioService;


@RestController
@CrossOrigin("*")
@RequestMapping("/usuarios")
public class UsuarioController{

    private UsuarioService usuarioService; 

    public UsuarioController(UsuarioService usuarioService){
        this.usuarioService = usuarioService;
    }

    @GetMapping
	public ResponseEntity<List<Usuario>> listaUsuarios(){
       return ResponseEntity.status(200).body(usuarioService.listarUsuario());
    }

    @PostMapping
    public ResponseEntity<Usuario> criarUsuario(@RequestBody Usuario usuario){
        return ResponseEntity.status(201).body(usuarioService.criarUsuario(usuario));
    }

    @PutMapping
    public ResponseEntity<Usuario> editarUsuario(@RequestBody Usuario usuario){
        return ResponseEntity.status(200).body(usuarioService.editarUsuario(usuario));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluirUsuario(@PathVariable Integer id){
        usuarioService.excluirUsuario(id);
        return ResponseEntity.status(204).build();
    }

    @PostMapping("/login")
    public ResponseEntity<Usuario> validarSenha(@RequestBody Usuario usuario){
        boolean senhaValida = usuarioService.validarSenha(usuario);
        if(!senhaValida){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.status(200).build();
    }
}
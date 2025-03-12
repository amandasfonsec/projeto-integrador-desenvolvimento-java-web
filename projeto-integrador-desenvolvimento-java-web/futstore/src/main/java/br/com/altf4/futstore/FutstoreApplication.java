package br.com.altf4.futstore;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

//(exclude =  {SecurityAutoConfiguration.class})
@SpringBootApplication 
public class FutstoreApplication {

	public static void main(String[] args) {
		BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String senhaCriptografada = encoder.encode("123456"); // Altere para a senha desejada
        System.out.println("Senha criptografada: " + senhaCriptografada);
		SpringApplication.run(FutstoreApplication.class, args);
	}

}

package br.com.altf4.futstore;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

//(exclude =  {SecurityAutoConfiguration.class})
@SpringBootApplication 
public class FutstoreApplication {
<<<<<<< HEAD

	public static void main(String[] args) {
		BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String senhaCriptografada = encoder.encode("123"); // Altere para a senha desejada
        System.out.println("Senha criptografada: " + senhaCriptografada);
		SpringApplication.run(FutstoreApplication.class, args);
	}

=======
    public static void main(String[] args) {
        SpringApplication.run(FutstoreApplication.class, args);
    }
>>>>>>> 1181a1e (sprint2-telaseconexaomysql)
}

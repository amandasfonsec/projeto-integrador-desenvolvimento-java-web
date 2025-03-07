package br.com.altf4.futstore;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication (exclude =  {SecurityAutoConfiguration.class})
public class FutstoreApplication {

	public static void main(String[] args) {
		SpringApplication.run(FutstoreApplication.class, args);
	}

}

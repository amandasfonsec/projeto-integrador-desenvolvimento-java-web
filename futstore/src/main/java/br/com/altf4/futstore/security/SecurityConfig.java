package br.com.altf4.futstore.security;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/usuarios/login").permitAll()
                .requestMatchers("/produtos/**").permitAll()
                .requestMatchers("/usuarios/**").permitAll()
                .requestMatchers("/clientes/**").permitAll()
                .requestMatchers("/pedidos/**").permitAll()
                .anyRequest().authenticated() 
            )
            .cors(cors -> cors.configurationSource(request -> {
                var corsConfig = new org.springframework.web.cors.CorsConfiguration();
                corsConfig.setAllowedOrigins(List.of("http://127.0.0.1:5500", "http://localhost:5500")); 
                corsConfig.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")); 
                corsConfig.setAllowedHeaders(List.of("*"));
                corsConfig.setAllowCredentials(true); 
                return corsConfig;
            }))
            
            .addFilterBefore(new SecurityFilter(), UsernamePasswordAuthenticationFilter.class); 

        return http.build();
    }
}

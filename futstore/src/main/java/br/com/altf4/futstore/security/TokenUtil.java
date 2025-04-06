package br.com.altf4.futstore.security;

import java.security.Key;
import java.util.Collections;
import java.util.Date;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import br.com.altf4.futstore.model.Cliente;
import br.com.altf4.futstore.model.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;

public class TokenUtil {
    private static final String HEADER = "Authorization";
    private static final String PREFIX = "Bearer ";
    private static final long EXPIRATION = 12 * 60 * 60 * 1000;
    private static final String SECRET_KEY = "futstorealtf4!2025#SecureKey1234#futstorealtf4!2025#SecureKey1234#";
    private static final String EMISSOR = "Futstore";

    private static final Key SECRET = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

    public static String createToken(Usuario usuario) {
        return PREFIX + Jwts.builder()
            .setSubject(usuario.getEmail()) 
            .setIssuer(EMISSOR)
            .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION))
            .signWith(SECRET)
            .compact();
    }

    public static String createToken(Cliente cliente) {
        return PREFIX + Jwts.builder()
            .setSubject(cliente.getEmail()) 
            .setIssuer(EMISSOR)
            .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION))
            .signWith(SECRET)
            .compact();
    }

    public static Authentication validate(HttpServletRequest request) {
        String token = request.getHeader(HEADER);

        if (token == null || !token.startsWith(PREFIX)) {
            return null;
        }

        try {
            token = token.replace(PREFIX, "");
            Jws<Claims> jwsClaims = Jwts.parserBuilder()
                                        .setSigningKey(SECRET)
                                        .build()
                                        .parseClaimsJws(token);

            String email = jwsClaims.getBody().getSubject();
            String issuer = jwsClaims.getBody().getIssuer();
            Date expiration = jwsClaims.getBody().getExpiration();

            if (email != null && issuer.equals(EMISSOR) && expiration.after(new Date())) {
                return new UsernamePasswordAuthenticationToken(email, null, Collections.emptyList());
            }
        } catch (Exception e) {
            return null;
        }

        return null;
    }
}

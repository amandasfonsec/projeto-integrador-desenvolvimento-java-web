package br.com.altf4.futstore.security;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Token {
    private String token;

    public Token(String token) {
        super();
        this.token = token;
    }
}

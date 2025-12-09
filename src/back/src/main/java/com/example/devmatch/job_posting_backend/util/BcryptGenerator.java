package com.example.devmatch.job_posting_backend.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * Utilitário para gerar hashes BCrypt
 * Execute este arquivo para gerar hashes de senhas
 */
public class BcryptGenerator {
    
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        String senha = "senha123";
        String hash = encoder.encode(senha);
        
        System.out.println("==================================================");
        System.out.println("GERADOR DE HASH BCRYPT");
        System.out.println("==================================================");
        System.out.println("Senha original: " + senha);
        System.out.println("Hash gerado: " + hash);
        System.out.println("==================================================");
        System.out.println("");
        System.out.println("Use este hash no seu script SQL:");
        System.out.println("INSERT INTO usuarios (nome, email, senha, tipo)");
        System.out.println("VALUES ('Teste', 'teste@test.com', '" + hash + "', 'dev');");
        System.out.println("==================================================");
        
        // Testa o hash
        boolean matches = encoder.matches(senha, hash);
        System.out.println("Teste de validação: " + (matches ? "✅ SUCESSO" : "❌ FALHOU"));
    }
}


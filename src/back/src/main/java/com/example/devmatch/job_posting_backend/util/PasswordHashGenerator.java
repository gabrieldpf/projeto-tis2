package com.example.devmatch.job_posting_backend.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * Utilitário para gerar hashes de senha compatíveis com o sistema
 * Use esta classe para gerar hashes para os scripts SQL de teste
 */
public class PasswordHashGenerator {
    
    public static void main(String[] args) {
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        
        // Senha padrão para testes
        String senhaTeste = "senha123";
        
        // Gera o hash
        String hash = passwordEncoder.encode(senhaTeste);
        
        System.out.println("==============================================");
        System.out.println("GERADOR DE HASH BCRYPT - DevMatch");
        System.out.println("==============================================");
        System.out.println("Senha: " + senhaTeste);
        System.out.println("Hash BCrypt: " + hash);
        System.out.println("==============================================");
        System.out.println("\nCopie este hash e use no arquivo test-data.sql");
        System.out.println("Substitua o hash atual por:");
        System.out.println("'" + hash + "'");
        System.out.println("==============================================");
        
        // Verifica se o hash funciona
        boolean matches = passwordEncoder.matches(senhaTeste, hash);
        System.out.println("\nVerificação: " + (matches ? "✓ Hash válido!" : "✗ Erro no hash"));
    }
}


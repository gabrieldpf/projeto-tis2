package com.example.devmatch.job_posting_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Classe principal da aplicação DevMatch Backend
 * Responsável por inicializar o servidor Spring Boot
 */
@SpringBootApplication
public class JobPostingBackendApplication {
    
    /**
     * Método principal que inicia a aplicação Spring Boot
     * @param args Argumentos da linha de comando
     */
    public static void main(String[] args) {
        SpringApplication.run(JobPostingBackendApplication.class, args);
    }
}
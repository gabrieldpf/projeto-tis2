package com.example.devmatch.job_posting_backend.dto;

import com.example.devmatch.job_posting_backend.entity.Usuario;

/**
 * DTO para resposta de autenticação
 * Retorna os dados do usuário após login ou registro (sem senha)
 */
public class AuthResponseDto {
    
    private Long id;
    private String nome;
    private String email;
    private String tipo;
    private Boolean perfilCompleto;
    
    // Construtores
    public AuthResponseDto() {}
    
    public AuthResponseDto(Long id, String nome, String email, String tipo, Boolean perfilCompleto) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.tipo = tipo;
        this.perfilCompleto = perfilCompleto;
    }
    
    /**
     * Método factory para criar AuthResponseDto a partir de uma entidade Usuario
     * @param usuario Entidade Usuario
     * @param perfilCompleto Se o perfil do usuário está completo
     * @return AuthResponseDto
     */
    public static AuthResponseDto fromEntity(Usuario usuario, Boolean perfilCompleto) {
        return new AuthResponseDto(
            usuario.getId(),
            usuario.getNome(),
            usuario.getEmail(),
            usuario.getTipo(),
            perfilCompleto
        );
    }
    
    // Getters e Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getNome() {
        return nome;
    }
    
    public void setNome(String nome) {
        this.nome = nome;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getTipo() {
        return tipo;
    }
    
    public void setTipo(String tipo) {
        this.tipo = tipo;
    }
    
    public Boolean getPerfilCompleto() {
        return perfilCompleto;
    }
    
    public void setPerfilCompleto(Boolean perfilCompleto) {
        this.perfilCompleto = perfilCompleto;
    }
}


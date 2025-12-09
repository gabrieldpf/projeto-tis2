package com.example.devmatch.job_posting_backend.dto;

import jakarta.validation.constraints.NotNull;

/**
 * DTO para criação de candidatura
 */
public class CandidaturaDto {
    
    @NotNull(message = "ID da vaga é obrigatório")
    private Long vagaId;
    
    @NotNull(message = "ID do usuário é obrigatório")
    private Long usuarioId;
    
    private String mensagem;
    
    // Getters e Setters
    public Long getVagaId() {
        return vagaId;
    }
    
    public void setVagaId(Long vagaId) {
        this.vagaId = vagaId;
    }
    
    public Long getUsuarioId() {
        return usuarioId;
    }
    
    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }
    
    public String getMensagem() {
        return mensagem;
    }
    
    public void setMensagem(String mensagem) {
        this.mensagem = mensagem;
    }
}


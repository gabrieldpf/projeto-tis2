package com.example.devmatch.job_posting_backend.dto;

import com.example.devmatch.job_posting_backend.entity.Candidatura;
import java.time.format.DateTimeFormatter;

/**
 * DTO para resposta de candidatura ao frontend
 */
public class CandidaturaResponseDto {
    private Long id;
    private Long vagaId;
    private Long usuarioId;
    private String status;
    private String dataCandidatura;
    private String mensagem;
    
    // Informações adicionais da vaga (opcional)
    private String tituloVaga;
    private String nomeUsuario;
    
    public static CandidaturaResponseDto fromEntity(Candidatura candidatura) {
        CandidaturaResponseDto dto = new CandidaturaResponseDto();
        dto.id = candidatura.getId();
        dto.vagaId = candidatura.getVagaId();
        dto.usuarioId = candidatura.getUsuarioId();
        dto.status = candidatura.getStatus();
        dto.mensagem = candidatura.getMensagem();
        
        if (candidatura.getDataCandidatura() != null) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
            dto.dataCandidatura = candidatura.getDataCandidatura().format(formatter);
        }
        
        return dto;
    }
    
    // Getters e Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
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
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public String getDataCandidatura() {
        return dataCandidatura;
    }
    
    public void setDataCandidatura(String dataCandidatura) {
        this.dataCandidatura = dataCandidatura;
    }
    
    public String getMensagem() {
        return mensagem;
    }
    
    public void setMensagem(String mensagem) {
        this.mensagem = mensagem;
    }
    
    public String getTituloVaga() {
        return tituloVaga;
    }
    
    public void setTituloVaga(String tituloVaga) {
        this.tituloVaga = tituloVaga;
    }
    
    public String getNomeUsuario() {
        return nomeUsuario;
    }
    
    public void setNomeUsuario(String nomeUsuario) {
        this.nomeUsuario = nomeUsuario;
    }
}


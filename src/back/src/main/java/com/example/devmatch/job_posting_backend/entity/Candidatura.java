package com.example.devmatch.job_posting_backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Entidade que representa uma candidatura de um desenvolvedor a uma vaga
 */
@Entity
@Table(name = "candidaturas")
public class Candidatura {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "vaga_id", nullable = false)
    private Long vagaId;
    
    @Column(name = "usuario_id", nullable = false)
    private Long usuarioId;
    
    @Column(name = "status")
    private String status = "pendente"; // pendente, em_analise, aceito, rejeitado
    
    @Column(name = "data_candidatura")
    private LocalDateTime dataCandidatura = LocalDateTime.now();
    
    @Column(name = "mensagem", length = 1000)
    private String mensagem;
    
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
    
    public LocalDateTime getDataCandidatura() {
        return dataCandidatura;
    }
    
    public void setDataCandidatura(LocalDateTime dataCandidatura) {
        this.dataCandidatura = dataCandidatura;
    }
    
    public String getMensagem() {
        return mensagem;
    }
    
    public void setMensagem(String mensagem) {
        this.mensagem = mensagem;
    }
}


package com.example.devmatch.job_posting_backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import java.time.LocalDateTime;

@Entity
@Table(name = "deliveries")
public class Delivery {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "milestone_id", nullable = false)
    private Milestone milestone;

    @ManyToOne
    @JoinColumn(name = "perfil_dev_id", nullable = false)
    private PerfilDev perfilDev;

    @Column(name = "descricao_entrega", columnDefinition = "TEXT", nullable = false)
    private String descricaoEntrega;

    @Column(name = "arquivos_entrega", columnDefinition = "TEXT")
    private String arquivosEntrega; // JSON array de links/URLs ou paths de arquivos

    @Column(name = "horas_trabalhadas")
    @Min(value = 0, message = "Horas trabalhadas não pode ser negativo")
    private Double horasTrabalhadas;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @Column(name = "reviewed", nullable = false)
    private Boolean reviewed = false;

    @Column(name = "approved")
    private Boolean approved;

    @Column(name = "comentario_revisao", columnDefinition = "TEXT")
    private String comentarioRevisao;

    @Column(name = "data_revisao")
    private LocalDateTime dataRevisao;

    // Campo legado para compatibilidade
    @Column(columnDefinition = "TEXT")
    private String conteudo;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Milestone getMilestone() { return milestone; }
    public void setMilestone(Milestone milestone) { this.milestone = milestone; }

    public PerfilDev getPerfilDev() { return perfilDev; }
    public void setPerfilDev(PerfilDev perfilDev) { this.perfilDev = perfilDev; }

    public String getDescricaoEntrega() { return descricaoEntrega; }
    public void setDescricaoEntrega(String descricaoEntrega) { this.descricaoEntrega = descricaoEntrega; }

    public String getArquivosEntrega() { return arquivosEntrega; }
    public void setArquivosEntrega(String arquivosEntrega) { this.arquivosEntrega = arquivosEntrega; }

    public Double getHorasTrabalhadas() { return horasTrabalhadas; }
    public void setHorasTrabalhadas(Double horasTrabalhadas) { this.horasTrabalhadas = horasTrabalhadas; }

    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }

    public Boolean getReviewed() { return reviewed; }
    public void setReviewed(Boolean reviewed) { this.reviewed = reviewed; }

    public Boolean getApproved() { return approved; }
    public void setApproved(Boolean approved) { this.approved = approved; }

    public String getComentarioRevisao() { return comentarioRevisao; }
    public void setComentarioRevisao(String comentarioRevisao) { this.comentarioRevisao = comentarioRevisao; }

    public LocalDateTime getDataRevisao() { return dataRevisao; }
    public void setDataRevisao(LocalDateTime dataRevisao) { this.dataRevisao = dataRevisao; }

    // Métodos legados para compatibilidade
    public String getConteudo() { 
        return conteudo != null ? conteudo : descricaoEntrega; 
    }
    public void setConteudo(String conteudo) { 
        this.conteudo = conteudo;
        if (descricaoEntrega == null) {
            this.descricaoEntrega = conteudo;
        }
    }
}

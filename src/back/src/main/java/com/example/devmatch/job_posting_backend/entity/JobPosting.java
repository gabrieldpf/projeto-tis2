package com.example.devmatch.job_posting_backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonFormat;

/**
 * Entidade que representa uma vaga de emprego no sistema DevMatch
 * Contém todas as informações necessárias para uma vaga de trabalho
 */
@Entity
@Table(name = "vagas")
public class JobPosting {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "usuario_id")
    private Long usuarioId;

    @NotBlank(message = "Título da vaga é obrigatório")
    @Column(name = "titulo")
    private String title;

    @Column(name = "descricao")
    private String description;

    @NotNull(message = "Nível de experiência é obrigatório")
    @Column(name = "nivel_experiencia")
    private String experienceLevel;

    @Column(name = "regime")
    private String regime;

    @Column(name = "modelo_remuneracao")
    private String modeloRemuneracao;

    @Column(name = "valor_referencia")
    private String valorReferencia;

    @Column(name = "prazo_estimado")
    @JsonFormat(pattern = "dd/MM/yyyy")
    private java.sql.Date prazoEstimado;

    @Column(name = "local_modalidade")
    private String localModalidade;

    @OneToMany(mappedBy = "vaga", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference  // Serializa este lado da relação
    private List<JobSkill> skills = new ArrayList<>();

    @Column(name = "data_publicacao")
    @JsonFormat(pattern = "dd/MM/yyyy HH:mm")
    private LocalDateTime postedDate = LocalDateTime.now();

    @Column(name = "status")
    private String status = "ativa";

    @Column(name = "candidaturas")
    private Integer applications = 0;

    @Column(name = "matches")
    private Integer matches = 0;

    @Lob
    @Column(name = "anexo", columnDefinition = "text")
    private String anexo;

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getExperienceLevel() { return experienceLevel; }
    public void setExperienceLevel(String experienceLevel) { this.experienceLevel = experienceLevel; }

    public String getRegime() { return regime; }
    public void setRegime(String regime) { this.regime = regime; }

    public String getModeloRemuneracao() { return modeloRemuneracao; }
    public void setModeloRemuneracao(String modeloRemuneracao) { this.modeloRemuneracao = modeloRemuneracao; }

    public String getValorReferencia() { return valorReferencia; }
    public void setValorReferencia(String valorReferencia) { this.valorReferencia = valorReferencia; }

    public String getLocalModalidade() { return localModalidade; }
    public void setLocalModalidade(String localModalidade) { this.localModalidade = localModalidade; }

    public List<JobSkill> getSkills() { return skills; }
    public void setSkills(List<JobSkill> skills) { this.skills = skills; }

    public LocalDateTime getPostedDate() { return postedDate; }
    public void setPostedDate(LocalDateTime postedDate) { this.postedDate = postedDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }

    public java.sql.Date getPrazoEstimado() { return prazoEstimado; }
    public void setPrazoEstimado(java.sql.Date prazoEstimado) { this.prazoEstimado = prazoEstimado; }
    
    // Método auxiliar para definir prazo estimado a partir de String (formato: dd/MM/yyyy)
    public void setPrazoEstimado(String prazoEstimadoStr) {
        if (prazoEstimadoStr != null && !prazoEstimadoStr.isEmpty()) {
            try {
                java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("dd/MM/yyyy");
                java.util.Date utilDate = sdf.parse(prazoEstimadoStr);
                this.prazoEstimado = new java.sql.Date(utilDate.getTime());
            } catch (java.text.ParseException e) {
                // Se falhar o parse, deixa null
                this.prazoEstimado = null;
            }
        }
    }

    public Integer getApplications() { return applications; }
    public void setApplications(Integer applications) { this.applications = applications; }

    public Integer getMatches() { return matches; }
    public void setMatches(Integer matches) { this.matches = matches; }

    public String getAnexo() { return anexo; }
    public void setAnexo(String anexo) { this.anexo = anexo; }
}
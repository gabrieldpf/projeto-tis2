package com.example.devmatch.job_posting_backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "feedback",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"project_id", "rater_id"})
    }
)
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ID da vaga/projeto avaliado (armazena ID de vaga, não de projeto de portfolio)
    // Nota: O nome "project_id" é mantido por compatibilidade, mas na verdade armazena vaga_id
    @Column(name = "project_id", nullable = false)
    private Long projectId;

    // Quem está avaliando (usuario logado)
    @Column(name = "rater_id", nullable = false)
    private Long raterId;

    // Quem está sendo avaliado (usuario alvo)
    @Column(name = "rated_id", nullable = false)
    private Long ratedId;

    // Se o avaliado é DEV ou COMPANY (para análise futura)
    @Enumerated(EnumType.STRING)
    @Column(name = "rated_role", nullable = false)
    private UserRoleInProject ratedRole;

    @Column(nullable = false)
    private Integer qualidadeTecnica;

    @Column(nullable = false)
    private Integer cumprimentoPrazos;

    @Column(nullable = false)
    private Integer comunicacao;

    @Column(nullable = false)
    private Integer colaboracao;

    @Column(length = 2000)
    private String comentario; // opcional, min 20 chars se vier preenchido

    // caminho/identificador de evidências (upload você liga depois)
    @Column(name = "evidencias_path")
    private String evidenciasPath;

    @Column(name = "data_avaliacao", nullable = false)
    private LocalDateTime dataAvaliacao;

    // getters & setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProjectId() { return projectId; }
    public void setProjectId(Long projectId) { this.projectId = projectId; }

    public Long getRaterId() { return raterId; }
    public void setRaterId(Long raterId) { this.raterId = raterId; }

    public Long getRatedId() { return ratedId; }
    public void setRatedId(Long ratedId) { this.ratedId = ratedId; }

    public UserRoleInProject getRatedRole() { return ratedRole; }
    public void setRatedRole(UserRoleInProject ratedRole) { this.ratedRole = ratedRole; }

    public Integer getQualidadeTecnica() { return qualidadeTecnica; }
    public void setQualidadeTecnica(Integer qualidadeTecnica) { this.qualidadeTecnica = qualidadeTecnica; }

    public Integer getCumprimentoPrazos() { return cumprimentoPrazos; }
    public void setCumprimentoPrazos(Integer cumprimentoPrazos) { this.cumprimentoPrazos = cumprimentoPrazos; }

    public Integer getComunicacao() { return comunicacao; }
    public void setComunicacao(Integer comunicacao) { this.comunicacao = comunicacao; }

    public Integer getColaboracao() { return colaboracao; }
    public void setColaboracao(Integer colaboracao) { this.colaboracao = colaboracao; }

    public String getComentario() { return comentario; }
    public void setComentario(String comentario) { this.comentario = comentario; }

    public String getEvidenciasPath() { return evidenciasPath; }
    public void setEvidenciasPath(String evidenciasPath) { this.evidenciasPath = evidenciasPath; }

    public LocalDateTime getDataAvaliacao() { return dataAvaliacao; }
    public void setDataAvaliacao(LocalDateTime dataAvaliacao) { this.dataAvaliacao = dataAvaliacao; }
}

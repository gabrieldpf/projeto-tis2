package com.example.devmatch.job_posting_backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "feedback_dispute")
public class FeedbackDispute {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // relacionamento simples: um registro de disputa aponta para um feedback
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name = "feedback_id")
    private Feedback feedback;

    @Column(name = "opened_by_user_id", nullable = false)
    private Long openedByUserId;

    @Column(name = "justificativa_disputa", nullable = false, length = 2000)
    private String justificativaDisputa;

    @Column(name = "evidencias_path", length = 2000)
    private String evidenciasPath;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DisputeStatus status;

    @Enumerated(EnumType.STRING)
    @Column(name = "decisao_mediacao")
    private MediationDecision decisaoMediacao;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    // getters & setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Feedback getFeedback() { return feedback; }
    public void setFeedback(Feedback feedback) { this.feedback = feedback; }

    public Long getOpenedByUserId() { return openedByUserId; }
    public void setOpenedByUserId(Long openedByUserId) { this.openedByUserId = openedByUserId; }

    public String getJustificativaDisputa() { return justificativaDisputa; }
    public void setJustificativaDisputa(String justificativaDisputa) { this.justificativaDisputa = justificativaDisputa; }

    public String getEvidenciasPath() { return evidenciasPath; }
    public void setEvidenciasPath(String evidenciasPath) { this.evidenciasPath = evidenciasPath; }

    public DisputeStatus getStatus() { return status; }
    public void setStatus(DisputeStatus status) { this.status = status; }

    public MediationDecision getDecisaoMediacao() { return decisaoMediacao; }
    public void setDecisaoMediacao(MediationDecision decisaoMediacao) { this.decisaoMediacao = decisaoMediacao; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }
}


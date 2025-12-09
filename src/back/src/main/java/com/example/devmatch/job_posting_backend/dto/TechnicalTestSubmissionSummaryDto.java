package com.example.devmatch.job_posting_backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TechnicalTestSubmissionSummaryDto {
    private Long id;
    private Long vagaId;
    private Long usuarioId;
    private LocalDateTime submittedAt;
    private String status;
    private BigDecimal score;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getVagaId() { return vagaId; }
    public void setVagaId(Long vagaId) { this.vagaId = vagaId; }
    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public BigDecimal getScore() { return score; }
    public void setScore(BigDecimal score) { this.score = score; }
}



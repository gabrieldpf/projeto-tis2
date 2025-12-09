package com.example.devmatch.job_posting_backend.dto;

import java.time.LocalDateTime;
import java.util.List;

public class TechnicalTestResponseDto {
    private Long id;
    private Long vagaId;
    private String type;
    private String urlPdf;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<TechnicalTestQuestionDto> questions;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getVagaId() { return vagaId; }
    public void setVagaId(Long vagaId) { this.vagaId = vagaId; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getUrlPdf() { return urlPdf; }
    public void setUrlPdf(String urlPdf) { this.urlPdf = urlPdf; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public List<TechnicalTestQuestionDto> getQuestions() { return questions; }
    public void setQuestions(List<TechnicalTestQuestionDto> questions) { this.questions = questions; }
}



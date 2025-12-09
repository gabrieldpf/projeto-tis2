package com.example.devmatch.job_posting_backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class TechnicalTestSubmissionDetailDto {
    public static class AnswerDto {
        private Long id;
        private String title;
        private String language;
        private String code;
        private String result;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getLanguage() { return language; }
        public void setLanguage(String language) { this.language = language; }
        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }
        public String getResult() { return result; }
        public void setResult(String result) { this.result = result; }
    }

    private Long id;
    private Long vagaId;
    private Long usuarioId;
    private LocalDateTime submittedAt;
    private String status;
    private BigDecimal score;
    private String rawPayload;
    private List<AnswerDto> answers = new ArrayList<>();

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
    public String getRawPayload() { return rawPayload; }
    public void setRawPayload(String rawPayload) { this.rawPayload = rawPayload; }
    public List<AnswerDto> getAnswers() { return answers; }
    public void setAnswers(List<AnswerDto> answers) { this.answers = answers; }
}



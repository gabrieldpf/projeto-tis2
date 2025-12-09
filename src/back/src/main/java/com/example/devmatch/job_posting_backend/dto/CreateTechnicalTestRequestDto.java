package com.example.devmatch.job_posting_backend.dto;

import jakarta.validation.constraints.NotNull;
import java.util.List;

public class CreateTechnicalTestRequestDto {
    @NotNull
    private Long vagaId;
    @NotNull
    private String type; // 'pdf' | 'questions'
    private String urlPdf;
    private List<TechnicalTestQuestionDto> questions;

    public Long getVagaId() { return vagaId; }
    public void setVagaId(Long vagaId) { this.vagaId = vagaId; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getUrlPdf() { return urlPdf; }
    public void setUrlPdf(String urlPdf) { this.urlPdf = urlPdf; }
    public List<TechnicalTestQuestionDto> getQuestions() { return questions; }
    public void setQuestions(List<TechnicalTestQuestionDto> questions) { this.questions = questions; }
}



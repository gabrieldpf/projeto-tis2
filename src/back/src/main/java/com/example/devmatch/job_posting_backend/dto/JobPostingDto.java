package com.example.devmatch.job_posting_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

/**
 * DTO (Data Transfer Object) para transferência de dados de vagas
 * Usado para receber dados do frontend e validar informações antes de salvar
 */
public class JobPostingDto {
    @NotBlank(message = "Título da vaga é obrigatório")
    private String title;

    private String description;  // Descrição opcional da vaga

    @NotNull(message = "Nível de experiência é obrigatório")
    private String experienceLevel;

    private String regime;

    private String modeloRemuneracao;

    @NotBlank(message = "Valor de referência é obrigatório")
    private String valorReferencia;

    private String localModalidade;

    private String prazoEstimado;

    private String anexo;

    private Long usuarioId;  // ID do usuário (empresa) que criou a vaga

    private List<String> skills;  // Lista de habilidades técnicas

    // Getters e Setters
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getExperienceLevel() {
        return experienceLevel;
    }

    public void setExperienceLevel(String experienceLevel) {
        this.experienceLevel = experienceLevel;
    }

    public String getRegime() {
        return regime;
    }

    public void setRegime(String regime) {
        this.regime = regime;
    }

    public String getModeloRemuneracao() {
        return modeloRemuneracao;
    }

    public void setModeloRemuneracao(String modeloRemuneracao) {
        this.modeloRemuneracao = modeloRemuneracao;
    }

    public String getValorReferencia() {
        return valorReferencia;
    }

    public void setValorReferencia(String valorReferencia) {
        this.valorReferencia = valorReferencia;
    }

    public String getLocalModalidade() {
        return localModalidade;
    }

    public void setLocalModalidade(String localModalidade) {
        this.localModalidade = localModalidade;
    }

    public List<String> getSkills() {
        return skills;
    }

    public void setSkills(List<String> skills) {
        this.skills = skills;
    }

    public String getPrazoEstimado() {
        return prazoEstimado;
    }

    public void setPrazoEstimado(String prazoEstimado) {
        this.prazoEstimado = prazoEstimado;
    }

    public String getAnexo() {
        return anexo;
    }

    public void setAnexo(String anexo) {
        this.anexo = anexo;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }
}
package com.example.devmatch.job_posting_backend.dto;

import java.util.List;
import java.util.ArrayList;

/**
 * DTO para retornar vagas com percentual de compatibilidade
 */
public class JobMatchDto {
    private Long vagaId;
    private String titulo;
    private String descricao;
    private String experienceLevel;
    private String localModalidade;
    private String valorReferencia;
    private String regime;
    private double compatibilidade; // Percentual de 0 a 100
    private List<String> skills;
    private String nomeEmpresa; // Nome da empresa que publicou a vaga
    
    // Detalhes do matching
    private MatchingDetails matchingDetails;
    
    // Getters e Setters
    public Long getVagaId() {
        return vagaId;
    }
    
    public void setVagaId(Long vagaId) {
        this.vagaId = vagaId;
    }
    
    public String getTitulo() {
        return titulo;
    }
    
    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }
    
    public String getDescricao() {
        return descricao;
    }
    
    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }
    
    public String getExperienceLevel() {
        return experienceLevel;
    }
    
    public void setExperienceLevel(String experienceLevel) {
        this.experienceLevel = experienceLevel;
    }
    
    public String getLocalModalidade() {
        return localModalidade;
    }
    
    public void setLocalModalidade(String localModalidade) {
        this.localModalidade = localModalidade;
    }
    
    public String getValorReferencia() {
        return valorReferencia;
    }
    
    public void setValorReferencia(String valorReferencia) {
        this.valorReferencia = valorReferencia;
    }
    
    public String getRegime() {
        return regime;
    }
    
    public void setRegime(String regime) {
        this.regime = regime;
    }
    
    public double getCompatibilidade() {
        return compatibilidade;
    }
    
    public void setCompatibilidade(double compatibilidade) {
        this.compatibilidade = compatibilidade;
    }
    
    public List<String> getSkills() {
        return skills;
    }
    
    public void setSkills(List<String> skills) {
        this.skills = skills;
    }
    
    public String getNomeEmpresa() {
        return nomeEmpresa;
    }
    
    public void setNomeEmpresa(String nomeEmpresa) {
        this.nomeEmpresa = nomeEmpresa;
    }
    
    public MatchingDetails getMatchingDetails() {
        return matchingDetails;
    }
    
    public void setMatchingDetails(MatchingDetails matchingDetails) {
        this.matchingDetails = matchingDetails;
    }
    
    /**
     * Classe interna para detalhes do matching
     */
    public static class MatchingDetails {
        private double scoreLocalizacao;
        private double scoreSalario;
        private double scoreContrato;
        private double scorePreferencias;
        private double scoreSkills;
        
        private List<String> skillsEmComum = new ArrayList<>();
        private List<String> skillsFaltantes = new ArrayList<>();
        private List<String> motivosPositivos = new ArrayList<>();
        private List<String> sugestoesMelhoria = new ArrayList<>();
        
        // Getters e Setters
        public double getScoreLocalizacao() { return scoreLocalizacao; }
        public void setScoreLocalizacao(double scoreLocalizacao) { this.scoreLocalizacao = scoreLocalizacao; }
        
        public double getScoreSalario() { return scoreSalario; }
        public void setScoreSalario(double scoreSalario) { this.scoreSalario = scoreSalario; }
        
        public double getScoreContrato() { return scoreContrato; }
        public void setScoreContrato(double scoreContrato) { this.scoreContrato = scoreContrato; }
        
        public double getScorePreferencias() { return scorePreferencias; }
        public void setScorePreferencias(double scorePreferencias) { this.scorePreferencias = scorePreferencias; }
        
        public double getScoreSkills() { return scoreSkills; }
        public void setScoreSkills(double scoreSkills) { this.scoreSkills = scoreSkills; }
        
        public List<String> getSkillsEmComum() { return skillsEmComum; }
        public void setSkillsEmComum(List<String> skillsEmComum) { this.skillsEmComum = skillsEmComum; }
        
        public List<String> getSkillsFaltantes() { return skillsFaltantes; }
        public void setSkillsFaltantes(List<String> skillsFaltantes) { this.skillsFaltantes = skillsFaltantes; }
        
        public List<String> getMotivosPositivos() { return motivosPositivos; }
        public void setMotivosPositivos(List<String> motivosPositivos) { this.motivosPositivos = motivosPositivos; }
        
        public List<String> getSugestoesMelhoria() { return sugestoesMelhoria; }
        public void setSugestoesMelhoria(List<String> sugestoesMelhoria) { this.sugestoesMelhoria = sugestoesMelhoria; }
    }
}


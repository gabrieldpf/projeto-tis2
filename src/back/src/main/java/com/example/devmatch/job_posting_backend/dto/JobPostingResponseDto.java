package com.example.devmatch.job_posting_backend.dto;

import com.example.devmatch.job_posting_backend.entity.JobPosting;
import java.time.format.DateTimeFormatter;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.stream.Collectors;

/**
 * DTO para resposta de vagas ao frontend
 * Previne loops de serialização JSON
 */
public class JobPostingResponseDto {
    private Long id;
    private String title;
    private String description;
    private String experienceLevel;
    private String regime;
    private String modeloRemuneracao;
    private String valorReferencia;
    private String prazoEstimado;
    private String localModalidade;
    private List<SkillDto> skills;
    private String postedDate;
    private String status;
    private Integer applications;
    private Integer matches;
    private String anexo;
    private Long usuarioId;
    private String nomeEmpresa;

    public static class SkillDto {
        private Long id;
        private String skill;

        public SkillDto(Long id, String skill) {
            this.id = id;
            this.skill = skill;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getSkill() { return skill; }
        public void setSkill(String skill) { this.skill = skill; }
    }

    // Construtor que converte JobPosting para DTO (sem nome da empresa)
    public static JobPostingResponseDto fromEntity(JobPosting job) {
        return fromEntity(job, null);
    }
    
    // Construtor que converte JobPosting para DTO com nome da empresa
    public static JobPostingResponseDto fromEntity(JobPosting job, String nomeEmpresa) {
        JobPostingResponseDto dto = new JobPostingResponseDto();
        dto.id = job.getId();
        dto.title = job.getTitle();
        dto.description = job.getDescription();
        dto.experienceLevel = job.getExperienceLevel();
        dto.regime = job.getRegime();
        dto.modeloRemuneracao = job.getModeloRemuneracao();
        dto.valorReferencia = job.getValorReferencia();
        dto.localModalidade = job.getLocalModalidade();
        dto.status = job.getStatus();
        dto.applications = job.getApplications();
        dto.matches = job.getMatches();
        dto.anexo = job.getAnexo();
        dto.usuarioId = job.getUsuarioId();
        dto.nomeEmpresa = nomeEmpresa; // Nome da empresa (pode ser null)

        // Formatar data de publicação
        if (job.getPostedDate() != null) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
            dto.postedDate = job.getPostedDate().format(formatter);
        }

        // Formatar prazo estimado
        if (job.getPrazoEstimado() != null) {
            SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
            dto.prazoEstimado = sdf.format(job.getPrazoEstimado());
        }

        // Converter skills para DTO simples (sem referência circular)
        if (job.getSkills() != null) {
            dto.skills = job.getSkills().stream()
                .map(skill -> new SkillDto(skill.getId(), skill.getSkill()))
                .collect(Collectors.toList());
        }

        return dto;
    }

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

    public String getPrazoEstimado() { return prazoEstimado; }
    public void setPrazoEstimado(String prazoEstimado) { this.prazoEstimado = prazoEstimado; }

    public String getLocalModalidade() { return localModalidade; }
    public void setLocalModalidade(String localModalidade) { this.localModalidade = localModalidade; }

    public List<SkillDto> getSkills() { return skills; }
    public void setSkills(List<SkillDto> skills) { this.skills = skills; }

    public String getPostedDate() { return postedDate; }
    public void setPostedDate(String postedDate) { this.postedDate = postedDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getApplications() { return applications; }
    public void setApplications(Integer applications) { this.applications = applications; }

    public Integer getMatches() { return matches; }
    public void setMatches(Integer matches) { this.matches = matches; }

    public String getAnexo() { return anexo; }
    public void setAnexo(String anexo) { this.anexo = anexo; }

    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }

    public String getNomeEmpresa() { return nomeEmpresa; }
    public void setNomeEmpresa(String nomeEmpresa) { this.nomeEmpresa = nomeEmpresa; }
}


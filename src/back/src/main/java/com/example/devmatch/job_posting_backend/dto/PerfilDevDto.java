package com.example.devmatch.job_posting_backend.dto;

import com.example.devmatch.job_posting_backend.entity.PerfilDev;
import com.example.devmatch.job_posting_backend.entity.Habilidade;
import com.example.devmatch.job_posting_backend.entity.Certificacao;
import com.example.devmatch.job_posting_backend.entity.Experiencia;
import com.example.devmatch.job_posting_backend.entity.Formacao;
import com.example.devmatch.job_posting_backend.entity.Projeto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * DTO para criação e atualização de perfil de desenvolvedor
 */
public class PerfilDevDto {
    
    private Long id;
    
    @NotNull(message = "ID do usuário é obrigatório")
    private Long usuarioId;
    
    @NotBlank(message = "Título profissional é obrigatório")
    private String titular;
    
    private String resumo;
    private String localizacao;
    private String github;
    private String linkedin;
    private String portfolio;
    private String faixaSalarial;
    private String tipoContrato;
    private String modoTrabalho;
    private String disponibilidade;
    private String[] preferenciasVaga;
    private String[] idiomas;
    private Boolean perfilCompleto;
    private LocalDateTime dataAtualizacao;
    private List<HabilidadeDto> habilidades;
    private List<CertificacaoDto> certificacoes;
    private List<ExperienciaDto> experiencias;
    private List<FormacaoDto> formacoes;
    private List<ProjetoDto> projetos;
    
    // Construtores
    public PerfilDevDto() {}
    
    // Método para converter DTO em Entidade
    public PerfilDev toEntity() {
        PerfilDev perfil = new PerfilDev();
        perfil.setId(this.id);
        perfil.setUsuarioId(this.usuarioId);
        perfil.setTitular(this.titular);
        perfil.setResumo(this.resumo);
        perfil.setLocalizacao(this.localizacao);
        perfil.setGithub(this.github);
        perfil.setLinkedin(this.linkedin);
        perfil.setPortfolio(this.portfolio);
        perfil.setFaixaSalarial(this.faixaSalarial);
        perfil.setTipoContrato(this.tipoContrato);
        perfil.setModoTrabalho(this.modoTrabalho);
        perfil.setDisponibilidade(this.disponibilidade);
        perfil.setPreferenciasVaga(this.preferenciasVaga);
        perfil.setIdiomas(this.idiomas);
        perfil.setPerfilCompleto(this.perfilCompleto != null ? this.perfilCompleto : false);
        perfil.setDataAtualizacao(LocalDateTime.now());
        
        // Processa habilidades
        if (this.habilidades != null && !this.habilidades.isEmpty()) {
            List<Habilidade> habilidadesEntity = this.habilidades.stream()
                .map(habDto -> {
                    Habilidade hab = habDto.toEntity();
                    hab.setPerfilDev(perfil);
                    return hab;
                })
                .collect(Collectors.toList());
            perfil.setHabilidades(habilidadesEntity);
        }
        
        // Processa certificações
        if (this.certificacoes != null && !this.certificacoes.isEmpty()) {
            List<Certificacao> certificacoesEntity = this.certificacoes.stream()
                .map(certDto -> {
                    Certificacao cert = certDto.toEntity();
                    cert.setPerfilDev(perfil);
                    return cert;
                })
                .collect(Collectors.toList());
            perfil.setCertificacoes(certificacoesEntity);
        }
        
        // Processa experiências
        if (this.experiencias != null && !this.experiencias.isEmpty()) {
            List<Experiencia> experienciasEntity = this.experiencias.stream()
                .map(expDto -> {
                    Experiencia exp = expDto.toEntity();
                    exp.setPerfilDev(perfil);
                    return exp;
                })
                .collect(Collectors.toList());
            perfil.setExperiencias(experienciasEntity);
        }
        
        // Processa formações
        if (this.formacoes != null && !this.formacoes.isEmpty()) {
            List<Formacao> formacoesEntity = this.formacoes.stream()
                .map(formDto -> {
                    Formacao form = formDto.toEntity();
                    form.setPerfilDev(perfil);
                    return form;
                })
                .collect(Collectors.toList());
            perfil.setFormacoes(formacoesEntity);
        }
        
        // Processa projetos
        if (this.projetos != null && !this.projetos.isEmpty()) {
            List<Projeto> projetosEntity = this.projetos.stream()
                .map(projDto -> {
                    Projeto proj = projDto.toEntity();
                    proj.setPerfilDev(perfil);
                    return proj;
                })
                .collect(Collectors.toList());
            perfil.setProjetos(projetosEntity);
        }
        
        return perfil;
    }
    
    // Método para converter Entidade em DTO
    public static PerfilDevDto fromEntity(PerfilDev perfil) {
        PerfilDevDto dto = new PerfilDevDto();
        dto.setId(perfil.getId());
        dto.setUsuarioId(perfil.getUsuarioId());
        dto.setTitular(perfil.getTitular());
        dto.setResumo(perfil.getResumo());
        dto.setLocalizacao(perfil.getLocalizacao());
        dto.setGithub(perfil.getGithub());
        dto.setLinkedin(perfil.getLinkedin());
        dto.setPortfolio(perfil.getPortfolio());
        dto.setFaixaSalarial(perfil.getFaixaSalarial());
        dto.setTipoContrato(perfil.getTipoContrato());
        dto.setModoTrabalho(perfil.getModoTrabalho());
        dto.setDisponibilidade(perfil.getDisponibilidade());
        dto.setPreferenciasVaga(perfil.getPreferenciasVaga());
        dto.setIdiomas(perfil.getIdiomas());
        dto.setPerfilCompleto(perfil.getPerfilCompleto());
        dto.setDataAtualizacao(perfil.getDataAtualizacao());
        
        // Converte habilidades
        if (perfil.getHabilidades() != null && !perfil.getHabilidades().isEmpty()) {
            List<HabilidadeDto> habilidadesDto = perfil.getHabilidades().stream()
                .map(HabilidadeDto::fromEntity)
                .collect(Collectors.toList());
            dto.setHabilidades(habilidadesDto);
        }
        
        // Converte certificações
        if (perfil.getCertificacoes() != null && !perfil.getCertificacoes().isEmpty()) {
            List<CertificacaoDto> certificacoesDto = perfil.getCertificacoes().stream()
                .map(CertificacaoDto::fromEntity)
                .collect(Collectors.toList());
            dto.setCertificacoes(certificacoesDto);
        }
        
        // Converte experiências
        if (perfil.getExperiencias() != null && !perfil.getExperiencias().isEmpty()) {
            List<ExperienciaDto> experienciasDto = perfil.getExperiencias().stream()
                .map(ExperienciaDto::fromEntity)
                .collect(Collectors.toList());
            dto.setExperiencias(experienciasDto);
        }
        
        // Converte formações
        if (perfil.getFormacoes() != null && !perfil.getFormacoes().isEmpty()) {
            List<FormacaoDto> formacoesDto = perfil.getFormacoes().stream()
                .map(FormacaoDto::fromEntity)
                .collect(Collectors.toList());
            dto.setFormacoes(formacoesDto);
        }
        
        // Converte projetos
        if (perfil.getProjetos() != null && !perfil.getProjetos().isEmpty()) {
            List<ProjetoDto> projetosDto = perfil.getProjetos().stream()
                .map(ProjetoDto::fromEntity)
                .collect(Collectors.toList());
            dto.setProjetos(projetosDto);
        }
        
        return dto;
    }
    
    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
    
    public String getTitular() { return titular; }
    public void setTitular(String titular) { this.titular = titular; }
    
    public String getResumo() { return resumo; }
    public void setResumo(String resumo) { this.resumo = resumo; }
    
    public String getLocalizacao() { return localizacao; }
    public void setLocalizacao(String localizacao) { this.localizacao = localizacao; }
    
    public String getGithub() { return github; }
    public void setGithub(String github) { this.github = github; }
    
    public String getLinkedin() { return linkedin; }
    public void setLinkedin(String linkedin) { this.linkedin = linkedin; }
    
    public String getPortfolio() { return portfolio; }
    public void setPortfolio(String portfolio) { this.portfolio = portfolio; }
    
    public String getFaixaSalarial() { return faixaSalarial; }
    public void setFaixaSalarial(String faixaSalarial) { this.faixaSalarial = faixaSalarial; }
    
    public String getTipoContrato() { return tipoContrato; }
    public void setTipoContrato(String tipoContrato) { this.tipoContrato = tipoContrato; }
    
    public String getModoTrabalho() { return modoTrabalho; }
    public void setModoTrabalho(String modoTrabalho) { this.modoTrabalho = modoTrabalho; }
    
    public String getDisponibilidade() { return disponibilidade; }
    public void setDisponibilidade(String disponibilidade) { this.disponibilidade = disponibilidade; }
    
    public String[] getPreferenciasVaga() { return preferenciasVaga; }
    public void setPreferenciasVaga(String[] preferenciasVaga) { this.preferenciasVaga = preferenciasVaga; }
    
    public String[] getIdiomas() { return idiomas; }
    public void setIdiomas(String[] idiomas) { this.idiomas = idiomas; }
    
    public Boolean getPerfilCompleto() { return perfilCompleto; }
    public void setPerfilCompleto(Boolean perfilCompleto) { this.perfilCompleto = perfilCompleto; }
    
    public LocalDateTime getDataAtualizacao() { return dataAtualizacao; }
    public void setDataAtualizacao(LocalDateTime dataAtualizacao) { this.dataAtualizacao = dataAtualizacao; }
    
    public List<HabilidadeDto> getHabilidades() { return habilidades; }
    public void setHabilidades(List<HabilidadeDto> habilidades) { this.habilidades = habilidades; }
    
    public List<CertificacaoDto> getCertificacoes() { return certificacoes; }
    public void setCertificacoes(List<CertificacaoDto> certificacoes) { this.certificacoes = certificacoes; }
    
    public List<ExperienciaDto> getExperiencias() { return experiencias; }
    public void setExperiencias(List<ExperienciaDto> experiencias) { this.experiencias = experiencias; }
    
    public List<FormacaoDto> getFormacoes() { return formacoes; }
    public void setFormacoes(List<FormacaoDto> formacoes) { this.formacoes = formacoes; }
    
    public List<ProjetoDto> getProjetos() { return projetos; }
    public void setProjetos(List<ProjetoDto> projetos) { this.projetos = projetos; }
}


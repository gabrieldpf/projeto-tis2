package com.example.devmatch.job_posting_backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;
import com.fasterxml.jackson.annotation.JsonManagedReference;

/**
 * Entidade que representa o perfil de um desenvolvedor no sistema DevMatch
 * Contém informações profissionais, habilidades e preferências
 */
@Entity
@Table(name = "perfis_dev")
public class PerfilDev {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "usuario_id", unique = true)
    private Long usuarioId;

    @Column(name = "titular")
    private String titular;

    @Column(name = "resumo", columnDefinition = "TEXT")
    private String resumo;

    @Column(name = "localizacao")
    private String localizacao;

    @Column(name = "github")
    private String github;

    @Column(name = "linkedin")
    private String linkedin;

    @Column(name = "portfolio")
    private String portfolio;

    @Column(name = "faixa_salarial")
    private String faixaSalarial;

    @Column(name = "tipo_contrato")
    private String tipoContrato;

    @Column(name = "modo_trabalho")
    private String modoTrabalho;

    @Column(name = "disponibilidade")
    private String disponibilidade;

    @Column(name = "preferencias_vaga", columnDefinition = "TEXT[]")
    private String[] preferenciasVaga;

    @Column(name = "idiomas", columnDefinition = "TEXT[]")
    private String[] idiomas;

    @Column(name = "perfil_completo")
    private Boolean perfilCompleto = false;

    @Column(name = "data_atualizacao")
    private LocalDateTime dataAtualizacao = LocalDateTime.now();

    // Relacionamentos com outras entidades
    @OneToMany(mappedBy = "perfilDev", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Certificacao> certificacoes = new ArrayList<>();

    @OneToMany(mappedBy = "perfilDev", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Experiencia> experiencias = new ArrayList<>();

    @OneToMany(mappedBy = "perfilDev", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Formacao> formacoes = new ArrayList<>();

    @OneToMany(mappedBy = "perfilDev", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Habilidade> habilidades = new ArrayList<>();

    @OneToMany(mappedBy = "perfilDev", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Projeto> projetos = new ArrayList<>();

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

    public List<Certificacao> getCertificacoes() { return certificacoes; }
    public void setCertificacoes(List<Certificacao> certificacoes) { this.certificacoes = certificacoes; }

    public List<Experiencia> getExperiencias() { return experiencias; }
    public void setExperiencias(List<Experiencia> experiencias) { this.experiencias = experiencias; }

    public List<Formacao> getFormacoes() { return formacoes; }
    public void setFormacoes(List<Formacao> formacoes) { this.formacoes = formacoes; }

    public List<Habilidade> getHabilidades() { return habilidades; }
    public void setHabilidades(List<Habilidade> habilidades) { this.habilidades = habilidades; }

    public List<Projeto> getProjetos() { return projetos; }
    public void setProjetos(List<Projeto> projetos) { this.projetos = projetos; }
}


package com.example.devmatch.job_posting_backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import com.fasterxml.jackson.annotation.JsonBackReference;

/**
 * Entidade que representa a formação acadêmica de um desenvolvedor
 */
@Entity
@Table(name = "formacao")
public class Formacao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "perfil_dev_id")
    @JsonBackReference
    private PerfilDev perfilDev;

    @NotBlank(message = "Grau é obrigatório")
    @Column(name = "grau")
    private String grau;

    @NotBlank(message = "Instituição é obrigatória")
    @Column(name = "instituicao")
    private String instituicao;

    @NotBlank(message = "Ano é obrigatório")
    @Column(name = "ano")
    private String ano;

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public PerfilDev getPerfilDev() { return perfilDev; }
    public void setPerfilDev(PerfilDev perfilDev) { this.perfilDev = perfilDev; }

    public String getGrau() { return grau; }
    public void setGrau(String grau) { this.grau = grau; }

    public String getInstituicao() { return instituicao; }
    public void setInstituicao(String instituicao) { this.instituicao = instituicao; }

    public String getAno() { return ano; }
    public void setAno(String ano) { this.ano = ano; }
}


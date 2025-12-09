package com.example.devmatch.job_posting_backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import com.fasterxml.jackson.annotation.JsonBackReference;
import java.sql.Date;

/**
 * Entidade que representa a experiência profissional de um desenvolvedor
 */
@Entity
@Table(name = "experiencias")
public class Experiencia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "perfil_dev_id")
    @JsonBackReference
    private PerfilDev perfilDev;

    @NotBlank(message = "Cargo é obrigatório")
    @Column(name = "cargo")
    private String cargo;

    @NotBlank(message = "Empresa é obrigatória")
    @Column(name = "empresa")
    private String empresa;

    @Column(name = "data_inicio")
    private Date dataInicio;

    @Column(name = "data_fim")
    private Date dataFim;

    @Column(name = "descricao", columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "trabalhando_atualmente")
    private Boolean trabalhandoAtualmente = false;

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public PerfilDev getPerfilDev() { return perfilDev; }
    public void setPerfilDev(PerfilDev perfilDev) { this.perfilDev = perfilDev; }

    public String getCargo() { return cargo; }
    public void setCargo(String cargo) { this.cargo = cargo; }

    public String getEmpresa() { return empresa; }
    public void setEmpresa(String empresa) { this.empresa = empresa; }

    public Date getDataInicio() { return dataInicio; }
    public void setDataInicio(Date dataInicio) { this.dataInicio = dataInicio; }

    public Date getDataFim() { return dataFim; }
    public void setDataFim(Date dataFim) { this.dataFim = dataFim; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public Boolean getTrabalhandoAtualmente() { return trabalhandoAtualmente; }
    public void setTrabalhandoAtualmente(Boolean trabalhandoAtualmente) { this.trabalhandoAtualmente = trabalhandoAtualmente; }
}


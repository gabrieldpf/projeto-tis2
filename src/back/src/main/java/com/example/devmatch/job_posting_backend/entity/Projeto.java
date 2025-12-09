package com.example.devmatch.job_posting_backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import com.fasterxml.jackson.annotation.JsonBackReference;

/**
 * Entidade que representa um projeto desenvolvido por um desenvolvedor
 */
@Entity
@Table(name = "projetos")
public class Projeto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "perfil_dev_id")
    @JsonBackReference
    private PerfilDev perfilDev;

    @NotBlank(message = "Nome do projeto é obrigatório")
    @Column(name = "nome")
    private String nome;

    @NotBlank(message = "Descrição é obrigatória")
    @Column(name = "descricao", columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "tecnologias", columnDefinition = "TEXT")
    private String tecnologias;

    @Column(name = "link")
    private String link;

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public PerfilDev getPerfilDev() { return perfilDev; }
    public void setPerfilDev(PerfilDev perfilDev) { this.perfilDev = perfilDev; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public String getTecnologias() { return tecnologias; }
    public void setTecnologias(String tecnologias) { this.tecnologias = tecnologias; }

    public String getLink() { return link; }
    public void setLink(String link) { this.link = link; }
}


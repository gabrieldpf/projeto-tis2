package com.example.devmatch.job_posting_backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import com.fasterxml.jackson.annotation.JsonBackReference;

/**
 * Entidade que representa uma habilidade técnica de um desenvolvedor
 */
@Entity
@Table(name = "habilidades")
public class Habilidade {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "perfil_dev_id")
    @JsonBackReference
    private PerfilDev perfilDev;

    @NotBlank(message = "Categoria é obrigatória")
    @Column(name = "categoria")
    private String categoria; // linguagens, frameworks, bancos_dados, ferramentas, soft

    @NotBlank(message = "Habilidade é obrigatória")
    @Column(name = "habilidade")
    private String habilidade;

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public PerfilDev getPerfilDev() { return perfilDev; }
    public void setPerfilDev(PerfilDev perfilDev) { this.perfilDev = perfilDev; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public String getHabilidade() { return habilidade; }
    public void setHabilidade(String habilidade) { this.habilidade = habilidade; }
}


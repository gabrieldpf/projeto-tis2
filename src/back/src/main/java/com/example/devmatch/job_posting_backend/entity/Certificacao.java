package com.example.devmatch.job_posting_backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import com.fasterxml.jackson.annotation.JsonBackReference;
import java.sql.Date;

/**
 * Entidade que representa uma certificação profissional de um desenvolvedor
 */
@Entity
@Table(name = "certificacoes")
public class Certificacao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "perfil_dev_id")
    @JsonBackReference
    private PerfilDev perfilDev;

    @NotBlank(message = "Nome da certificação é obrigatório")
    @Column(name = "nome")
    private String nome;

    @NotBlank(message = "Emissor é obrigatório")
    @Column(name = "emissor")
    private String emissor;

    @Column(name = "data_validade")
    private Date dataValidade;

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public PerfilDev getPerfilDev() { return perfilDev; }
    public void setPerfilDev(PerfilDev perfilDev) { this.perfilDev = perfilDev; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEmissor() { return emissor; }
    public void setEmissor(String emissor) { this.emissor = emissor; }

    public Date getDataValidade() { return dataValidade; }
    public void setDataValidade(Date dataValidade) { this.dataValidade = dataValidade; }
}


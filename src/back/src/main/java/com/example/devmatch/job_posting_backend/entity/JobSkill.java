package com.example.devmatch.job_posting_backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

import com.fasterxml.jackson.annotation.JsonBackReference;

/**
 * Entidade que representa uma habilidade técnica associada a uma vaga
 * Cada vaga pode ter múltiplas habilidades técnicas
 */
@Entity
@Table(name = "habilidades_vagas")
public class JobSkill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "vaga_id")
    @JsonBackReference  // Ignora serialização deste lado para quebrar loop
    private JobPosting vaga;

    @NotBlank(message = "Nome da habilidade é obrigatório")
    @Column(name = "habilidade")
    private String skill;

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public JobPosting getVaga() { return vaga; }
    public void setVaga(JobPosting vaga) { this.vaga = vaga; }

    public String getSkill() { return skill; }
    public void setSkill(String skill) { this.skill = skill; }
    
    // Método auxiliar para manter compatibilidade
    public void setJob(JobPosting job) { this.vaga = job; }
    public JobPosting getJob() { return vaga; }
}
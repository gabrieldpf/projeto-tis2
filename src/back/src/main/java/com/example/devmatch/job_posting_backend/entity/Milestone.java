package com.example.devmatch.job_posting_backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "milestones")
public class Milestone {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "projeto_id")
    private Projeto projeto; // legado (portfólio dev)

    @ManyToOne
    @JoinColumn(name = "vaga_id")
    private JobPosting vaga; // marcos planejados para vaga PROJETO

    @ManyToOne
    @JoinColumn(name = "contract_id")
    private Contract contract;

    @NotBlank
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "prazo_entrega")
    private LocalDateTime dueDate;

    @Column(name = "valor_milestone", precision = 10, scale = 2)
    @NotNull
    @Positive(message = "Valor do milestone deve ser maior que zero")
    private BigDecimal valorMilestone;

    @Column(name = "criterios_aceitacao", columnDefinition = "TEXT")
    private String criteriosAceitacao;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Projeto getProjeto() { return projeto; }
    public void setProjeto(Projeto projeto) { this.projeto = projeto; }

    public Contract getContract() { return contract; }
    public void setContract(Contract contract) { this.contract = contract; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public LocalDateTime getDueDate() { return dueDate; }
    public void setDueDate(LocalDateTime dueDate) { this.dueDate = dueDate; }

    public BigDecimal getValorMilestone() { return valorMilestone; }
    public void setValorMilestone(BigDecimal valorMilestone) { this.valorMilestone = valorMilestone; }

    public String getCriteriosAceitacao() { return criteriosAceitacao; }
    public void setCriteriosAceitacao(String criteriosAceitacao) { this.criteriosAceitacao = criteriosAceitacao; }
}

package com.example.devmatch.job_posting_backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "perfil_empresa")
@Data
public class PerfilEmpresa {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "usuario_id", unique = true, nullable = false)
    private Usuario usuario;
    
    @Column(name = "nome_empresa", length = 200)
    private String nomeEmpresa;
    
    @Column(name = "descricao", columnDefinition = "TEXT")
    private String descricao;
    
    @Column(name = "setor", length = 100)
    private String setor;
    
    @Column(name = "tamanho", length = 100)
    private String tamanho;
    
    @Column(name = "localizacao", length = 200)
    private String localizacao;
    
    @Column(name = "ano_fundacao", length = 4)
    private String anoFundacao;
    
    @Column(name = "website", length = 500)
    private String website;
    
    @Column(name = "linkedin", length = 500)
    private String linkedin;
    
    @Column(name = "instagram", length = 500)
    private String instagram;
    
    @Column(name = "facebook", length = 500)
    private String facebook;
    
    @Column(name = "cultura", columnDefinition = "TEXT")
    private String cultura;
    
    @ElementCollection
    @CollectionTable(name = "empresa_beneficios", joinColumns = @JoinColumn(name = "perfil_empresa_id"))
    @Column(name = "beneficio")
    private List<String> beneficios = new ArrayList<>();
    
    @Column(name = "missao", columnDefinition = "TEXT")
    private String missao;
    
    @Column(name = "visao", columnDefinition = "TEXT")
    private String visao;
    
    @Column(name = "valores", columnDefinition = "TEXT")
    private String valores;
    
    @Column(name = "logo_url", length = 1000)
    private String logoUrl;
    
    @Column(name = "data_criacao", nullable = false, updatable = false)
    private LocalDateTime dataCriacao;
    
    @Column(name = "data_atualizacao")
    private LocalDateTime dataAtualizacao;
    
    @PrePersist
    protected void onCreate() {
        dataCriacao = LocalDateTime.now();
        dataAtualizacao = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        dataAtualizacao = LocalDateTime.now();
    }
}


package com.example.devmatch.job_posting_backend.dto;

import com.example.devmatch.job_posting_backend.entity.Habilidade;
import jakarta.validation.constraints.NotBlank;

/**
 * DTO para representar uma habilidade técnica do desenvolvedor
 */
public class HabilidadeDto {
    
    private Long id;
    
    @NotBlank(message = "Categoria é obrigatória")
    private String categoria; // linguagens, frameworks, bancos_dados, ferramentas, soft
    
    @NotBlank(message = "Habilidade é obrigatória")
    private String habilidade;
    
    // Construtores
    public HabilidadeDto() {}
    
    public HabilidadeDto(String categoria, String habilidade) {
        this.categoria = categoria;
        this.habilidade = habilidade;
    }
    
    // Método para converter DTO em Entidade
    public Habilidade toEntity() {
        Habilidade hab = new Habilidade();
        hab.setId(this.id);
        hab.setCategoria(this.categoria);
        hab.setHabilidade(this.habilidade);
        return hab;
    }
    
    // Método para converter Entidade em DTO
    public static HabilidadeDto fromEntity(Habilidade habilidade) {
        HabilidadeDto dto = new HabilidadeDto();
        dto.setId(habilidade.getId());
        dto.setCategoria(habilidade.getCategoria());
        dto.setHabilidade(habilidade.getHabilidade());
        return dto;
    }
    
    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }
    
    public String getHabilidade() { return habilidade; }
    public void setHabilidade(String habilidade) { this.habilidade = habilidade; }
}


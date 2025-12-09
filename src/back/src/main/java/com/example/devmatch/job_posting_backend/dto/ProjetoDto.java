package com.example.devmatch.job_posting_backend.dto;

import com.example.devmatch.job_posting_backend.entity.Projeto;

/**
 * DTO para Projeto
 */
public class ProjetoDto {
    
    private Long id;
    private String nome;
    private String descricao;
    private String tecnologias;
    private String link;
    
    // Construtores
    public ProjetoDto() {}
    
    // Método para converter DTO em Entidade
    public Projeto toEntity() {
        Projeto projeto = new Projeto();
        projeto.setId(this.id);
        projeto.setNome(this.nome);
        projeto.setDescricao(this.descricao);
        projeto.setTecnologias(this.tecnologias);
        projeto.setLink(this.link);
        return projeto;
    }
    
    // Método para converter Entidade em DTO
    public static ProjetoDto fromEntity(Projeto projeto) {
        ProjetoDto dto = new ProjetoDto();
        dto.setId(projeto.getId());
        dto.setNome(projeto.getNome());
        dto.setDescricao(projeto.getDescricao());
        dto.setTecnologias(projeto.getTecnologias());
        dto.setLink(projeto.getLink());
        return dto;
    }
    
    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    
    public String getTecnologias() { return tecnologias; }
    public void setTecnologias(String tecnologias) { this.tecnologias = tecnologias; }
    
    public String getLink() { return link; }
    public void setLink(String link) { this.link = link; }
}


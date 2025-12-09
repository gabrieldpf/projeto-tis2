package com.example.devmatch.job_posting_backend.dto;

import com.example.devmatch.job_posting_backend.entity.Formacao;

/**
 * DTO para Formação Acadêmica
 */
public class FormacaoDto {
    
    private Long id;
    private String grau;
    private String instituicao;
    private String ano;
    
    // Construtores
    public FormacaoDto() {}
    
    // Método para converter DTO em Entidade
    public Formacao toEntity() {
        Formacao formacao = new Formacao();
        formacao.setId(this.id);
        formacao.setGrau(this.grau);
        formacao.setInstituicao(this.instituicao);
        formacao.setAno(this.ano);
        return formacao;
    }
    
    // Método para converter Entidade em DTO
    public static FormacaoDto fromEntity(Formacao formacao) {
        FormacaoDto dto = new FormacaoDto();
        dto.setId(formacao.getId());
        dto.setGrau(formacao.getGrau());
        dto.setInstituicao(formacao.getInstituicao());
        dto.setAno(formacao.getAno());
        return dto;
    }
    
    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getGrau() { return grau; }
    public void setGrau(String grau) { this.grau = grau; }
    
    public String getInstituicao() { return instituicao; }
    public void setInstituicao(String instituicao) { this.instituicao = instituicao; }
    
    public String getAno() { return ano; }
    public void setAno(String ano) { this.ano = ano; }
}


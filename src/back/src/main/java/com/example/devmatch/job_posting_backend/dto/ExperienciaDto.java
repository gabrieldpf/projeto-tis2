package com.example.devmatch.job_posting_backend.dto;

import com.example.devmatch.job_posting_backend.entity.Experiencia;
import java.sql.Date;

/**
 * DTO para Experiência Profissional
 */
public class ExperienciaDto {
    
    private Long id;
    private String cargo;
    private String empresa;
    private Date dataInicio;
    private Date dataFim;
    private String descricao;
    private Boolean trabalhandoAtualmente;
    
    // Construtores
    public ExperienciaDto() {}
    
    // Método para converter DTO em Entidade
    public Experiencia toEntity() {
        Experiencia experiencia = new Experiencia();
        experiencia.setId(this.id);
        experiencia.setCargo(this.cargo);
        experiencia.setEmpresa(this.empresa);
        experiencia.setDataInicio(this.dataInicio);
        experiencia.setDataFim(this.dataFim);
        experiencia.setDescricao(this.descricao);
        experiencia.setTrabalhandoAtualmente(this.trabalhandoAtualmente != null ? this.trabalhandoAtualmente : false);
        return experiencia;
    }
    
    // Método para converter Entidade em DTO
    public static ExperienciaDto fromEntity(Experiencia experiencia) {
        ExperienciaDto dto = new ExperienciaDto();
        dto.setId(experiencia.getId());
        dto.setCargo(experiencia.getCargo());
        dto.setEmpresa(experiencia.getEmpresa());
        dto.setDataInicio(experiencia.getDataInicio());
        dto.setDataFim(experiencia.getDataFim());
        dto.setDescricao(experiencia.getDescricao());
        dto.setTrabalhandoAtualmente(experiencia.getTrabalhandoAtualmente());
        return dto;
    }
    
    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
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


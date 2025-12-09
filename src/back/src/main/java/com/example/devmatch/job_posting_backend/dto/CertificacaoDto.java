package com.example.devmatch.job_posting_backend.dto;

import com.example.devmatch.job_posting_backend.entity.Certificacao;
import java.sql.Date;

/**
 * DTO para Certificação
 */
public class CertificacaoDto {
    
    private Long id;
    private String nome;
    private String emissor;
    private Date dataValidade;
    
    // Construtores
    public CertificacaoDto() {}
    
    // Método para converter DTO em Entidade
    public Certificacao toEntity() {
        Certificacao certificacao = new Certificacao();
        certificacao.setId(this.id);
        certificacao.setNome(this.nome);
        certificacao.setEmissor(this.emissor);
        certificacao.setDataValidade(this.dataValidade);
        return certificacao;
    }
    
    // Método para converter Entidade em DTO
    public static CertificacaoDto fromEntity(Certificacao certificacao) {
        CertificacaoDto dto = new CertificacaoDto();
        dto.setId(certificacao.getId());
        dto.setNome(certificacao.getNome());
        dto.setEmissor(certificacao.getEmissor());
        dto.setDataValidade(certificacao.getDataValidade());
        return dto;
    }
    
    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    
    public String getEmissor() { return emissor; }
    public void setEmissor(String emissor) { this.emissor = emissor; }
    
    public Date getDataValidade() { return dataValidade; }
    public void setDataValidade(Date dataValidade) { this.dataValidade = dataValidade; }
}


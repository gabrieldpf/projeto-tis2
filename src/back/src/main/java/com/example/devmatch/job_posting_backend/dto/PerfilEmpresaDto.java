package com.example.devmatch.job_posting_backend.dto;

import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Data
public class PerfilEmpresaDto {
    private Long usuarioId;
    private String nomeEmpresa;
    private String descricao;
    private String setor;
    private String tamanho;
    private String localizacao;
    private String anoFundacao;
    private String website;
    private String linkedin;
    private String instagram;
    private String facebook;
    private String cultura;
    private List<String> beneficios = new ArrayList<>();
    private String missao;
    private String visao;
    private String valores;
    private String logoUrl;
}


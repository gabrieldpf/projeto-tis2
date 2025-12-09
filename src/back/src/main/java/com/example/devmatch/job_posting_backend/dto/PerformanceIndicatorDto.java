package com.example.devmatch.job_posting_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PerformanceIndicatorDto {
    private String id;
    private String indicador;
    private String objetivo;
    private String descricao;
    private List<String> fonteDados;
    private String formula;
    private double valor;
    private String unidade;
    private Double meta;
    private String metaDescricao;
    private Map<String, Object> detalhes;
    private String observacoes;
}



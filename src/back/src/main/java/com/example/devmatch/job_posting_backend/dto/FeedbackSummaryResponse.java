package com.example.devmatch.job_posting_backend.dto;

public record FeedbackSummaryResponse(
        long projetosFinalizados,
        long feedbacksRecebidos,
        long avaliacoesRealizadas,
        long contestacoesAbertas
) {}


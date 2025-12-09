package com.example.devmatch.job_posting_backend.dto;

import java.time.LocalDateTime;

public record FeedbackItemResponse(
        Long id,
        Long projectId,
        Long raterId,
        Long ratedId,
        String ratedRole,
        double estrelas,
        String comentario,
        LocalDateTime dataAvaliacao,
        Integer qualidadeTecnica,
        Integer cumprimentoPrazos,
        Integer comunicacao,
        Integer colaboracao
) {}


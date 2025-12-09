package com.example.devmatch.job_posting_backend.dto;

import com.example.devmatch.job_posting_backend.entity.UserRoleInProject;

public record FeedbackCreateRequest(
        Long projectId,
        Long ratedId,
        UserRoleInProject ratedRole,
        Integer qualidadeTecnica,
        Integer cumprimentoPrazos,
        Integer comunicacao,
        Integer colaboracao,
        String comentario
) {}


package com.example.devmatch.job_posting_backend.dto;


import com.example.devmatch.job_posting_backend.entity.DisputeStatus;
import com.example.devmatch.job_posting_backend.entity.MediationDecision;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record DisputeItemResponse(
        Long id,
        Long feedbackId,
        String justificativaDisputa,
        DisputeStatus status,
        MediationDecision decisao, // Pode ser null para disputas abertas
        LocalDateTime createdAt
) {}

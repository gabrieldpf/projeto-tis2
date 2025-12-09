package com.example.devmatch.job_posting_backend.dto;

import com.example.devmatch.job_posting_backend.entity.ContractStatus;
import com.example.devmatch.job_posting_backend.entity.ContractType;

import java.time.LocalDateTime;

public record ContractResponse(
        Long id,
        Long vagaId,
        Long companyId,
        Long developerId,
        ContractType contractType,
        ContractStatus status,
        LocalDateTime startedAt,
        LocalDateTime endedAt
) {}

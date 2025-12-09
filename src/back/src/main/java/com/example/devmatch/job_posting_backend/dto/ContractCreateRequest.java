package com.example.devmatch.job_posting_backend.dto;

import com.example.devmatch.job_posting_backend.entity.ContractType;
import jakarta.validation.constraints.NotNull;

public record ContractCreateRequest(
        @NotNull Long vagaId,
        @NotNull Long developerId,
        @NotNull ContractType contractType
) {}

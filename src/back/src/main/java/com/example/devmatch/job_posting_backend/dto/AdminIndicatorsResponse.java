package com.example.devmatch.job_posting_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminIndicatorsResponse {
    private int periodDays;
    private LocalDateTime generatedAt;
    private List<PerformanceIndicatorDto> indicators;
}



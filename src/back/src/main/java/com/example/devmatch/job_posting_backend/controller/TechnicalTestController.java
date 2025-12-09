package com.example.devmatch.job_posting_backend.controller;

import com.example.devmatch.job_posting_backend.dto.CreateTechnicalTestRequestDto;
import com.example.devmatch.job_posting_backend.dto.TechnicalTestResponseDto;
import com.example.devmatch.job_posting_backend.service.TechnicalTestService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tests")
public class TechnicalTestController {
    private final TechnicalTestService service;

    public TechnicalTestController(TechnicalTestService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<TechnicalTestResponseDto> createOrUpdate(@Valid @RequestBody CreateTechnicalTestRequestDto body) {
        TechnicalTestResponseDto dto = service.createOrUpdateTest(body);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/{vagaId}")
    public ResponseEntity<TechnicalTestResponseDto> getByVaga(@PathVariable Long vagaId) {
        TechnicalTestResponseDto dto = service.getTestByVagaId(vagaId);
        if (dto == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(dto);
    }
}



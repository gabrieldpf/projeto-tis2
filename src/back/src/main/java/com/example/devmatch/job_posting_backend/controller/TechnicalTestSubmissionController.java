package com.example.devmatch.job_posting_backend.controller;

import com.example.devmatch.job_posting_backend.dto.SubmitTechnicalTestRequestDto;
import com.example.devmatch.job_posting_backend.dto.ApproveSubmissionRequest;
import com.example.devmatch.job_posting_backend.dto.TechnicalTestSubmissionSummaryDto;
import com.example.devmatch.job_posting_backend.dto.TechnicalTestSubmissionDetailDto;
import com.example.devmatch.job_posting_backend.service.TechnicalTestService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tests/submissions")
public class TechnicalTestSubmissionController {
    private final TechnicalTestService service;

    public TechnicalTestSubmissionController(TechnicalTestService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Long> submit(@Valid @RequestBody SubmitTechnicalTestRequestDto body) {
        Long id = service.submitTest(body);
        return ResponseEntity.ok(id);
    }

    @GetMapping("/by-user/{vagaId}/{usuarioId}")
    public ResponseEntity<List<TechnicalTestSubmissionSummaryDto>> list(@PathVariable Long vagaId, @PathVariable Long usuarioId) {
        List<TechnicalTestSubmissionSummaryDto> list = service.getSubmissions(vagaId, usuarioId);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/detail/{submissionId}")
    public ResponseEntity<TechnicalTestSubmissionDetailDto> detail(@PathVariable Long submissionId) {
        TechnicalTestSubmissionDetailDto dto = service.getSubmissionDetail(submissionId);
        if (dto == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/{submissionId}/approve")
    public ResponseEntity<Long> approve(@PathVariable Long submissionId,
                                        @RequestHeader("X-User-Id") Long companyId,
                                        @Valid @RequestBody ApproveSubmissionRequest body) {
        Long contractId = service.approveSubmissionAndCreateContract(submissionId, companyId, body.contractType());
        return ResponseEntity.ok(contractId);
    }
}



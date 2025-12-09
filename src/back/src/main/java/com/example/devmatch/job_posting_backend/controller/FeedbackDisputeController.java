package com.example.devmatch.job_posting_backend.controller;

import com.example.devmatch.job_posting_backend.dto.DisputeCreateRequest;
import com.example.devmatch.job_posting_backend.dto.DisputeDecisionRequest;
import com.example.devmatch.job_posting_backend.dto.DisputeItemResponse;
import com.example.devmatch.job_posting_backend.service.FeedbackDisputeService;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/feedback/disputes")
public class FeedbackDisputeController {

    private final FeedbackDisputeService disputeService;

    public FeedbackDisputeController(FeedbackDisputeService disputeService) {
        this.disputeService = disputeService;
    }

    @PostMapping
    public ResponseEntity<Long> open(
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody DisputeCreateRequest req
    ) {
        Long id = disputeService.openDispute(userId, req);
        return ResponseEntity.status(HttpStatus.CREATED).body(id);
    }

    @GetMapping("/mine")
    public List<DisputeItemResponse> mine(@RequestHeader("X-User-Id") Long userId) {
        return disputeService.getMyDisputes(userId);
    }

    // endpoint para administradores listarem todas as disputas abertas
    @GetMapping("/open")
    public ResponseEntity<List<DisputeItemResponse>> getAllOpenDisputes() {
        try {
            List<DisputeItemResponse> disputes = disputeService.getAllOpenDisputes();
            return ResponseEntity.ok(disputes);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Erro ao buscar disputas abertas: " + e.getMessage(),
                    e
            );
        }
    }

    // endpoint para equipe de mediação
    @PostMapping("/{id}/decision")
    public ResponseEntity<Void> decide(
            @PathVariable Long id,
            @RequestBody DisputeDecisionRequest req
    ) {
        disputeService.decide(id, req);
        return ResponseEntity.ok().build();
    }
}


package com.example.devmatch.job_posting_backend.controller;


import com.example.devmatch.job_posting_backend.dto.*;
import com.example.devmatch.job_posting_backend.service.FeedbackService;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @PostMapping
    public ResponseEntity<Long> create(
            @RequestHeader("X-User-Id") Long raterId,
            @RequestBody FeedbackCreateRequest req
    ) {
        Long id = feedbackService.createFeedback(raterId, req);
        return ResponseEntity.status(HttpStatus.CREATED).body(id);
    }

    @GetMapping("/summary")
    public FeedbackSummaryResponse summary(@RequestHeader("X-User-Id") Long userId) {
        return feedbackService.getSummary(userId);
    }

    @GetMapping("/received")
    public List<FeedbackItemResponse> received(@RequestHeader("X-User-Id") Long userId) {
        return feedbackService.getReceived(userId);
    }

    @GetMapping("/given")
    public List<FeedbackItemResponse> given(@RequestHeader("X-User-Id") Long userId) {
        return feedbackService.getGiven(userId);
    }

    /**
     * Endpoint para buscar um feedback específico pelo ID (para administradores)
     * @param id ID do feedback
     * @return Feedback encontrado ou 404 se não existir
     */
    @GetMapping("/{id}")
    public ResponseEntity<FeedbackItemResponse> getFeedbackById(@PathVariable Long id) {
        FeedbackItemResponse feedback = feedbackService.getFeedbackById(id);
        if (feedback == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(feedback);
    }
}


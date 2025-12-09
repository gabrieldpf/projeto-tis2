package com.example.devmatch.job_posting_backend.controller;

import com.example.devmatch.job_posting_backend.entity.Milestone;
import com.example.devmatch.job_posting_backend.service.MilestoneService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(
    originPatterns = "*",
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.PATCH, RequestMethod.DELETE, RequestMethod.OPTIONS},
    allowedHeaders = "*",
    allowCredentials = "true"
)
public class MilestoneController {
    private final MilestoneService milestoneService;

    public MilestoneController(MilestoneService milestoneService) {
        this.milestoneService = milestoneService;
    }

    static class CreateMilestoneRequest {
        public Long projetoId;
        public Long contractId;
        public String titulo;
        public String descricao;
        public String dueDate; // ISO string
        public BigDecimal valorMilestone;
        public String criteriosAceitacao;
    }

    @PostMapping("/milestones")
    public ResponseEntity<?> createMilestone(@RequestBody CreateMilestoneRequest req) {
        if (req.titulo == null || req.titulo.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Título é obrigatório");
        }
        if (req.valorMilestone == null || req.valorMilestone.compareTo(BigDecimal.ZERO) <= 0) {
            return ResponseEntity.badRequest().body("Valor do milestone deve ser maior que zero");
        }
        
        Milestone m = new Milestone();
        m.setTitulo(req.titulo);
        m.setDescricao(req.descricao);
        m.setValorMilestone(req.valorMilestone);
        m.setCriteriosAceitacao(req.criteriosAceitacao);
        if (req.dueDate != null) {
            m.setDueDate(LocalDateTime.parse(req.dueDate));
        }
        
        try {
            Milestone saved = milestoneService.createMilestone(req.projetoId, req.contractId, m);
            return ResponseEntity.ok(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/projects/{id}/milestones")
    public ResponseEntity<List<Milestone>> getByProject(@PathVariable Long id) {
        return ResponseEntity.ok(milestoneService.getMilestonesByProjeto(id));
    }

    @GetMapping("/contracts/{id}/milestones")
    public ResponseEntity<List<Milestone>> getByContract(@PathVariable Long id) {
        return ResponseEntity.ok(milestoneService.getMilestonesByContract(id));
    }

    @GetMapping("/milestones/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return milestoneService.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
}

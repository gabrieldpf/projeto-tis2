package com.example.devmatch.job_posting_backend.controller;

import com.example.devmatch.job_posting_backend.entity.Delivery;
import com.example.devmatch.job_posting_backend.service.DeliveryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(
    originPatterns = "*",
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.PATCH, RequestMethod.DELETE, RequestMethod.OPTIONS},
    allowedHeaders = "*",
    allowCredentials = "true"
)
public class DeliveryController {
    private final DeliveryService deliveryService;

    public DeliveryController(DeliveryService deliveryService) {
        this.deliveryService = deliveryService;
    }

    static class CreateDeliveryRequest {
        public Long perfilDevId;
        public String descricaoEntrega;
        public String arquivosEntrega; // JSON array de links/URLs
        public Double horasTrabalhadas;
        // Campo legado para compatibilidade
        public String conteudo;
    }

    @PostMapping("/milestones/{id}/delivery")
    public ResponseEntity<?> createDelivery(@PathVariable Long id, @RequestBody CreateDeliveryRequest req) {
        try {
            Delivery d = new Delivery();
            d.setDescricaoEntrega(req.descricaoEntrega != null ? req.descricaoEntrega : req.conteudo);
            d.setArquivosEntrega(req.arquivosEntrega);
            d.setHorasTrabalhadas(req.horasTrabalhadas);
            // Compatibilidade com campo legado
            if (req.conteudo != null && req.descricaoEntrega == null) {
                d.setConteudo(req.conteudo);
            }
            Delivery saved = deliveryService.createDelivery(id, req.perfilDevId, d);
            return ResponseEntity.ok(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/milestones/{id}/deliveries")
    public ResponseEntity<List<Delivery>> getDeliveriesByMilestone(@PathVariable Long id) {
        return ResponseEntity.ok(deliveryService.findByMilestoneId(id));
    }

    @GetMapping("/deliveries/{id}")
    public ResponseEntity<?> getDeliveryById(@PathVariable Long id) {
        return deliveryService.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/perfil-dev/{id}/deliveries")
    public ResponseEntity<List<Delivery>> getDeliveriesByPerfilDev(@PathVariable Long id) {
        return ResponseEntity.ok(deliveryService.findByPerfilDevId(id));
    }

    @PutMapping("/delivery/{id}")
    public ResponseEntity<?> updateDelivery(@PathVariable Long id, @RequestBody Delivery updated) {
        try {
            Delivery saved = deliveryService.updateDelivery(id, updated);
            return ResponseEntity.ok(saved);
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    static class ReviewRequest { 
        public Boolean approved; 
        public String comentarioRevisao;
    }

    @PostMapping("/deliveries/{id}/review")
    public ResponseEntity<?> reviewDelivery(@PathVariable Long id, @RequestBody ReviewRequest req) {
        try {
            Delivery saved = deliveryService.reviewDelivery(
                id, 
                Boolean.TRUE.equals(req.approved), 
                req.comentarioRevisao
            );
            return ResponseEntity.ok(saved);
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

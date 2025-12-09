package com.example.devmatch.job_posting_backend.controller;

import com.example.devmatch.job_posting_backend.dto.CandidaturaDto;
import com.example.devmatch.job_posting_backend.dto.CandidaturaResponseDto;
import com.example.devmatch.job_posting_backend.entity.Candidatura;
import com.example.devmatch.job_posting_backend.service.CandidaturaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Controller REST responsável pelos endpoints de candidaturas
 */
@RestController
@RequestMapping("/api/candidaturas")
@CrossOrigin(
    originPatterns = "*",
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.PATCH, RequestMethod.DELETE, RequestMethod.OPTIONS},
    allowedHeaders = "*",
    allowCredentials = "true"
)
public class CandidaturaController {
    
    @Autowired
    private CandidaturaService service;
    
    /**
     * Endpoint para criar uma nova candidatura
     * @param dto Dados da candidatura
     * @return Candidatura criada
     */
    @PostMapping
    public ResponseEntity<?> candidatar(@Valid @RequestBody CandidaturaDto dto) {
        try {
            Candidatura candidatura = new Candidatura();
            candidatura.setVagaId(dto.getVagaId());
            candidatura.setUsuarioId(dto.getUsuarioId());
            candidatura.setMensagem(dto.getMensagem());
            
            Candidatura saved = service.candidatar(candidatura);
            return ResponseEntity.ok(CandidaturaResponseDto.fromEntity(saved));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    /**
     * Endpoint para buscar candidaturas de um desenvolvedor
     * @param usuarioId ID do desenvolvedor
     * @return Lista de candidaturas
     */
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<CandidaturaResponseDto>> getCandidaturasByUsuario(@PathVariable Long usuarioId) {
        List<CandidaturaResponseDto> candidaturas = service.getCandidaturasByUsuario(usuarioId).stream()
            .map(CandidaturaResponseDto::fromEntity)
            .collect(Collectors.toList());
        return ResponseEntity.ok(candidaturas);
    }
    
    /**
     * Endpoint para buscar candidaturas de uma vaga
     * @param vagaId ID da vaga
     * @return Lista de candidaturas
     */
    @GetMapping("/vaga/{vagaId}")
    public ResponseEntity<List<CandidaturaResponseDto>> getCandidaturasByVaga(@PathVariable Long vagaId) {
        List<CandidaturaResponseDto> candidaturas = service.getCandidaturasByVaga(vagaId).stream()
            .map(CandidaturaResponseDto::fromEntity)
            .collect(Collectors.toList());
        return ResponseEntity.ok(candidaturas);
    }
    
    /**
     * Endpoint para verificar se já se candidatou
     * @param usuarioId ID do desenvolvedor
     * @param vagaId ID da vaga
     * @return true se já se candidatou
     */
    @GetMapping("/verificar/{usuarioId}/{vagaId}")
    public ResponseEntity<Boolean> verificarCandidatura(@PathVariable Long usuarioId, @PathVariable Long vagaId) {
        boolean jaCandidatou = service.jaCandidatou(usuarioId, vagaId);
        return ResponseEntity.ok(jaCandidatou);
    }
    
    /**
     * Endpoint para atualizar status de uma candidatura
     * @param id ID da candidatura
     * @param statusRequest Objeto contendo o novo status
     * @return Candidatura atualizada
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody StatusUpdateRequest statusRequest) {
        try {
            Candidatura updated = service.updateStatus(id, statusRequest.getStatus());
            return ResponseEntity.ok(CandidaturaResponseDto.fromEntity(updated));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    /**
     * Classe interna para receber requisição de atualização de status
     */
    static class StatusUpdateRequest {
        private String status;
        
        public String getStatus() {
            return status;
        }
        
        public void setStatus(String status) {
            this.status = status;
        }
    }
}


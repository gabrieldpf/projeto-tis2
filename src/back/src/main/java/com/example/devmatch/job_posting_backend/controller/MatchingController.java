package com.example.devmatch.job_posting_backend.controller;

import com.example.devmatch.job_posting_backend.dto.JobMatchDto;
import com.example.devmatch.job_posting_backend.service.MatchingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Collections;

/**
 * Controller para endpoints de matching/compatibilidade
 */
@RestController
@RequestMapping("/api/matching")
@CrossOrigin(
    origins = {"http://localhost:5173", "http://localhost:3000"},
    allowedHeaders = "*",
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.PATCH},
    allowCredentials = "true"
)
public class MatchingController {
    
    @Autowired
    private MatchingService matchingService;
    
    /**
     * Endpoint para buscar vagas compatíveis com um desenvolvedor
     * @param usuarioId ID do desenvolvedor
     * @return Lista de vagas com percentual de compatibilidade
     */
    @GetMapping("/vagas-compativeis/{usuarioId}")
    public ResponseEntity<List<JobMatchDto>> getVagasCompativeis(@PathVariable Long usuarioId) {
        try {
            List<JobMatchDto> matches = matchingService.getVagasCompativeis(usuarioId);
            return ResponseEntity.ok(matches);
        } catch (RuntimeException e) {
            // Se o perfil do desenvolvedor não for encontrado, retornamos lista vazia
            return ResponseEntity.ok(Collections.emptyList());
        }
    }

    
    /**
     * Endpoint para calcular compatibilidade de um candidato específico com uma vaga específica
     * @param desenvolvedorId ID do desenvolvedor/candidato
     * @param vagaId ID da vaga
     * @return Percentual de compatibilidade
     */
    @GetMapping("/compatibilidade/{desenvolvedorId}/{vagaId}")
    public ResponseEntity<Double> getCompatibilidade(
            @PathVariable Long desenvolvedorId, 
            @PathVariable Long vagaId) {
        try {
            double compatibilidade = matchingService.calcularCompatibilidadeCandidato(desenvolvedorId, vagaId);
            return ResponseEntity.ok(compatibilidade);
        } catch (RuntimeException e) {
            // Se perfil ou vaga não forem encontrados, retornar 0.0 em vez de 404
            return ResponseEntity.ok(0.0);
        }
    }
}


package com.example.devmatch.job_posting_backend.controller;

import com.example.devmatch.job_posting_backend.dto.PerfilDevDto;
import com.example.devmatch.job_posting_backend.service.PerfilDevService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Controller REST para endpoints de perfis de desenvolvedores
 */
@RestController
@RequestMapping("/api/perfis-dev")
@CrossOrigin(origins = {
    "http://localhost:5173", 
    "http://localhost:3000", 
    "http://localhost:49393",
    "https://devmatch-frontend.onrender.com"
}, allowCredentials = "true")
public class PerfilDevController {
    
    @Autowired
    private PerfilDevService perfilDevService;
    
    /**
     * Endpoint para criar um novo perfil de desenvolvedor
     * POST /api/perfis-dev
     * @param perfilDto Dados do perfil a ser criado
     * @return ResponseEntity com dados do perfil criado ou erro
     */
    @PostMapping
    public ResponseEntity<?> criarPerfil(@Valid @RequestBody PerfilDevDto perfilDto) {
        try {
            PerfilDevDto perfilCriado = perfilDevService.criarPerfil(perfilDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(perfilCriado);
        } catch (RuntimeException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
    
    /**
     * Endpoint para atualizar um perfil de desenvolvedor existente
     * PUT /api/perfis-dev/{usuarioId}
     * @param usuarioId ID do usuário dono do perfil
     * @param perfilDto Dados atualizados do perfil
     * @return ResponseEntity com dados do perfil atualizado ou erro
     */
    @PutMapping("/{usuarioId}")
    public ResponseEntity<?> atualizarPerfil(
            @PathVariable Long usuarioId,
            @RequestBody PerfilDevDto perfilDto) {
        try {
            PerfilDevDto perfilAtualizado = perfilDevService.atualizarPerfil(usuarioId, perfilDto);
            return ResponseEntity.ok(perfilAtualizado);
        } catch (RuntimeException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
    
    /**
     * Endpoint para buscar perfil de desenvolvedor pelo ID do usuário
     * GET /api/perfis-dev/{usuarioId}
     * @param usuarioId ID do usuário
     * @return ResponseEntity com dados do perfil ou erro
     */
    @GetMapping("/{usuarioId}")
    public ResponseEntity<?> buscarPerfil(@PathVariable Long usuarioId) {
        try {
            PerfilDevDto perfil = perfilDevService.buscarPorUsuarioId(usuarioId);
            return ResponseEntity.ok(perfil);
        } catch (RuntimeException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }
    
    /**
     * Endpoint de health check
     * GET /api/perfis-dev/health
     * @return Status do serviço
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "OK");
        response.put("message", "Profile service is running");
        return ResponseEntity.ok(response);
    }
}


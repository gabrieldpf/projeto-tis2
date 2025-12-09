package com.example.devmatch.job_posting_backend.controller;

import com.example.devmatch.job_posting_backend.dto.AuthResponseDto;
import com.example.devmatch.job_posting_backend.dto.LoginRequestDto;
import com.example.devmatch.job_posting_backend.dto.RegisterRequestDto;
import com.example.devmatch.job_posting_backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Controller REST para endpoints de autenticação
 * Gerencia login, registro e operações relacionadas a usuários
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:49393"}, 
             allowCredentials = "true")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    /**
     * Endpoint para login de usuários
     * POST /api/auth/login
     * @param loginRequest Dados de login (email, senha, tipo)
     * @return ResponseEntity com dados do usuário autenticado ou erro
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequestDto loginRequest) {
        try {
            AuthResponseDto response = authService.login(loginRequest);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
    }
    
    /**
     * Endpoint para registro de novos usuários
     * POST /api/auth/register
     * @param registerRequest Dados de registro (nome, email, senha, tipo)
     * @return ResponseEntity com dados do novo usuário ou erro
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequestDto registerRequest) {
        try {
            AuthResponseDto response = authService.register(registerRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
    
    /**
     * Endpoint para buscar dados do usuário pelo ID
     * GET /api/auth/user/{id}
     * @param id ID do usuário
     * @return ResponseEntity com dados do usuário ou erro
     */
    @GetMapping("/user/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        try {
            AuthResponseDto response = authService.getUserById(id);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }
    
    /**
     * Endpoint para verificar se o servidor está funcionando
     * GET /api/auth/health
     * @return ResponseEntity com status do servidor
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "OK");
        response.put("message", "Auth service is running");
        return ResponseEntity.ok(response);
    }
    
    /**
     * Handler para erros de validação
     * Captura erros de @Valid e retorna mensagens claras
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errorResponse = new HashMap<>();
        
        // Coleta todas as mensagens de erro de validação
        String errorMessage = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining("; "));
        
        errorResponse.put("error", errorMessage);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }
}


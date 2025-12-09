package com.example.devmatch.job_posting_backend.controller;

import com.example.devmatch.job_posting_backend.dto.AdminIndicatorsResponse;
import com.example.devmatch.job_posting_backend.entity.Usuario;
import com.example.devmatch.job_posting_backend.repository.UsuarioRepository;
import com.example.devmatch.job_posting_backend.service.AdminIndicatorsService;
import com.example.devmatch.job_posting_backend.service.CompanyIndicatorTargetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(
        originPatterns = "*",
        methods = {
                RequestMethod.GET,
                RequestMethod.POST,
                RequestMethod.PUT,
                RequestMethod.PATCH,
                RequestMethod.DELETE,
                RequestMethod.OPTIONS
        },
        allowedHeaders = "*",
        allowCredentials = "true"
)
public class AdminDashboardController {

    private final AdminIndicatorsService adminIndicatorsService;
    private final CompanyIndicatorTargetService targetService;
    private final UsuarioRepository usuarioRepository;

    public AdminDashboardController(AdminIndicatorsService adminIndicatorsService,
                                     CompanyIndicatorTargetService targetService,
                                     UsuarioRepository usuarioRepository) {
        this.adminIndicatorsService = adminIndicatorsService;
        this.targetService = targetService;
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping("/indicators")
    public AdminIndicatorsResponse getIndicators(
            @RequestHeader(value = "X-User-Id", required = false) String userIdHeader,
            @RequestParam(name = "periodDays", defaultValue = "30") int periodDays) {
        // Converter String para Long se necessário
        Long userId;
        try {
            if (userIdHeader != null) {
                userId = Long.parseLong(userIdHeader);
            } else {
                throw new IllegalArgumentException("X-User-Id header é obrigatório");
            }
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("X-User-Id deve ser um número válido");
        }
        
        // Buscar o tipo do usuário
        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));
        
        String tipoUsuario = usuario.getTipo();
        
        // Log para debug - mostrar o valor exato do tipo
        System.out.println("========================================");
        System.out.println("DEBUG AdminDashboardController:");
        System.out.println("  userId=" + userId);
        System.out.println("  tipoUsuario='" + tipoUsuario + "'");
        System.out.println("  tipoUsuario.length()=" + (tipoUsuario != null ? tipoUsuario.length() : 0));
        if (tipoUsuario != null) {
            System.out.println("  tipoUsuario.trim()='" + tipoUsuario.trim() + "'");
            System.out.println("  tipoUsuario.toLowerCase()='" + tipoUsuario.toLowerCase() + "'");
        }
        System.out.println("  Comparando com 'admin' (equalsIgnoreCase): " + "admin".equalsIgnoreCase(tipoUsuario));
        System.out.println("  Comparando com 'admin' (equals): " + "admin".equals(tipoUsuario));
        System.out.println("========================================");
        
        // Verificação EXPLÍCITA para admin
        boolean isAdmin = false;
        if (tipoUsuario != null) {
            String tipoTrimmed = tipoUsuario.trim();
            String tipoLower = tipoTrimmed.toLowerCase();
            // Verificar múltiplas formas de identificar admin
            isAdmin = "admin".equals(tipoTrimmed) 
                   || "admin".equalsIgnoreCase(tipoTrimmed)
                   || tipoLower.equals("admin")
                   || tipoLower.contains("admin");
            
            System.out.println("DEBUG: isAdmin=" + isAdmin);
        }
        
        // Se for admin, buscar dados de todas as empresas (sem filtro)
        // Se for empresa, buscar apenas dados da própria empresa
        if (isAdmin) {
            System.out.println("DEBUG: ✓ É ADMIN - Chamando getIndicatorsForAdmin() - dados de TODAS as empresas");
            return adminIndicatorsService.getIndicatorsForAdmin(userId, periodDays);
        } else {
            System.out.println("DEBUG: ✗ NÃO É ADMIN - Chamando getIndicators() - dados apenas da empresa " + userId);
            return adminIndicatorsService.getIndicators(userId, periodDays);
        }
    }

    @PostMapping("/indicators/targets")
    public ResponseEntity<Map<String, Object>> saveTarget(
            @RequestHeader(value = "X-User-Id", required = false) String userIdHeader,
            @RequestBody Map<String, Object> request) {
        Long userId = parseUserId(userIdHeader);
        
        // Verificar tipo de usuário
        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));
        
        String tipoUsuario = usuario.getTipo();
        boolean isAdmin = tipoUsuario != null && (
            "admin".equalsIgnoreCase(tipoUsuario.trim()) || 
            tipoUsuario.trim().toLowerCase().contains("admin")
        );
        boolean isEmpresa = tipoUsuario != null && "empresa".equalsIgnoreCase(tipoUsuario.trim());
        
        // Admin e empresas podem definir metas
        // Para admin, se não especificar companyId, usa o userId (mas isso não faz sentido)
        // Vamos permitir que admin defina metas, mas usar o userId como companyId
        // (isso pode ser ajustado no futuro se necessário ter um sistema de metas globais)
        if (!isAdmin && !isEmpresa) {
            throw new IllegalArgumentException("Apenas empresas e administradores podem definir metas");
        }
        
        String indicatorId = (String) request.get("indicatorId");
        Double targetValue = ((Number) request.get("targetValue")).doubleValue();
        
        // Se for admin e tiver companyId no request, usar esse. Caso contrário, usar userId
        Long companyId = userId;
        if (isAdmin && request.containsKey("companyId") && request.get("companyId") != null) {
            companyId = ((Number) request.get("companyId")).longValue();
        }
        
        targetService.saveOrUpdateTarget(companyId, indicatorId, targetValue);
        
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Meta atualizada com sucesso"
        ));
    }

    @GetMapping("/indicators/targets")
    public ResponseEntity<Map<String, Double>> getTargets(
            @RequestHeader(value = "X-User-Id", required = false) String userIdHeader,
            @RequestParam(value = "companyId", required = false) Long companyIdParam) {
        Long userId = parseUserId(userIdHeader);
        
        // Verificar tipo de usuário
        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));
        
        String tipoUsuario = usuario.getTipo();
        boolean isAdmin = tipoUsuario != null && (
            "admin".equalsIgnoreCase(tipoUsuario.trim()) || 
            tipoUsuario.trim().toLowerCase().contains("admin")
        );
        boolean isEmpresa = tipoUsuario != null && "empresa".equalsIgnoreCase(tipoUsuario.trim());
        
        // Admin e empresas podem visualizar metas
        if (!isAdmin && !isEmpresa) {
            throw new IllegalArgumentException("Apenas empresas e administradores podem visualizar metas");
        }
        
        // Se for admin e tiver companyId no parâmetro, usar esse. Caso contrário, usar userId
        Long companyId = userId;
        if (isAdmin && companyIdParam != null) {
            companyId = companyIdParam;
        }
        
        Map<String, Double> targets = targetService.getTargetsByCompany(companyId);
        return ResponseEntity.ok(targets);
    }
    
    private Long parseUserId(String userIdHeader) {
        if (userIdHeader == null) {
            throw new IllegalArgumentException("X-User-Id header é obrigatório");
        }
        try {
            return Long.parseLong(userIdHeader);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("X-User-Id deve ser um número válido");
        }
    }
    
    private Long parseCompanyId(String companyIdHeader) {
        return parseUserId(companyIdHeader);
    }
}



package com.example.devmatch.job_posting_backend.controller;

import com.example.devmatch.job_posting_backend.dto.PerfilEmpresaDto;
import com.example.devmatch.job_posting_backend.entity.PerfilEmpresa;
import com.example.devmatch.job_posting_backend.service.PerfilEmpresaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/perfil-empresa")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "https://devmatch-frontend.onrender.com"
})
public class PerfilEmpresaController {

    @Autowired
    private PerfilEmpresaService perfilEmpresaService;

    @PostMapping("/{usuarioId}")
    public ResponseEntity<PerfilEmpresa> criarOuAtualizar(
            @PathVariable Long usuarioId,
            @RequestBody PerfilEmpresaDto dto) {
        try {
            dto.setUsuarioId(usuarioId);
            PerfilEmpresa perfil = perfilEmpresaService.criarOuAtualizar(usuarioId, dto);
            return ResponseEntity.ok(perfil);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{usuarioId}")
    public ResponseEntity<PerfilEmpresa> atualizar(
            @PathVariable Long usuarioId,
            @RequestBody PerfilEmpresaDto dto) {
        try {
            dto.setUsuarioId(usuarioId);
            PerfilEmpresa perfil = perfilEmpresaService.criarOuAtualizar(usuarioId, dto);
            return ResponseEntity.ok(perfil);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{usuarioId}")
    public ResponseEntity<PerfilEmpresa> buscarPorUsuarioId(@PathVariable Long usuarioId) {
        try {
            PerfilEmpresa perfil = perfilEmpresaService.buscarPorUsuarioId(usuarioId);
            return ResponseEntity.ok(perfil);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{usuarioId}/existe")
    public ResponseEntity<Boolean> verificarSeExiste(@PathVariable Long usuarioId) {
        boolean existe = perfilEmpresaService.existePerfil(usuarioId);
        return ResponseEntity.ok(existe);
    }

    @GetMapping("/{usuarioId}/completo")
    public ResponseEntity<Boolean> verificarSeCompleto(@PathVariable Long usuarioId) {
        boolean completo = perfilEmpresaService.isPerfilCompleto(usuarioId);
        return ResponseEntity.ok(completo);
    }
}


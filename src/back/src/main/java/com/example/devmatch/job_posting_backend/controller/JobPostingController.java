package com.example.devmatch.job_posting_backend.controller;

import com.example.devmatch.job_posting_backend.dto.JobPostingDto;
import com.example.devmatch.job_posting_backend.dto.JobPostingResponseDto;
import com.example.devmatch.job_posting_backend.entity.JobPosting;
import com.example.devmatch.job_posting_backend.entity.JobSkill;
import com.example.devmatch.job_posting_backend.service.JobPostingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Controller REST responsável pelos endpoints de vagas de emprego
 * Expõe as operações CRUD para o frontend através de APIs REST
 */
@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(
    originPatterns = "*",
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.PATCH, RequestMethod.DELETE, RequestMethod.OPTIONS},
    allowedHeaders = "*",
    allowCredentials = "true"
)
public class JobPostingController {

    @Autowired
    private JobPostingService service;

    /**
     * Endpoint para criar uma nova vaga de emprego
     * @param dto Dados da vaga enviados pelo frontend
     * @return Vaga criada com sucesso
     */
    @PostMapping
    public ResponseEntity<JobPostingResponseDto> createJob(@Valid @RequestBody JobPostingDto dto) {
        JobPosting job = new JobPosting(); // Cria nova instância da vaga
        job.setTitle(dto.getTitle());
        job.setDescription(dto.getDescription());
        job.setExperienceLevel(dto.getExperienceLevel());
        job.setRegime(dto.getRegime());
        job.setModeloRemuneracao(dto.getModeloRemuneracao());
        job.setValorReferencia(dto.getValorReferencia());
        job.setLocalModalidade(dto.getLocalModalidade());
        job.setPrazoEstimado(dto.getPrazoEstimado());
        job.setAnexo(dto.getAnexo());
        job.setUsuarioId(dto.getUsuarioId());

        // Adiciona as habilidades técnicas à vaga
        if (dto.getSkills() != null) {
            dto.getSkills().forEach(skill -> {
                JobSkill jobSkill = new JobSkill();
                jobSkill.setSkill(skill);
                jobSkill.setJob(job);
                job.getSkills().add(jobSkill);
            });
        }

        JobPosting saved = service.createJob(job);
        String nomeEmpresa = service.getNomeEmpresaByUsuarioId(saved.getUsuarioId());
        return ResponseEntity.ok(JobPostingResponseDto.fromEntity(saved, nomeEmpresa));
    }

    /**
     * Endpoint para buscar todas as vagas cadastradas
     * @return Lista de todas as vagas
     */
    @GetMapping
    public ResponseEntity<List<JobPostingResponseDto>> getAllJobs() {
        try {
            List<JobPostingResponseDto> jobs = service.getAllJobs().stream()
                .map(job -> {
                    String nomeEmpresa = service.getNomeEmpresaByUsuarioId(job.getUsuarioId());
                    return JobPostingResponseDto.fromEntity(job, nomeEmpresa);
                })
                .collect(Collectors.toList());
            return ResponseEntity.ok(jobs);
        } catch (RuntimeException e) {
            // Em caso de erro no backend, retornar lista vazia para frontend
            return ResponseEntity.ok(java.util.Collections.emptyList());
        }
    }

    /**
     * Endpoint para buscar vagas de um usuário específico (empresa)
     * @param usuarioId ID do usuário (empresa)
     * @return Lista de vagas do usuário
     */
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<JobPostingResponseDto>> getJobsByUsuario(@PathVariable Long usuarioId) {
        String nomeEmpresa = service.getNomeEmpresaByUsuarioId(usuarioId);
        List<JobPostingResponseDto> jobs = service.getJobsByUsuarioId(usuarioId).stream()
            .map(job -> JobPostingResponseDto.fromEntity(job, nomeEmpresa))
            .collect(Collectors.toList());
        return ResponseEntity.ok(jobs);
    }

    /**
     * Endpoint para buscar uma vaga específica pelo ID
     * @param id ID da vaga
     * @return Vaga encontrada ou 404 se não existir
     */
    @GetMapping("/{id}")
    public ResponseEntity<JobPostingResponseDto> getJobById(@PathVariable Long id) {
        return service.getJobById(id)
                .map(job -> {
                    String nomeEmpresa = service.getNomeEmpresaByUsuarioId(job.getUsuarioId());
                    return JobPostingResponseDto.fromEntity(job, nomeEmpresa);
                })
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Endpoint para atualizar uma vaga existente
     * @param id ID da vaga a ser atualizada
     * @param dto Dados atualizados da vaga
     * @return Vaga atualizada ou 404 se não existir
     */
    @PutMapping("/{id}")
    public ResponseEntity<JobPostingResponseDto> updateJob(@PathVariable Long id, @Valid @RequestBody JobPostingDto dto) {
        try {
            JobPosting updated = service.updateJob(id, dto);
            String nomeEmpresa = service.getNomeEmpresaByUsuarioId(updated.getUsuarioId());
            return ResponseEntity.ok(JobPostingResponseDto.fromEntity(updated, nomeEmpresa));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Endpoint para atualizar apenas o status de uma vaga
     * @param id ID da vaga
     * @param statusRequest Objeto contendo o novo status
     * @return Vaga com status atualizado ou 404 se não existir
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<JobPostingResponseDto> updateJobStatus(
            @PathVariable Long id, 
            @RequestBody StatusUpdateRequest statusRequest) {
        try {
            JobPosting updated = service.updateJobStatus(id, statusRequest.getStatus());
            String nomeEmpresa = service.getNomeEmpresaByUsuarioId(updated.getUsuarioId());
            return ResponseEntity.ok(JobPostingResponseDto.fromEntity(updated, nomeEmpresa));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Endpoint para remover uma vaga
     * @param id ID da vaga a ser removida
     * @return 204 (No Content) se removida com sucesso ou 404 se não existir
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id) {
        try {
            service.deleteJob(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Classe interna para receber requisição de atualização de status
     */
    static class StatusUpdateRequest {
        private String status;

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }
}
package com.example.devmatch.job_posting_backend.service;

import com.example.devmatch.job_posting_backend.dto.JobPostingDto;
import com.example.devmatch.job_posting_backend.entity.JobPosting;
import com.example.devmatch.job_posting_backend.entity.JobSkill;
import com.example.devmatch.job_posting_backend.repository.JobPostingRepository;
import com.example.devmatch.job_posting_backend.repository.PerfilEmpresaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

/**
 * Serviço responsável pela lógica de negócio das vagas de emprego
 * Contém todas as operações CRUD e regras de negócio
 */
@Service
public class JobPostingService {

    @Autowired
    private JobPostingRepository repository;
    
    @Autowired
    private PerfilEmpresaRepository perfilEmpresaRepository;

    /**
     * Cria uma nova vaga de emprego
     * @param job Vaga a ser criada
     * @return Vaga criada com data de publicação e status ativo definidos
     */
    public JobPosting createJob(JobPosting job) {
        job.setPostedDate(java.time.LocalDateTime.now());
        job.setStatus("ativa"); // Define status como ativa ao criar
        // Inicializar contadores se não foram definidos
        if (job.getApplications() == null) {
            job.setApplications(0);
        }
        if (job.getMatches() == null) {
            job.setMatches(0);
        }
        return repository.save(job);
    }

    /**
     * Busca todas as vagas cadastradas no sistema
     * @return Lista de todas as vagas
     */
    @Transactional(readOnly = true)
    public List<JobPosting> getAllJobs() {
        return repository.findAll();
    }

    /**
     * Busca todas as vagas de um usuário específico (empresa)
     * @param usuarioId ID do usuário (empresa)
     * @return Lista de vagas do usuário
     */
    @Transactional(readOnly = true)
    public List<JobPosting> getJobsByUsuarioId(Long usuarioId) {
        // Usa fetch join para evitar LazyInitializationException ao acessar skills fora do contexto
        return repository.findByUsuarioIdWithSkills(usuarioId);
    }

    /**
     * Busca uma vaga específica pelo ID
     * @param id ID da vaga
     * @return Vaga encontrada ou Optional vazio
     */
    public Optional<JobPosting> getJobById(Long id) {
        return repository.findById(id);
    }

    /**
     * Atualiza uma vaga existente
     * @param id ID da vaga a ser atualizada
     * @param dto Dados atualizados da vaga
     * @return Vaga atualizada
     * @throws RuntimeException se a vaga não for encontrada
     */
    @Transactional
    public JobPosting updateJob(Long id, JobPostingDto dto) {
        JobPosting job = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vaga não encontrada com ID: " + id));

        // Atualizar campos básicos da vaga
        job.setTitle(dto.getTitle());
        job.setDescription(dto.getDescription());
        job.setExperienceLevel(dto.getExperienceLevel());
        job.setRegime(dto.getRegime());
        job.setModeloRemuneracao(dto.getModeloRemuneracao());
        job.setValorReferencia(dto.getValorReferencia());
        job.setLocalModalidade(dto.getLocalModalidade());
        job.setPrazoEstimado(dto.getPrazoEstimado());
        job.setAnexo(dto.getAnexo());

        // Limpar habilidades existentes
        job.getSkills().clear();

        // Adicionar novas habilidades técnicas
        if (dto.getSkills() != null) {
            dto.getSkills().forEach(skillName -> {
                JobSkill jobSkill = new JobSkill();
                jobSkill.setSkill(skillName);
                jobSkill.setJob(job);
                job.getSkills().add(jobSkill);
            });
        }

        return repository.save(job);
    }

    /**
     * Atualiza apenas o status de uma vaga
     * @param id ID da vaga
     * @param status Novo status (ativa, pausada, fechada)
     * @return Vaga com status atualizado
     * @throws RuntimeException se a vaga não for encontrada
     */
    @Transactional
    public JobPosting updateJobStatus(Long id, String status) {
        JobPosting job = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vaga não encontrada com ID: " + id));
        
        job.setStatus(status);
        return repository.save(job);
    }

    /**
     * Remove uma vaga do sistema
     * @param id ID da vaga a ser removida
     * @throws RuntimeException se a vaga não for encontrada
     */
    @Transactional
    public void deleteJob(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Vaga não encontrada com ID: " + id);
        }
        repository.deleteById(id);
    }
    
    /**
     * Busca o nome da empresa a partir do ID do usuário
     * @param usuarioId ID do usuário (empresa)
     * @return Nome da empresa ou null se não encontrar
     */
    public String getNomeEmpresaByUsuarioId(Long usuarioId) {
        if (usuarioId == null) {
            return null;
        }
        return perfilEmpresaRepository.findByUsuarioId(usuarioId)
                .map(perfil -> perfil.getNomeEmpresa())
                .orElse(null);
    }
}
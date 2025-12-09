package com.example.devmatch.job_posting_backend.service;

import com.example.devmatch.job_posting_backend.entity.Candidatura;
import com.example.devmatch.job_posting_backend.entity.JobPosting;
import com.example.devmatch.job_posting_backend.repository.CandidaturaRepository;
import com.example.devmatch.job_posting_backend.repository.JobPostingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Serviço responsável pela lógica de negócio das candidaturas
 */
@Service
public class CandidaturaService {
    
    @Autowired
    private CandidaturaRepository candidaturaRepository;
    
    @Autowired
    private JobPostingRepository jobPostingRepository;
    
    /**
     * Cria uma nova candidatura
     * @param candidatura Candidatura a ser criada
     * @return Candidatura criada
     */
    @Transactional
    public Candidatura candidatar(Candidatura candidatura) {
        // Verifica se a vaga existe
        JobPosting vaga = jobPostingRepository.findById(candidatura.getVagaId())
                .orElseThrow(() -> new RuntimeException("Vaga não encontrada"));
        
        // Verifica se o usuário já se candidatou para esta vaga
        Optional<Candidatura> candidaturaExistente = candidaturaRepository
                .findByUsuarioIdAndVagaId(candidatura.getUsuarioId(), candidatura.getVagaId());
        
        if (candidaturaExistente.isPresent()) {
            throw new RuntimeException("Você já se candidatou para esta vaga");
        }
        
        // Define valores padrão
        candidatura.setDataCandidatura(LocalDateTime.now());
        candidatura.setStatus("pendente");
        
        // Salva a candidatura
        Candidatura savedCandidatura = candidaturaRepository.save(candidatura);
        
        // Atualiza o contador de candidaturas da vaga
        vaga.setApplications(vaga.getApplications() + 1);
        jobPostingRepository.save(vaga);
        
        return savedCandidatura;
    }
    
    /**
     * Busca todas as candidaturas de um desenvolvedor
     * @param usuarioId ID do desenvolvedor
     * @return Lista de candidaturas
     */
    public List<Candidatura> getCandidaturasByUsuario(Long usuarioId) {
        return candidaturaRepository.findByUsuarioId(usuarioId);
    }
    
    /**
     * Busca todas as candidaturas de uma vaga
     * @param vagaId ID da vaga
     * @return Lista de candidaturas
     */
    public List<Candidatura> getCandidaturasByVaga(Long vagaId) {
        return candidaturaRepository.findByVagaId(vagaId);
    }
    
    /**
     * Verifica se um usuário já se candidatou para uma vaga
     * @param usuarioId ID do desenvolvedor
     * @param vagaId ID da vaga
     * @return true se já se candidatou, false caso contrário
     */
    public boolean jaCandidatou(Long usuarioId, Long vagaId) {
        return candidaturaRepository.findByUsuarioIdAndVagaId(usuarioId, vagaId).isPresent();
    }
    
    /**
     * Atualiza o status de uma candidatura
     * @param id ID da candidatura
     * @param status Novo status
     * @return Candidatura atualizada
     */
    @Transactional
    public Candidatura updateStatus(Long id, String status) {
        Candidatura candidatura = candidaturaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Candidatura não encontrada"));
        
        candidatura.setStatus(status);
        return candidaturaRepository.save(candidatura);
    }
    
    /**
     * Busca uma candidatura específica
     * @param id ID da candidatura
     * @return Candidatura encontrada
     */
    public Optional<Candidatura> getCandidaturaById(Long id) {
        return candidaturaRepository.findById(id);
    }
}


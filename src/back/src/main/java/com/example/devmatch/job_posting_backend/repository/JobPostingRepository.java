package com.example.devmatch.job_posting_backend.repository;

import com.example.devmatch.job_posting_backend.entity.JobPosting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositório responsável pelas operações de banco de dados das vagas
 * Estende JpaRepository para operações CRUD básicas
 */
@Repository
public interface JobPostingRepository extends JpaRepository<JobPosting, Long> {
    
    /**
     * Busca vagas por status específico
     * @param status Status da vaga (ativa, pausada, fechada)
     * @return Lista de vagas com o status especificado
     */
    List<JobPosting> findByStatus(String status);
    
    /**
     * Busca vagas por ID do usuário
     * @param usuarioId ID do usuário (empresa)
     * @return Lista de vagas do usuário
     */
    List<JobPosting> findByUsuarioId(Long usuarioId);

    /**
     * Busca vagas por ID do usuário já carregando a coleção de skills para evitar
     * LazyInitializationException durante a serialização para DTO.
     */
    @Query("select distinct j from JobPosting j left join fetch j.skills where j.usuarioId = :usuarioId")
    List<JobPosting> findByUsuarioIdWithSkills(@Param("usuarioId") Long usuarioId);
}
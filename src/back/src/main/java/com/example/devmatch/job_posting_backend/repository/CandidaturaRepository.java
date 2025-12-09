package com.example.devmatch.job_posting_backend.repository;

import com.example.devmatch.job_posting_backend.entity.Candidatura;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repositório responsável pelas operações de banco de dados das candidaturas
 */
@Repository
public interface CandidaturaRepository extends JpaRepository<Candidatura, Long> {
    
    /**
     * Busca todas as candidaturas de um usuário (desenvolvedor)
     * @param usuarioId ID do desenvolvedor
     * @return Lista de candidaturas do desenvolvedor
     */
    List<Candidatura> findByUsuarioId(Long usuarioId);
    
    /**
     * Busca todas as candidaturas de uma vaga
     * @param vagaId ID da vaga
     * @return Lista de candidaturas da vaga
     */
    List<Candidatura> findByVagaId(Long vagaId);
    
    /**
     * Verifica se já existe uma candidatura de um usuário para uma vaga
     * @param usuarioId ID do desenvolvedor
     * @param vagaId ID da vaga
     * @return Candidatura se existir
     */
    Optional<Candidatura> findByUsuarioIdAndVagaId(Long usuarioId, Long vagaId);
    
    /**
     * Conta quantas candidaturas existem para uma vaga
     * @param vagaId ID da vaga
     * @return Número de candidaturas
     */
    long countByVagaId(Long vagaId);

    /**
     * Conta candidaturas por status de forma case-insensitive
     */
    long countByStatusIgnoreCase(String status);

    /**
     * Conta quantos desenvolvedores distintos geraram candidaturas no período informado
     * @param since Limite inferior da janela (inclusive)
     * @return Número de desenvolvedores com pelo menos uma candidatura na janela
     */
    @Query("SELECT COUNT(DISTINCT c.usuarioId) FROM Candidatura c WHERE c.dataCandidatura >= :since")
    long countDistinctUsuariosAtivosDesde(@Param("since") LocalDateTime since);

    /**
     * Conta candidaturas aceitas de vagas de uma empresa específica
     */
    @Query("SELECT COUNT(c) FROM Candidatura c WHERE UPPER(c.status) = UPPER(:status) AND c.vagaId IN (SELECT j.id FROM JobPosting j WHERE j.usuarioId = :companyId)")
    long countByStatusIgnoreCaseAndCompanyId(@Param("status") String status, @Param("companyId") Long companyId);

    /**
     * Conta desenvolvedores distintos que se candidataram a vagas de uma empresa no período
     */
    @Query("SELECT COUNT(DISTINCT c.usuarioId) FROM Candidatura c WHERE c.dataCandidatura >= :since AND c.vagaId IN (SELECT j.id FROM JobPosting j WHERE j.usuarioId = :companyId)")
    long countDistinctUsuariosAtivosDesdeByCompany(@Param("since") LocalDateTime since, @Param("companyId") Long companyId);

    /**
     * Conta todas as candidaturas de vagas de uma empresa
     */
    @Query("SELECT COUNT(c) FROM Candidatura c WHERE c.vagaId IN (SELECT j.id FROM JobPosting j WHERE j.usuarioId = :companyId)")
    long countByCompanyId(@Param("companyId") Long companyId);
}


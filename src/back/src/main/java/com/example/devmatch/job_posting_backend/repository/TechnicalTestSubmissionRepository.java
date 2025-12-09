package com.example.devmatch.job_posting_backend.repository;

import com.example.devmatch.job_posting_backend.entity.TechnicalTestSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TechnicalTestSubmissionRepository extends JpaRepository<TechnicalTestSubmission, Long> {
    List<TechnicalTestSubmission> findByVaga_IdAndUsuarioIdOrderBySubmittedAtDesc(Long vagaId, Long usuarioId);
}



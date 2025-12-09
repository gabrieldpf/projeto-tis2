package com.example.devmatch.job_posting_backend.repository;

import com.example.devmatch.job_posting_backend.entity.Milestone;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MilestoneRepository extends JpaRepository<Milestone, Long> {
    List<Milestone> findByProjetoId(Long projetoId);
    List<Milestone> findByContractId(Long contractId);
}

package com.example.devmatch.job_posting_backend.repository;

import com.example.devmatch.job_posting_backend.entity.TechnicalTest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TechnicalTestRepository extends JpaRepository<TechnicalTest, Long> {
    Optional<TechnicalTest> findByVaga_Id(Long vagaId);
    void deleteByVaga_Id(Long vagaId);
}



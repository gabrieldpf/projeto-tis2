package com.example.devmatch.job_posting_backend.repository;

import com.example.devmatch.job_posting_backend.entity.TechnicalTestAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TechnicalTestAnswerRepository extends JpaRepository<TechnicalTestAnswer, Long> {
}



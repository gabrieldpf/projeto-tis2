package com.example.devmatch.job_posting_backend.repository;

import com.example.devmatch.job_posting_backend.entity.TechnicalTestQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TechnicalTestQuestionRepository extends JpaRepository<TechnicalTestQuestion, Long> {
    List<TechnicalTestQuestion> findByTest_IdOrderByQuestionOrderAsc(Long testId);
    void deleteByTest_Id(Long testId);
}



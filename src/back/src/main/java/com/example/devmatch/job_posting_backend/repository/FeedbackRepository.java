package com.example.devmatch.job_posting_backend.repository;


import com.example.devmatch.job_posting_backend.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    List<Feedback> findByRatedId(Long ratedId);

    List<Feedback> findByRaterId(Long raterId);

    List<Feedback> findByProjectId(Long projectId);

    boolean existsByProjectIdAndRaterId(Long projectId, Long raterId);
}


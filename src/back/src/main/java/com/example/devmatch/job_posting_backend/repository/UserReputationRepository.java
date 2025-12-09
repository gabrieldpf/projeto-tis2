package com.example.devmatch.job_posting_backend.repository;


import com.example.devmatch.job_posting_backend.entity.UserReputation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserReputationRepository extends JpaRepository<UserReputation, Long> {
}


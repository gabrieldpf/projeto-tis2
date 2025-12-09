package com.example.devmatch.job_posting_backend.repository;

import com.example.devmatch.job_posting_backend.entity.CompanyIndicatorTarget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompanyIndicatorTargetRepository extends JpaRepository<CompanyIndicatorTarget, Long> {
    
    Optional<CompanyIndicatorTarget> findByCompanyIdAndIndicatorId(Long companyId, String indicatorId);
    
    List<CompanyIndicatorTarget> findByCompanyId(Long companyId);
    
    void deleteByCompanyIdAndIndicatorId(Long companyId, String indicatorId);
}


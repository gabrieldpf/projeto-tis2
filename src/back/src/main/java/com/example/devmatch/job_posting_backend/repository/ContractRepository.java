package com.example.devmatch.job_posting_backend.repository;

import com.example.devmatch.job_posting_backend.entity.Contract;
import com.example.devmatch.job_posting_backend.entity.ContractStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface ContractRepository extends JpaRepository<Contract, Long> {
    List<Contract> findByCompanyIdAndStatus(Long companyId, ContractStatus status);
    List<Contract> findByDeveloperIdAndStatus(Long developerId, ContractStatus status);
    long countByStatusIn(Collection<ContractStatus> statuses);
    List<Contract> findByStatusIn(Collection<ContractStatus> statuses);
    long countByCompanyIdAndStatusIn(Long companyId, Collection<ContractStatus> statuses);
    List<Contract> findByCompanyIdAndStatusIn(Long companyId, Collection<ContractStatus> statuses);
}

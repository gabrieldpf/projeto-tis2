package com.example.devmatch.job_posting_backend.service;

import com.example.devmatch.job_posting_backend.dto.ContractResponse;
import com.example.devmatch.job_posting_backend.entity.*;
import com.example.devmatch.job_posting_backend.repository.ContractRepository;
import com.example.devmatch.job_posting_backend.repository.JobPostingRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ContractService {

    private final ContractRepository contractRepository;
    private final JobPostingRepository jobPostingRepository;

    public ContractService(ContractRepository contractRepository, JobPostingRepository jobPostingRepository) {
        this.contractRepository = contractRepository;
        this.jobPostingRepository = jobPostingRepository;
    }

    @Transactional
    public ContractResponse createContract(Long vagaId, Long companyId, Long developerId, ContractType type) {
        JobPosting vaga = jobPostingRepository.findById(vagaId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Vaga não encontrada"));

        Contract c = new Contract();
        c.setVaga(vaga);
        c.setCompanyId(companyId);
        c.setDeveloperId(developerId);
        c.setContractType(type);
        c.setStatus(ContractStatus.ACTIVE);
        c = contractRepository.save(c);
        return toResponse(c);
    }

    @Transactional(readOnly = true)
    public List<ContractResponse> listActiveForCompany(Long companyId) {
        return contractRepository.findByCompanyIdAndStatus(companyId, ContractStatus.ACTIVE)
                .stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<ContractResponse> listActiveForDeveloper(Long developerId) {
        return contractRepository.findByDeveloperIdAndStatus(developerId, ContractStatus.ACTIVE)
                .stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<ContractResponse> listFinishedForUser(Long userId) {
        // retorna qualquer contrato FINISHED onde o usuário é company ou developer
        return contractRepository.findAll().stream()
                .filter(c -> c.getStatus() == ContractStatus.FINISHED && (c.getCompanyId().equals(userId) || c.getDeveloperId().equals(userId)))
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public ContractResponse finishContract(Long contractId, Long actingCompanyId) {
        Contract c = contractRepository.findById(contractId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Contrato não encontrado"));
        if (!c.getCompanyId().equals(actingCompanyId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Somente a empresa pode finalizar o contrato");
        }
        if (c.getStatus() != ContractStatus.ACTIVE) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Contrato não está ativo");
        }
        c.setStatus(ContractStatus.FINISHED);
        c.setEndedAt(LocalDateTime.now());
        c = contractRepository.save(c);
        return toResponse(c);
    }

    private ContractResponse toResponse(Contract c) {
        return new ContractResponse(
                c.getId(),
                c.getVaga().getId(),
                c.getCompanyId(),
                c.getDeveloperId(),
                c.getContractType(),
                c.getStatus(),
                c.getStartedAt(),
                c.getEndedAt()
        );
    }
}

package com.example.devmatch.job_posting_backend.service;

import com.example.devmatch.job_posting_backend.entity.Contract;
import com.example.devmatch.job_posting_backend.entity.Milestone;
import com.example.devmatch.job_posting_backend.entity.Projeto;
import com.example.devmatch.job_posting_backend.repository.ContractRepository;
import com.example.devmatch.job_posting_backend.repository.MilestoneRepository;
import com.example.devmatch.job_posting_backend.repository.ProjetoRepository;
import com.example.devmatch.job_posting_backend.repository.JobPostingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;

@Service
public class MilestoneService {
    private final MilestoneRepository milestoneRepository;
    private final ProjetoRepository projetoRepository;
    private final ContractRepository contractRepository;

    public MilestoneService(MilestoneRepository milestoneRepository, 
                           ProjetoRepository projetoRepository,
                           ContractRepository contractRepository) {
        this.milestoneRepository = milestoneRepository;
        this.projetoRepository = projetoRepository;
        this.contractRepository = contractRepository;
    }

    @Transactional
    public Milestone createMilestone(Long projetoId, Long contractId, Milestone milestone) {
        if (projetoId != null) {
            Optional<Projeto> proj = projetoRepository.findById(projetoId);
            if (proj.isEmpty()) throw new IllegalArgumentException("Projeto não encontrado");
            milestone.setProjeto(proj.get());
        }
        
        if (contractId != null) {
            Optional<Contract> contract = contractRepository.findById(contractId);
            if (contract.isEmpty()) throw new IllegalArgumentException("Contrato não encontrado");
            milestone.setContract(contract.get());
        }
        
        if (milestone.getProjeto() == null && milestone.getContract() == null) {
            throw new IllegalArgumentException("Milestone deve estar associado a um projeto ou contrato");
        }
        
        return milestoneRepository.save(milestone);
    }

    public List<Milestone> getMilestonesByProjeto(Long projetoId) {
        return milestoneRepository.findByProjetoId(projetoId);
    }

    public List<Milestone> getMilestonesByContract(Long contractId) {
        return milestoneRepository.findByContractId(contractId);
    }

    public Optional<Milestone> findById(Long id) { 
        return milestoneRepository.findById(id); 
    }
}

package com.example.devmatch.job_posting_backend.service;

import com.example.devmatch.job_posting_backend.entity.CompanyIndicatorTarget;
import com.example.devmatch.job_posting_backend.repository.CompanyIndicatorTargetRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class CompanyIndicatorTargetService {

    private final CompanyIndicatorTargetRepository targetRepository;

    public CompanyIndicatorTargetService(CompanyIndicatorTargetRepository targetRepository) {
        this.targetRepository = targetRepository;
    }

    @Transactional
    public void saveOrUpdateTarget(Long companyId, String indicatorId, Double targetValue) {
        Optional<CompanyIndicatorTarget> existing = targetRepository.findByCompanyIdAndIndicatorId(companyId, indicatorId);
        
        if (existing.isPresent()) {
            CompanyIndicatorTarget target = existing.get();
            target.setTargetValue(targetValue);
            targetRepository.save(target);
        } else {
            CompanyIndicatorTarget target = new CompanyIndicatorTarget();
            target.setCompanyId(companyId);
            target.setIndicatorId(indicatorId);
            target.setTargetValue(targetValue);
            targetRepository.save(target);
        }
    }

    @Transactional(readOnly = true)
    public Map<String, Double> getTargetsByCompany(Long companyId) {
        List<CompanyIndicatorTarget> targets = targetRepository.findByCompanyId(companyId);
        Map<String, Double> result = new HashMap<>();
        for (CompanyIndicatorTarget target : targets) {
            result.put(target.getIndicatorId(), target.getTargetValue());
        }
        return result;
    }

    @Transactional(readOnly = true)
    public Optional<Double> getTargetValue(Long companyId, String indicatorId) {
        return targetRepository.findByCompanyIdAndIndicatorId(companyId, indicatorId)
                .map(CompanyIndicatorTarget::getTargetValue);
    }
}


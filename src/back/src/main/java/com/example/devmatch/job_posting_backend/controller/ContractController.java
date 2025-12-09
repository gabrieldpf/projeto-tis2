package com.example.devmatch.job_posting_backend.controller;

import com.example.devmatch.job_posting_backend.dto.ContractCreateRequest;
import com.example.devmatch.job_posting_backend.dto.ContractResponse;
import com.example.devmatch.job_posting_backend.service.ContractService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contracts")
public class ContractController {

    private final ContractService contractService;

    public ContractController(ContractService contractService) {
        this.contractService = contractService;
    }

    @PostMapping
    public ResponseEntity<ContractResponse> create(@RequestHeader("X-User-Id") Long companyId,
                                                   @Valid @RequestBody ContractCreateRequest body) {
        ContractResponse resp = contractService.createContract(body.vagaId(), companyId, body.developerId(), body.contractType());
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/active/company/{companyId}")
    public ResponseEntity<List<ContractResponse>> activeForCompany(@PathVariable Long companyId) {
        return ResponseEntity.ok(contractService.listActiveForCompany(companyId));
    }

    @GetMapping("/active/developer/{developerId}")
    public ResponseEntity<List<ContractResponse>> activeForDeveloper(@PathVariable Long developerId) {
        return ResponseEntity.ok(contractService.listActiveForDeveloper(developerId));
    }

    @GetMapping("/finished/{userId}")
    public ResponseEntity<List<ContractResponse>> finishedForUser(@PathVariable Long userId) {
        return ResponseEntity.ok(contractService.listFinishedForUser(userId));
    }

    @PostMapping("/{contractId}/finish")
    public ResponseEntity<ContractResponse> finish(@PathVariable Long contractId,
                                                   @RequestHeader("X-User-Id") Long actingCompanyId) {
        return ResponseEntity.ok(contractService.finishContract(contractId, actingCompanyId));
    }
}

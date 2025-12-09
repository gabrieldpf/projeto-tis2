package com.example.devmatch.job_posting_backend.service;

import com.example.devmatch.job_posting_backend.dto.DisputeCreateRequest;
import com.example.devmatch.job_posting_backend.dto.DisputeDecisionRequest;
import com.example.devmatch.job_posting_backend.dto.DisputeItemResponse;
import com.example.devmatch.job_posting_backend.entity.*;
import com.example.devmatch.job_posting_backend.repository.FeedbackDisputeRepository;
import com.example.devmatch.job_posting_backend.repository.FeedbackRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FeedbackDisputeService {

    private final FeedbackDisputeRepository disputeRepository;
    private final FeedbackRepository feedbackRepository;

    public FeedbackDisputeService(FeedbackDisputeRepository disputeRepository,
                                  FeedbackRepository feedbackRepository) {
        this.disputeRepository = disputeRepository;
        this.feedbackRepository = feedbackRepository;
    }

    public Long openDispute(Long userId, DisputeCreateRequest req) {
        Feedback fb = feedbackRepository.findById(req.feedbackId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Feedback não encontrado."));

        if (req.justificativaDisputa() == null || req.justificativaDisputa().trim().length() < 20) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Justificativa deve ter pelo menos 20 caracteres.");
        }

        FeedbackDispute dispute = new FeedbackDispute();
        dispute.setFeedback(fb);
        dispute.setOpenedByUserId(userId);
        dispute.setJustificativaDisputa(req.justificativaDisputa());
        dispute.setStatus(DisputeStatus.OPEN);
        dispute.setCreatedAt(LocalDateTime.now());

        return disputeRepository.save(dispute).getId();
    }

    public void decide(Long disputeId, DisputeDecisionRequest req) {
        FeedbackDispute d = disputeRepository.findById(disputeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Disputa não encontrada."));

        d.setDecisaoMediacao(req.decisao());
        d.setStatus(DisputeStatus.CLOSED);
        d.setResolvedAt(LocalDateTime.now());

        disputeRepository.save(d);
        // aqui você poderia, se necessário, ajustar o feedback e recalcular reputação
    }

    @Transactional(readOnly = true)
    public List<DisputeItemResponse> getMyDisputes(Long userId) {
        try {
            return disputeRepository.findByOpenedByUserId(userId)
                    .stream()
                    .map(d -> {
                        // Verifica se o feedback não é null antes de acessar
                        if (d.getFeedback() == null) {
                            throw new ResponseStatusException(
                                    HttpStatus.INTERNAL_SERVER_ERROR,
                                    "Feedback associado à disputa " + d.getId() + " não encontrado."
                            );
                        }
                        return new DisputeItemResponse(
                                d.getId(),
                                d.getFeedback().getId(),
                                d.getJustificativaDisputa(),
                                d.getStatus(),
                                d.getDecisaoMediacao(),
                                d.getCreatedAt()
                        );
                    })
                    .toList();
        } catch (Exception e) {
            if (e instanceof ResponseStatusException) {
                throw e;
            }
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Erro ao buscar disputas do usuário: " + e.getMessage(),
                    e
            );
        }
    }
    
    /**
     * Lista todas as disputas abertas (para administradores/mediadores)
     * @return Lista de disputas com status OPEN
     */
    @Transactional(readOnly = true)
    public List<DisputeItemResponse> getAllOpenDisputes() {
        try {
            // A query com JOIN FETCH garante que o Feedback seja carregado junto
            List<FeedbackDispute> disputes = disputeRepository.findByStatus(DisputeStatus.OPEN);
            
            if (disputes == null || disputes.isEmpty()) {
                return List.of();
            }
            
            return disputes.stream()
                    .map(d -> {
                        // Com JOIN FETCH, o feedback deve estar carregado, mas verificamos por segurança
                        if (d.getFeedback() == null) {
                            throw new ResponseStatusException(
                                    HttpStatus.INTERNAL_SERVER_ERROR,
                                    "Feedback associado à disputa " + d.getId() + " não encontrado."
                            );
                        }
                        
                        // Retorna a resposta com decisao_mediacao podendo ser null (normal para disputas abertas)
                        return new DisputeItemResponse(
                                d.getId(),
                                d.getFeedback().getId(),
                                d.getJustificativaDisputa() != null ? d.getJustificativaDisputa() : "",
                                d.getStatus() != null ? d.getStatus() : DisputeStatus.OPEN,
                                d.getDecisaoMediacao(), // Pode ser null para disputas abertas
                                d.getCreatedAt()
                        );
                    })
                    .toList();
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            // Log do erro completo para debug
            e.printStackTrace();
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Erro ao buscar disputas abertas: " + e.getClass().getSimpleName() + " - " + e.getMessage(),
                    e
            );
        }
    }
}


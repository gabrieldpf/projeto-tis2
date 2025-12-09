package com.example.devmatch.job_posting_backend.service;

import com.example.devmatch.job_posting_backend.dto.*;
import com.example.devmatch.job_posting_backend.entity.*;
import com.example.devmatch.job_posting_backend.repository.FeedbackDisputeRepository;
import com.example.devmatch.job_posting_backend.repository.FeedbackRepository;
import com.example.devmatch.job_posting_backend.repository.UserReputationRepository;
import com.example.devmatch.job_posting_backend.repository.ContractRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final UserReputationRepository reputationRepository;
    private final FeedbackDisputeRepository disputeRepository;
    private final ContractRepository contractRepository;

    public FeedbackService(FeedbackRepository feedbackRepository,
                           UserReputationRepository reputationRepository,
                           FeedbackDisputeRepository disputeRepository,
                           ContractRepository contractRepository) {
        this.feedbackRepository = feedbackRepository;
        this.reputationRepository = reputationRepository;
        this.disputeRepository = disputeRepository;
        this.contractRepository = contractRepository;
    }

    @org.springframework.transaction.annotation.Transactional
    public Long createFeedback(Long raterId, FeedbackCreateRequest req) {
        if (req.projectId() == null || req.ratedId() == null || req.ratedRole() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Dados obrigatórios ausentes.");
        }

    if (feedbackRepository.existsByProjectIdAndRaterId(req.projectId(), raterId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Você já avaliou este projeto.");
        }

    // validar se existe contrato finalizado vinculando rater e rated para esse projeto
    boolean contratoFinalizado = contractRepository.findAll().stream().anyMatch(c ->
        c.getVaga().getId().equals(req.projectId()) &&
            c.getStatus() == ContractStatus.FINISHED &&
            ((c.getCompanyId().equals(raterId) && c.getDeveloperId().equals(req.ratedId())) ||
             (c.getDeveloperId().equals(raterId) && c.getCompanyId().equals(req.ratedId()))));
    if (!contratoFinalizado) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
            "Avaliação só permitida após finalização do contrato.");
    }

        if (req.comentario() != null && !req.comentario().isBlank()
                && req.comentario().trim().length() < 20) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Comentário deve ter pelo menos 20 caracteres, se informado.");
        }

        Feedback fb = new Feedback();
        fb.setProjectId(req.projectId());
        fb.setRaterId(raterId);
        fb.setRatedId(req.ratedId());
        fb.setRatedRole(req.ratedRole());
        fb.setQualidadeTecnica(req.qualidadeTecnica());
        fb.setCumprimentoPrazos(req.cumprimentoPrazos());
        fb.setComunicacao(req.comunicacao());
        fb.setColaboracao(req.colaboracao());
        fb.setComentario(req.comentario());
        fb.setDataAvaliacao(LocalDateTime.now());

        Feedback saved = feedbackRepository.save(fb);
        atualizarReputacao(req.ratedId());

        return saved.getId();
    }

    public FeedbackSummaryResponse getSummary(Long userId) {
        long recebidos = feedbackRepository.findByRatedId(userId).size();
        long realizados = feedbackRepository.findByRaterId(userId).size();
        long contestacoes = disputeRepository.countByOpenedByUserIdAndStatus(userId, DisputeStatus.OPEN);

        // provisório: projetos finalizados pode ser refinado usando tabela projetos/candidaturas
        long projetosFinalizados = Math.max(recebidos, realizados);

        return new FeedbackSummaryResponse(
                projetosFinalizados,
                recebidos,
                realizados,
                contestacoes
        );
    }

    public List<FeedbackItemResponse> getReceived(Long userId) {
        return feedbackRepository.findByRatedId(userId)
                .stream()
                .map(this::toItemResponse)
                .toList();
    }

    public List<FeedbackItemResponse> getGiven(Long userId) {
        return feedbackRepository.findByRaterId(userId)
                .stream()
                .map(this::toItemResponse)
                .toList();
    }
    
    /**
     * Busca um feedback específico pelo ID (para administradores)
     * @param feedbackId ID do feedback
     * @return Feedback encontrado ou null se não existir
     */
    public FeedbackItemResponse getFeedbackById(Long feedbackId) {
        return feedbackRepository.findById(feedbackId)
                .map(this::toItemResponse)
                .orElse(null);
    }

    private FeedbackItemResponse toItemResponse(Feedback f) {
        double estrelas = (f.getQualidadeTecnica()
                + f.getCumprimentoPrazos()
                + f.getComunicacao()
                + f.getColaboracao()) / 4.0;

        return new FeedbackItemResponse(
                f.getId(),
                f.getProjectId(),
                f.getRaterId(),
                f.getRatedId(),
                f.getRatedRole().name(),
                Math.round(estrelas * 10.0) / 10.0,
                f.getComentario(),
                f.getDataAvaliacao(),
                f.getQualidadeTecnica(),
                f.getCumprimentoPrazos(),
                f.getComunicacao(),
                f.getColaboracao()
        );
    }

    private void atualizarReputacao(Long ratedId) {
        List<Feedback> feedbacks = feedbackRepository.findByRatedId(ratedId);

        if (feedbacks.isEmpty()) {
            reputationRepository.deleteById(ratedId);
            return;
        }

        double media = feedbacks.stream()
                .mapToDouble(f -> (f.getQualidadeTecnica()
                        + f.getCumprimentoPrazos()
                        + f.getComunicacao()
                        + f.getColaboracao()) / 4.0)
                .average()
                .orElse(0.0);

        UserReputation rep = reputationRepository.findById(ratedId)
                .orElseGet(() -> {
                    UserReputation ur = new UserReputation();
                    ur.setUserId(ratedId);
                    return ur;
                });

        rep.setScoreMedio(Math.round(media * 10.0) / 10.0);
        rep.setTotalFeedbacks((long) feedbacks.size());
        rep.setUpdatedAt(LocalDateTime.now());

        reputationRepository.save(rep);
    }
}


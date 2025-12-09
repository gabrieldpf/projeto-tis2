package com.example.devmatch.job_posting_backend.service;

import com.example.devmatch.job_posting_backend.dto.*;
import com.example.devmatch.job_posting_backend.entity.*;
import com.example.devmatch.job_posting_backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.Base64;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.example.devmatch.job_posting_backend.dto.TechnicalTestSubmissionDetailDto;

@Service
public class TechnicalTestService {
    private final TechnicalTestRepository testRepository;
    private final TechnicalTestQuestionRepository questionRepository;
    private final TechnicalTestSubmissionRepository submissionRepository;
    private final TechnicalTestAnswerRepository answerRepository;
    private final JobPostingService jobPostingService;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final ContractService contractService;

    public TechnicalTestService(
            TechnicalTestRepository testRepository,
            TechnicalTestQuestionRepository questionRepository,
            TechnicalTestSubmissionRepository submissionRepository,
            TechnicalTestAnswerRepository answerRepository,
            JobPostingService jobPostingService,
            ContractService contractService
    ) {
        this.testRepository = testRepository;
        this.questionRepository = questionRepository;
        this.submissionRepository = submissionRepository;
        this.answerRepository = answerRepository;
        this.jobPostingService = jobPostingService;
        this.contractService = contractService;
    }

    @Transactional
    public TechnicalTestResponseDto createOrUpdateTest(CreateTechnicalTestRequestDto request) {
        JobPosting vaga = jobPostingService.getJobById(request.getVagaId())
                .orElseThrow(() -> new RuntimeException("Vaga não encontrada com ID: " + request.getVagaId()));

        TechnicalTest test = testRepository.findByVaga_Id(vaga.getId()).orElseGet(TechnicalTest::new);
        test.setVaga(vaga);
        TechnicalTestType type = TechnicalTestType.valueOf(request.getType());
        test.setType(type);
        test.setUrlPdf(Objects.equals(type, TechnicalTestType.pdf) ? request.getUrlPdf() : null);

        // Persiste o test primeiro
        test = testRepository.save(test);

        // Limpa perguntas antigas (se existirem)
        if (test.getId() != null) {
            questionRepository.deleteByTest_Id(test.getId());
        }

        if (Objects.equals(type, TechnicalTestType.questions) && request.getQuestions() != null) {
            int order = 1;
            for (TechnicalTestQuestionDto q : request.getQuestions()) {
                TechnicalTestQuestion entity = new TechnicalTestQuestion();
                entity.setTest(test);
                entity.setQuestionOrder(q.getQuestionOrder() != null ? q.getQuestionOrder() : order);
                entity.setTitle(q.getTitle());
                entity.setDescription(q.getDescription());
                entity.setLanguage(q.getLanguage());
                entity.setStarterCode(q.getStarterCode());
                questionRepository.save(entity);
                order++;
            }
        }

        return toResponseDto(testRepository.findById(test.getId()).orElseThrow());
    }

    @Transactional(readOnly = true)
    public TechnicalTestResponseDto getTestByVagaId(Long vagaId) {
        TechnicalTest test = testRepository.findByVaga_Id(vagaId).orElse(null);
        if (test == null) return null;
        return toResponseDto(test);
    }

    @Transactional
    public Long submitTest(SubmitTechnicalTestRequestDto request) {
        JobPosting vaga = jobPostingService.getJobById(request.getVagaId())
                .orElseThrow(() -> new RuntimeException("Vaga não encontrada com ID: " + request.getVagaId()));

        TechnicalTestSubmission submission = new TechnicalTestSubmission();
        submission.setVaga(vaga);
        submission.setUsuarioId(request.getUsuarioId());
        submission.setStatus("enviado");

        try {
            String base64 = request.getFileBase64();
            if (base64 != null && base64.startsWith("data:")) {
                int comma = base64.indexOf(',');
                if (comma > 0) base64 = base64.substring(comma + 1);
            }

            String decoded = null;
            try {
                byte[] bytes = Base64.getDecoder().decode(base64);
                decoded = new String(bytes, StandardCharsets.UTF_8);
            } catch (IllegalArgumentException ignored) { /* manter decoded = null */ }

            // Constrói um JSON garantidamente válido para raw_payload
            String payloadJson;
            if (decoded != null) {
                try {
                    // se decoded é JSON válido, usa-o; caso contrário, faz envelope
                    objectMapper.readTree(decoded);
                    payloadJson = decoded;
                } catch (Exception ex) {
                    var node = objectMapper.createObjectNode();
                    node.put("type", "file");
                    node.put("filename", request.getFilename());
                    node.put("base64", base64);
                    payloadJson = objectMapper.writeValueAsString(node);
                }
            } else {
                var node = objectMapper.createObjectNode();
                node.put("type", "file");
                node.put("filename", request.getFilename());
                node.put("base64", base64);
                payloadJson = objectMapper.writeValueAsString(node);
            }

            submission.setRawPayload(payloadJson);
            // Primeiro salva a submissão com JSON garantido válido
            submission = submissionRepository.save(submission);

            // Se for um payload de respostas, persiste as respostas associadas
            if (decoded != null) {
                try {
                    JsonNode root = objectMapper.readTree(decoded);
                    if ("code_answers".equalsIgnoreCase(root.path("type").asText(""))) {
                        JsonNode answers = root.path("answers");
                        if (answers.isArray()) {
                            for (JsonNode ans : answers) {
                                TechnicalTestAnswer a = new TechnicalTestAnswer();
                                a.setSubmission(submission);
                                a.setTitle(ans.path("title").asText(null));
                                a.setLanguage(ans.path("language").asText(null));
                                a.setCode(ans.path("code").asText(null));
                                a.setResult(null);
                                answerRepository.save(a);
                            }
                        }
                    }
                } catch (Exception ignored) { /* mantém apenas o payload bruto */ }
            }

            return submission.getId();
        } catch (Exception ex) {
            // Último recurso: não deixar quebrar a requisição
            try {
                var node = objectMapper.createObjectNode();
                node.put("type", "file");
                node.put("filename", request.getFilename());
                submission.setRawPayload(objectMapper.writeValueAsString(node));
            } catch (Exception ignore) {
                submission.setRawPayload("{\"type\":\"file\"}");
            }
            return submissionRepository.save(submission).getId();
        }
    }

    @Transactional(readOnly = true)
    public List<TechnicalTestSubmissionSummaryDto> getSubmissions(Long vagaId, Long usuarioId) {
        List<TechnicalTestSubmission> list = submissionRepository.findByVaga_IdAndUsuarioIdOrderBySubmittedAtDesc(vagaId, usuarioId);
        List<TechnicalTestSubmissionSummaryDto> result = new ArrayList<>();
        for (TechnicalTestSubmission s : list) {
            TechnicalTestSubmissionSummaryDto dto = new TechnicalTestSubmissionSummaryDto();
            dto.setId(s.getId());
            dto.setVagaId(s.getVaga().getId());
            dto.setUsuarioId(s.getUsuarioId());
            dto.setSubmittedAt(s.getSubmittedAt());
            dto.setStatus(s.getStatus());
            dto.setScore(s.getScore());
            result.add(dto);
        }
        return result;
    }

    @Transactional(readOnly = true)
    public TechnicalTestSubmissionDetailDto getSubmissionDetail(Long submissionId) {
        TechnicalTestSubmission s = submissionRepository.findById(submissionId).orElse(null);
        if (s == null) return null;
        TechnicalTestSubmissionDetailDto dto = new TechnicalTestSubmissionDetailDto();
        dto.setId(s.getId());
        dto.setVagaId(s.getVaga().getId());
        dto.setUsuarioId(s.getUsuarioId());
        dto.setSubmittedAt(s.getSubmittedAt());
        dto.setStatus(s.getStatus());
        dto.setScore(s.getScore());
        dto.setRawPayload(s.getRawPayload());
        List<TechnicalTestSubmissionDetailDto.AnswerDto> answers = new ArrayList<>();
        for (TechnicalTestAnswer a : s.getAnswers()) {
            TechnicalTestSubmissionDetailDto.AnswerDto ad = new TechnicalTestSubmissionDetailDto.AnswerDto();
            ad.setId(a.getId());
            ad.setTitle(a.getTitle());
            ad.setLanguage(a.getLanguage());
            ad.setCode(a.getCode());
            ad.setResult(a.getResult());
            answers.add(ad);
        }
        dto.setAnswers(answers);
        return dto;
    }

    private TechnicalTestResponseDto toResponseDto(TechnicalTest test) {
        TechnicalTestResponseDto dto = new TechnicalTestResponseDto();
        dto.setId(test.getId());
        dto.setVagaId(test.getVaga().getId());
        dto.setType(test.getType().name());
        dto.setUrlPdf(test.getUrlPdf());
        dto.setCreatedAt(test.getCreatedAt());
        dto.setUpdatedAt(test.getUpdatedAt());
        List<TechnicalTestQuestionDto> qdto = new ArrayList<>();
        for (TechnicalTestQuestion q : test.getQuestions()) {
            TechnicalTestQuestionDto x = new TechnicalTestQuestionDto();
            x.setQuestionOrder(q.getQuestionOrder());
            x.setTitle(q.getTitle());
            x.setDescription(q.getDescription());
            x.setLanguage(q.getLanguage());
            x.setStarterCode(q.getStarterCode());
            qdto.add(x);
        }
        // Ordena por questionOrder
        qdto.sort(Comparator.comparing(o -> Optional.ofNullable(o.getQuestionOrder()).orElse(Integer.MAX_VALUE)));
        dto.setQuestions(qdto);
        return dto;
    }

    @Transactional
    public Long approveSubmissionAndCreateContract(Long submissionId, Long actingCompanyId, ContractType contractType) {
        TechnicalTestSubmission sub = submissionRepository.findById(submissionId).orElseThrow();
        // marca como aprovado
        sub.setStatus("aprovado");
        submissionRepository.save(sub);

        Long vagaId = sub.getVaga().getId();
        Long developerId = sub.getUsuarioId();
        // cria contrato ativo
        ContractResponse contract = contractService.createContract(vagaId, actingCompanyId, developerId, contractType);
        return contract.id();
    }
}



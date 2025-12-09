package com.example.devmatch.job_posting_backend.service;

import com.example.devmatch.job_posting_backend.dto.AdminIndicatorsResponse;
import com.example.devmatch.job_posting_backend.dto.PerformanceIndicatorDto;
import com.example.devmatch.job_posting_backend.entity.Candidatura;
import com.example.devmatch.job_posting_backend.entity.CompanyIndicatorTarget;
import com.example.devmatch.job_posting_backend.entity.Contract;
import com.example.devmatch.job_posting_backend.entity.ContractStatus;
import com.example.devmatch.job_posting_backend.entity.Feedback;
import com.example.devmatch.job_posting_backend.entity.JobPosting;
import com.example.devmatch.job_posting_backend.repository.CandidaturaRepository;
import com.example.devmatch.job_posting_backend.repository.CompanyIndicatorTargetRepository;
import com.example.devmatch.job_posting_backend.repository.ContractRepository;
import com.example.devmatch.job_posting_backend.repository.FeedbackRepository;
import com.example.devmatch.job_posting_backend.repository.JobPostingRepository;
import com.example.devmatch.job_posting_backend.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AdminIndicatorsService {

    private static final List<ContractStatus> EFFECTIVE_CONTRACT_STATUSES = List.of(
            ContractStatus.ACTIVE,
            ContractStatus.FINISHED
    );

    // Valores padrão de metas caso a empresa não tenha configurado
    private static final double DEFAULT_MATCH_SUCCESS_RATE = 70.0;
    private static final double DEFAULT_AVERAGE_HIRING_TIME = 25.0;
    private static final double DEFAULT_DEVELOPER_ENGAGEMENT_RATE = 60.0;
    private static final double DEFAULT_POST_HIRING_SATISFACTION = 4.5;

    private final CandidaturaRepository candidaturaRepository;
    private final ContractRepository contractRepository;
    private final UsuarioRepository usuarioRepository;
    private final FeedbackRepository feedbackRepository;
    private final CompanyIndicatorTargetRepository targetRepository;
    private final JobPostingRepository jobPostingRepository;

    public AdminIndicatorsService(CandidaturaRepository candidaturaRepository,
                                  ContractRepository contractRepository,
                                  UsuarioRepository usuarioRepository,
                                  FeedbackRepository feedbackRepository,
                                  CompanyIndicatorTargetRepository targetRepository,
                                  JobPostingRepository jobPostingRepository) {
        this.candidaturaRepository = candidaturaRepository;
        this.contractRepository = contractRepository;
        this.usuarioRepository = usuarioRepository;
        this.feedbackRepository = feedbackRepository;
        this.targetRepository = targetRepository;
        this.jobPostingRepository = jobPostingRepository;
    }

    @Transactional(readOnly = true)
    public AdminIndicatorsResponse getIndicators(Long companyId, int requestedPeriodDays) {
        int periodDays = sanitizePeriod(requestedPeriodDays);
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime since = now.minusDays(periodDays);

        List<PerformanceIndicatorDto> indicadores = new ArrayList<>();
        indicadores.add(buildMatchSuccessIndicator(companyId, since));
        indicadores.add(buildAverageHiringTimeIndicator(companyId, since));
        indicadores.add(buildEngagementIndicator(companyId, since, periodDays));
        indicadores.add(buildSatisfactionIndicator(companyId, since));

        return AdminIndicatorsResponse.builder()
                .periodDays(periodDays)
                .generatedAt(now)
                .indicators(indicadores)
                .build();
    }

    @Transactional(readOnly = true)
    public AdminIndicatorsResponse getIndicatorsForAdmin(Long adminUserId, int requestedPeriodDays) {
        System.out.println("DEBUG AdminIndicatorsService: getIndicatorsForAdmin() chamado - buscando dados de TODAS as empresas");
        int periodDays = sanitizePeriod(requestedPeriodDays);
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime since = now.minusDays(periodDays);

        List<PerformanceIndicatorDto> indicadores = new ArrayList<>();
        indicadores.add(buildMatchSuccessIndicatorForAdmin(adminUserId, since));
        indicadores.add(buildAverageHiringTimeIndicatorForAdmin(adminUserId, since));
        indicadores.add(buildEngagementIndicatorForAdmin(adminUserId, since, periodDays));
        indicadores.add(buildSatisfactionIndicatorForAdmin(adminUserId, since));

        System.out.println("DEBUG AdminIndicatorsService: Retornando " + indicadores.size() + " indicadores para admin");
        return AdminIndicatorsResponse.builder()
                .periodDays(periodDays)
                .generatedAt(now)
                .indicators(indicadores)
                .build();
    }

    private Double getTargetValue(Long companyId, String indicatorId, double defaultValue) {
        Optional<CompanyIndicatorTarget> target = targetRepository.findByCompanyIdAndIndicatorId(companyId, indicatorId);
        return target.map(CompanyIndicatorTarget::getTargetValue).orElse(defaultValue);
    }

    private int sanitizePeriod(int periodDays) {
        if (periodDays < 7) {
            return 7;
        }
        if (periodDays > 365) {
            return 365;
        }
        return periodDays;
    }

    private PerformanceIndicatorDto buildMatchSuccessIndicator(Long companyId, LocalDateTime since) {
        // Buscar todas as vagas da empresa primeiro
        List<JobPosting> vagas = jobPostingRepository.findByUsuarioId(companyId);
        List<Long> vagaIds = vagas.stream().map(JobPosting::getId).toList();
        
        // Buscar todas as candidaturas das vagas da empresa e filtrar por período
        List<Candidatura> todasCandidaturas = candidaturaRepository.findAll().stream()
                .filter(c -> vagaIds.contains(c.getVagaId()))
                .filter(c -> c.getDataCandidatura() != null && !c.getDataCandidatura().isBefore(since))
                .toList();
        
        long totalCandidaturas = todasCandidaturas.size();
        long candidaturasPendentes = todasCandidaturas.stream()
                .filter(c -> "pendente".equalsIgnoreCase(c.getStatus()))
                .count();
        long candidaturasEmAnalise = todasCandidaturas.stream()
                .filter(c -> "em_analise".equalsIgnoreCase(c.getStatus()))
                .count();
        long matchesAceitos = todasCandidaturas.stream()
                .filter(c -> "aceito".equalsIgnoreCase(c.getStatus()))
                .count();
        long candidaturasRejeitadas = todasCandidaturas.stream()
                .filter(c -> "rejeitado".equalsIgnoreCase(c.getStatus()))
                .count();
        
        // Buscar contratos da empresa e filtrar por período (usando startedAt)
        List<Contract> todosContratos = contractRepository.findByCompanyIdAndStatusIn(companyId, EFFECTIVE_CONTRACT_STATUSES);
        long contratosEfetivos = todosContratos.stream()
                .filter(c -> c.getStartedAt() != null && !c.getStartedAt().isBefore(since))
                .count();
        
        // Taxa principal: (contratos gerados / candidaturas aceitas) * 100
        // Taxa secundária: (contratos gerados / total de candidaturas) * 100
        double taxaAceitosParaContrato = matchesAceitos > 0 
                ? (contratosEfetivos / (double) matchesAceitos) * 100d 
                : 0d;
        double taxaGeral = totalCandidaturas > 0 
                ? (contratosEfetivos / (double) totalCandidaturas) * 100d 
                : (contratosEfetivos > 0 ? 100d : 0d);
        
        // Usar a taxa geral como valor principal, mas incluir taxa de aceitos nos detalhes
        double valor = round(Math.min(taxaGeral, 100d));
        double meta = getTargetValue(companyId, "match-success-rate", DEFAULT_MATCH_SUCCESS_RATE);
        
        // Taxa de conversão por etapa
        double taxaPendenteParaAnalise = totalCandidaturas > 0 
                ? (candidaturasEmAnalise / (double) totalCandidaturas) * 100d 
                : 0d;
        double taxaAnaliseParaAceito = candidaturasEmAnalise > 0 
                ? (matchesAceitos / (double) candidaturasEmAnalise) * 100d 
                : 0d;

        Map<String, Object> detalhes = new LinkedHashMap<>();
        detalhes.put("totalCandidaturas", totalCandidaturas);
        detalhes.put("candidaturasPendentes", candidaturasPendentes);
        detalhes.put("candidaturasEmAnalise", candidaturasEmAnalise);
        detalhes.put("matchesAceitos", matchesAceitos);
        detalhes.put("candidaturasRejeitadas", candidaturasRejeitadas);
        detalhes.put("contratosGerados", contratosEfetivos);
        detalhes.put("taxaAceitosParaContrato", round(taxaAceitosParaContrato));
        detalhes.put("taxaPendenteParaAnalise", round(taxaPendenteParaAnalise));
        detalhes.put("taxaAnaliseParaAceito", round(taxaAnaliseParaAceito));
        detalhes.put("totalVagas", vagas.size());
        detalhes.put("consideraStatus", "Todas candidaturas x contratos ativos/finalizados");

        String observacoes = null;
        if (vagas.isEmpty()) {
            observacoes = "Você ainda não publicou nenhuma vaga.";
        } else if (totalCandidaturas == 0 && contratosEfetivos == 0) {
            observacoes = "Há " + vagas.size() + " vaga(s) publicada(s), mas ainda não há candidaturas ou contratos registrados.";
        } else if (totalCandidaturas > 0 && contratosEfetivos == 0) {
            observacoes = "Há " + totalCandidaturas + " candidatura(s), mas nenhum contrato foi gerado ainda. Taxa de conversão de aceitos para contrato: " + round(taxaAceitosParaContrato) + "%.";
        } else if (matchesAceitos > 0 && contratosEfetivos < matchesAceitos) {
            observacoes = "Há " + matchesAceitos + " candidatura(s) aceita(s), mas apenas " + contratosEfetivos + " contrato(s) gerado(s). Taxa de conversão: " + round(taxaAceitosParaContrato) + "%.";
        }

        return PerformanceIndicatorDto.builder()
                .id("match-success-rate")
                .indicador("Taxa de match bem-sucedido")
                .objetivo("Medir a eficácia do algoritmo de matching entre empresas e desenvolvedores")
                .descricao("Percentual de candidaturas que resultaram em contratação efetiva.")
                .fonteDados(List.of("Candidaturas", "Contracts"))
                .formula("(número de contratos gerados / número total de candidaturas) * 100")
                .valor(valor)
                .unidade("%")
                .meta(meta)
                .metaDescricao("Meta mínima de " + meta + "% para garantir que os matches evoluam para contratação.")
                .detalhes(detalhes)
                .observacoes(observacoes)
                .build();
    }

    private PerformanceIndicatorDto buildAverageHiringTimeIndicator(Long companyId, LocalDateTime since) {
        List<Contract> contratos = contractRepository.findByCompanyIdAndStatusIn(companyId, EFFECTIVE_CONTRACT_STATUSES);
        List<Double> temposDias = contratos.stream()
                .filter(contrato -> contrato.getVaga() != null && contrato.getVaga().getPostedDate() != null && contrato.getStartedAt() != null)
                .filter(contrato -> contrato.getStartedAt() != null && !contrato.getStartedAt().isBefore(since))
                .mapToDouble(contrato -> {
                    Duration duracao = Duration.between(contrato.getVaga().getPostedDate(), contrato.getStartedAt());
                    double dias = duracao.toHours() / 24d;
                    return Math.max(0d, dias);
                })
                .boxed()
                .sorted()
                .toList();
        
        double mediaDias = temposDias.stream().mapToDouble(Double::doubleValue).average().orElse(0d);
        double medianaDias = 0d;
        double tempoMinimo = temposDias.isEmpty() ? 0d : temposDias.get(0);
        double tempoMaximo = temposDias.isEmpty() ? 0d : temposDias.get(temposDias.size() - 1);
        
        if (!temposDias.isEmpty()) {
            int meio = temposDias.size() / 2;
            if (temposDias.size() % 2 == 0) {
                medianaDias = (temposDias.get(meio - 1) + temposDias.get(meio)) / 2d;
            } else {
                medianaDias = temposDias.get(meio);
            }
        }
        
        // Separar por tipo de contrato
        Map<String, Long> contratosPorTipo = contratos.stream()
                .filter(c -> c.getStartedAt() != null && !c.getStartedAt().isBefore(since))
                .collect(java.util.stream.Collectors.groupingBy(
                        c -> c.getContractType() != null ? c.getContractType().toString() : "N/A",
                        java.util.stream.Collectors.counting()
                ));
        
        double meta = getTargetValue(companyId, "average-hiring-time", DEFAULT_AVERAGE_HIRING_TIME);

        Map<String, Object> detalhes = new LinkedHashMap<>();
        detalhes.put("contratosConsiderados", temposDias.size());
        detalhes.put("mediaDias", round(mediaDias));
        detalhes.put("medianaDias", round(medianaDias));
        detalhes.put("tempoMinimo", round(tempoMinimo));
        detalhes.put("tempoMaximo", round(tempoMaximo));
        detalhes.put("contratosPorTipo", contratosPorTipo);
        detalhes.put("janelaAnalise", "Contratos ativos e finalizados");

        return PerformanceIndicatorDto.builder()
                .id("average-hiring-time")
                .indicador("Tempo médio de contratação")
                .objetivo("Reduzir o tempo entre a abertura da vaga e a contratação do desenvolvedor")
                .descricao("Média de dias entre a data de criação da vaga e a data de início do contrato.")
                .fonteDados(List.of("Vagas", "Contracts"))
                .formula("soma(data_contratacao - data_abertura_vaga) / número total de contratações")
                .valor(round(mediaDias))
                .unidade("dias")
                .meta(meta)
                .metaDescricao("Manter o ciclo de contratação abaixo de " + meta + " dias.")
                .detalhes(detalhes)
                .observacoes("Considera apenas contratos cujo status está ativo ou finalizado e que possuem datas preenchidas.")
                .build();
    }

    private PerformanceIndicatorDto buildEngagementIndicator(Long companyId, LocalDateTime since, int periodDays) {
        // Para engajamento, consideramos apenas devs que se candidataram a vagas desta empresa
        long devsEngajados = candidaturaRepository.countDistinctUsuariosAtivosDesdeByCompany(since, companyId);
        // Total de devs ativos na plataforma (não filtrado por empresa, pois é um indicador geral)
        long devsAtivos = usuarioRepository.countByTipoIgnoreCaseAndPerfilCompletoTrue("dev");
        double taxa = devsAtivos == 0 ? 0d : (devsEngajados / (double) devsAtivos) * 100d;
        double meta = getTargetValue(companyId, "developer-engagement-rate", DEFAULT_DEVELOPER_ENGAGEMENT_RATE);

        Map<String, Object> detalhes = new LinkedHashMap<>();
        detalhes.put("desenvolvedoresAtivos", devsAtivos);
        detalhes.put("desenvolvedoresComCandidaturaNoPeriodo", devsEngajados);
        detalhes.put("janelaDias", periodDays);

        return PerformanceIndicatorDto.builder()
                .id("developer-engagement-rate")
                .indicador("Taxa de engajamento dos desenvolvedores")
                .objetivo("Acompanhar o engajamento dos devs com as oportunidades disponíveis na plataforma")
                .descricao("Percentual de desenvolvedores ativos que se candidataram a pelo menos uma vaga da empresa no período.")
                .fonteDados(List.of("Usuários", "Candidaturas"))
                .formula("(devs com candidatura no período / devs ativos no período) * 100")
                .valor(round(taxa))
                .unidade("%")
                .meta(meta)
                .metaDescricao("Manter ao menos " + meta + "% da base ativa engajada em oportunidades.")
                .detalhes(detalhes)
                .observacoes("Considera desenvolvedores com perfil completo como base ativa e apenas candidaturas às vagas desta empresa.")
                .build();
    }

    private PerformanceIndicatorDto buildSatisfactionIndicator(Long companyId, LocalDateTime since) {
        // Buscar feedbacks relacionados a contratos da empresa
        List<Contract> contratos = contractRepository.findByCompanyIdAndStatusIn(companyId, EFFECTIVE_CONTRACT_STATUSES);
        List<Long> contractIds = contratos.stream().map(Contract::getId).toList();
        
        List<Feedback> allFeedbacks = feedbackRepository.findAll();
        List<Feedback> feedbacks = allFeedbacks.stream()
                .filter(f -> {
                    // Filtrar por período primeiro
                    if (f.getDataAvaliacao() == null || f.getDataAvaliacao().isBefore(since)) {
                        return false;
                    }
                    // Se projectId corresponde a um contrato da empresa
                    if (contractIds.contains(f.getProjectId())) {
                        return true;
                    }
                    // Ou se o raterId ou ratedId corresponde à empresa ou a um dev de contrato da empresa
                    if (f.getRaterId().equals(companyId) || f.getRatedId().equals(companyId)) {
                        return true;
                    }
                    // Verificar se ratedId ou raterId são developers de contratos da empresa
                    return contratos.stream().anyMatch(c -> 
                        c.getDeveloperId() != null && 
                        (c.getDeveloperId().equals(f.getRatedId()) || 
                         c.getDeveloperId().equals(f.getRaterId()))
                    );
                })
                .toList();
        
        // Separar feedbacks da empresa sobre devs e feedbacks de devs sobre a empresa
        List<Feedback> feedbacksEmpresaParaDev = feedbacks.stream()
                .filter(f -> f.getRatedRole() != null && f.getRatedRole().toString().equals("DEVELOPER"))
                .toList();
        List<Feedback> feedbacksDevParaEmpresa = feedbacks.stream()
                .filter(f -> f.getRatedRole() != null && f.getRatedRole().toString().equals("COMPANY"))
                .toList();
        
        // Calcular médias gerais e por critério
        double mediaGeral = feedbacks.stream()
                .mapToDouble(feedback ->
                        (feedback.getQualidadeTecnica()
                         + feedback.getCumprimentoPrazos()
                         + feedback.getComunicacao()
                         + feedback.getColaboracao()) / 4d
                )
                .average()
                .orElse(0d);
        
        double mediaEmpresaParaDev = feedbacksEmpresaParaDev.stream()
                .mapToDouble(f -> (f.getQualidadeTecnica() + f.getCumprimentoPrazos() + f.getComunicacao() + f.getColaboracao()) / 4d)
                .average()
                .orElse(0d);
        
        double mediaDevParaEmpresa = feedbacksDevParaEmpresa.stream()
                .mapToDouble(f -> (f.getQualidadeTecnica() + f.getCumprimentoPrazos() + f.getComunicacao() + f.getColaboracao()) / 4d)
                .average()
                .orElse(0d);
        
        // Médias por critério
        double mediaQualidadeTecnica = feedbacks.stream()
                .mapToDouble(Feedback::getQualidadeTecnica)
                .average()
                .orElse(0d);
        double mediaCumprimentoPrazos = feedbacks.stream()
                .mapToDouble(Feedback::getCumprimentoPrazos)
                .average()
                .orElse(0d);
        double mediaComunicacao = feedbacks.stream()
                .mapToDouble(Feedback::getComunicacao)
                .average()
                .orElse(0d);
        double mediaColaboracao = feedbacks.stream()
                .mapToDouble(Feedback::getColaboracao)
                .average()
                .orElse(0d);
        
        double meta = getTargetValue(companyId, "post-hiring-satisfaction", DEFAULT_POST_HIRING_SATISFACTION);

        Map<String, Object> detalhes = new LinkedHashMap<>();
        detalhes.put("avaliacoesConsideradas", feedbacks.size());
        detalhes.put("avaliacoesEmpresaParaDev", feedbacksEmpresaParaDev.size());
        detalhes.put("avaliacoesDevParaEmpresa", feedbacksDevParaEmpresa.size());
        detalhes.put("mediaGeral", round(mediaGeral));
        detalhes.put("mediaEmpresaParaDev", round(mediaEmpresaParaDev));
        detalhes.put("mediaDevParaEmpresa", round(mediaDevParaEmpresa));
        detalhes.put("mediaQualidadeTecnica", round(mediaQualidadeTecnica));
        detalhes.put("mediaCumprimentoPrazos", round(mediaCumprimentoPrazos));
        detalhes.put("mediaComunicacao", round(mediaComunicacao));
        detalhes.put("mediaColaboracao", round(mediaColaboracao));
        detalhes.put("pontuacaoNormalizada", round(mediaGeral == 0 ? 0d : (mediaGeral / 5d) * 100d));

        return PerformanceIndicatorDto.builder()
                .id("post-hiring-satisfaction")
                .indicador("Índice de satisfação pós-contratação")
                .objetivo("Avaliar a qualidade percebida após a contratação, tanto por empresas quanto por devs")
                .descricao("Média das avaliações dadas em contratos concluídos ou ativos da empresa.")
                .fonteDados(List.of("Contratacoes", "Avaliacoes"))
                .formula("soma das notas das avaliações / número total de avaliações registradas")
                .valor(round(mediaGeral))
                .unidade("pt")
                .meta(meta)
                .metaDescricao("Operar com média igual ou superior a " + meta + " pontos.")
                .detalhes(detalhes)
                .observacoes("Calcula a média simples dos quatro critérios do formulário de feedback (escala 1-5).")
                .build();
    }

    // ========== Métodos para indicadores gerais (admin) ==========

    private PerformanceIndicatorDto buildGeneralMatchSuccessIndicator() {
        // Buscar todas as vagas
        List<JobPosting> todasVagas = jobPostingRepository.findAll();
        // Contar todas as candidaturas (JpaRepository já fornece count())
        long totalCandidaturas = candidaturaRepository.count();
        long contratosEfetivos = contractRepository.countByStatusIn(EFFECTIVE_CONTRACT_STATUSES);
        
        double taxa = totalCandidaturas == 0 ? (contratosEfetivos > 0 ? 100d : 0d) 
                : (contratosEfetivos / (double) totalCandidaturas) * 100d;
        double valor = round(Math.min(taxa, 100d));
        double meta = DEFAULT_MATCH_SUCCESS_RATE;

        Map<String, Object> detalhes = new LinkedHashMap<>();
        detalhes.put("totalCandidaturas", totalCandidaturas);
        detalhes.put("contratosGerados", contratosEfetivos);
        detalhes.put("totalVagas", todasVagas.size());

        String observacoes = null;
        if (todasVagas.isEmpty()) {
            observacoes = "Nenhuma vaga publicada na plataforma ainda.";
        } else if (totalCandidaturas == 0 && contratosEfetivos == 0) {
            observacoes = "Há " + todasVagas.size() + " vaga(s) publicada(s), mas ainda não há candidaturas ou contratos registrados.";
        }

        return PerformanceIndicatorDto.builder()
                .id("match-success-rate")
                .indicador("Taxa de match bem-sucedido (Geral)")
                .objetivo("Medir a eficácia geral do algoritmo de matching na plataforma")
                .descricao("Percentual de candidaturas que resultaram em contratação efetiva em toda a plataforma.")
                .fonteDados(List.of("Candidaturas", "Contracts"))
                .formula("(número de contratos gerados / número total de candidaturas) * 100")
                .valor(valor)
                .unidade("%")
                .meta(meta)
                .metaDescricao("Meta mínima de " + meta + "% para garantir que os matches evoluam para contratação.")
                .detalhes(detalhes)
                .observacoes(observacoes)
                .build();
    }

    private PerformanceIndicatorDto buildGeneralAverageHiringTimeIndicator() {
        List<Contract> todosContratos = contractRepository.findByStatusIn(EFFECTIVE_CONTRACT_STATUSES);
        double mediaDias = todosContratos.stream()
                .filter(contrato -> contrato.getVaga() != null && contrato.getVaga().getPostedDate() != null && contrato.getStartedAt() != null)
                .mapToDouble(contrato -> {
                    Duration duracao = Duration.between(contrato.getVaga().getPostedDate(), contrato.getStartedAt());
                    double dias = duracao.toHours() / 24d;
                    return Math.max(0d, dias);
                })
                .average()
                .orElse(0d);
        double meta = DEFAULT_AVERAGE_HIRING_TIME;

        Map<String, Object> detalhes = new LinkedHashMap<>();
        detalhes.put("contratosConsiderados", todosContratos.size());
        detalhes.put("janelaAnalise", "Todos os contratos ativos e finalizados da plataforma");

        return PerformanceIndicatorDto.builder()
                .id("average-hiring-time")
                .indicador("Tempo médio de contratação (Geral)")
                .objetivo("Acompanhar o tempo médio de contratação em toda a plataforma")
                .descricao("Média de dias entre a data de criação da vaga e a data de início do contrato em toda a plataforma.")
                .fonteDados(List.of("Vagas", "Contracts"))
                .formula("soma(data_contratacao - data_abertura_vaga) / número total de contratações")
                .valor(round(mediaDias))
                .unidade("dias")
                .meta(meta)
                .metaDescricao("Manter o ciclo de contratação abaixo de " + meta + " dias na plataforma.")
                .detalhes(detalhes)
                .observacoes("Considera todos os contratos ativos ou finalizados da plataforma.")
                .build();
    }

    private PerformanceIndicatorDto buildGeneralEngagementIndicator(LocalDateTime since, int periodDays) {
        long devsEngajados = candidaturaRepository.countDistinctUsuariosAtivosDesde(since);
        long devsAtivos = usuarioRepository.countByTipoIgnoreCaseAndPerfilCompletoTrue("dev");
        double taxa = devsAtivos == 0 ? 0d : (devsEngajados / (double) devsAtivos) * 100d;
        double meta = DEFAULT_DEVELOPER_ENGAGEMENT_RATE;

        Map<String, Object> detalhes = new LinkedHashMap<>();
        detalhes.put("desenvolvedoresAtivos", devsAtivos);
        detalhes.put("desenvolvedoresComCandidaturaNoPeriodo", devsEngajados);
        detalhes.put("janelaDias", periodDays);

        return PerformanceIndicatorDto.builder()
                .id("developer-engagement-rate")
                .indicador("Taxa de engajamento dos desenvolvedores (Geral)")
                .objetivo("Acompanhar o engajamento geral dos devs com as oportunidades da plataforma")
                .descricao("Percentual de desenvolvedores ativos que se candidataram a pelo menos uma vaga no período.")
                .fonteDados(List.of("Usuários", "Candidaturas"))
                .formula("(devs com candidatura no período / devs ativos no período) * 100")
                .valor(round(taxa))
                .unidade("%")
                .meta(meta)
                .metaDescricao("Manter ao menos " + meta + "% da base ativa engajada em oportunidades.")
                .detalhes(detalhes)
                .observacoes("Considera todos os desenvolvedores com perfil completo e todas as candidaturas da plataforma.")
                .build();
    }

    private PerformanceIndicatorDto buildGeneralSatisfactionIndicator() {
        List<Feedback> todosFeedbacks = feedbackRepository.findAll();
        
        double media = todosFeedbacks.stream()
                .mapToDouble(feedback ->
                        (feedback.getQualidadeTecnica()
                         + feedback.getCumprimentoPrazos()
                         + feedback.getComunicacao()
                         + feedback.getColaboracao()) / 4d
                )
                .average()
                .orElse(0d);
        double meta = DEFAULT_POST_HIRING_SATISFACTION;

        Map<String, Object> detalhes = new LinkedHashMap<>();
        detalhes.put("avaliacoesConsideradas", todosFeedbacks.size());
        detalhes.put("pontuacaoNormalizada", round(media == 0 ? 0d : (media / 5d) * 100d));

        return PerformanceIndicatorDto.builder()
                .id("post-hiring-satisfaction")
                .indicador("Índice de satisfação pós-contratação (Geral)")
                .objetivo("Avaliar a qualidade percebida após contratações em toda a plataforma")
                .descricao("Média das avaliações dadas em todos os contratos concluídos ou ativos da plataforma.")
                .fonteDados(List.of("Contratacoes", "Avaliacoes"))
                .formula("soma das notas das avaliações / número total de avaliações registradas")
                .valor(round(media))
                .unidade("pt")
                .meta(meta)
                .metaDescricao("Operar com média igual ou superior a " + meta + " pontos na plataforma.")
                .detalhes(detalhes)
                .observacoes("Calcula a média simples dos quatro critérios do formulário de feedback (escala 1-5) para toda a plataforma.")
                .build();
    }

    private double round(double value) {
        return Math.round(value * 100d) / 100d;
    }

    // Métodos para Admin (sem filtro por empresa - dados de todas as empresas)

    private PerformanceIndicatorDto buildMatchSuccessIndicatorForAdmin(Long adminUserId, LocalDateTime since) {
        System.out.println("DEBUG: buildMatchSuccessIndicatorForAdmin() - buscando TODAS as vagas, candidaturas e contratos");
        // Buscar todas as vagas de todas as empresas
        List<JobPosting> todasVagas = jobPostingRepository.findAll();
        System.out.println("DEBUG: Total de vagas encontradas: " + todasVagas.size());
        
        // Buscar todas as candidaturas e filtrar por período
        List<Candidatura> todasCandidaturas = candidaturaRepository.findAll().stream()
                .filter(c -> c.getDataCandidatura() != null && !c.getDataCandidatura().isBefore(since))
                .toList();
        long totalCandidaturas = todasCandidaturas.size();
        System.out.println("DEBUG: Total de candidaturas (todas, no período): " + totalCandidaturas);
        
        long candidaturasPendentes = todasCandidaturas.stream()
                .filter(c -> "pendente".equalsIgnoreCase(c.getStatus()))
                .count();
        long candidaturasEmAnalise = todasCandidaturas.stream()
                .filter(c -> "em_analise".equalsIgnoreCase(c.getStatus()))
                .count();
        long matchesAceitos = todasCandidaturas.stream()
                .filter(c -> "aceito".equalsIgnoreCase(c.getStatus()))
                .count();
        long candidaturasRejeitadas = todasCandidaturas.stream()
                .filter(c -> "rejeitado".equalsIgnoreCase(c.getStatus()))
                .count();
        System.out.println("DEBUG: Candidaturas aceitas (todas, no período): " + matchesAceitos);
        
        // Buscar todos os contratos efetivos e filtrar por período
        List<Contract> todosContratos = contractRepository.findByStatusIn(EFFECTIVE_CONTRACT_STATUSES);
        long contratosEfetivos = todosContratos.stream()
                .filter(c -> c.getStartedAt() != null && !c.getStartedAt().isBefore(since))
                .count();
        System.out.println("DEBUG: Contratos efetivos (todos, no período): " + contratosEfetivos);
        
        double taxaAceitosParaContrato = matchesAceitos > 0 
                ? (contratosEfetivos / (double) matchesAceitos) * 100d 
                : 0d;
        double taxaGeral = totalCandidaturas > 0 
                ? (contratosEfetivos / (double) totalCandidaturas) * 100d 
                : (contratosEfetivos > 0 ? 100d : 0d);
        
        double valor = round(Math.min(taxaGeral, 100d));
        double meta = getTargetValue(adminUserId, "match-success-rate", DEFAULT_MATCH_SUCCESS_RATE);
        
        double taxaPendenteParaAnalise = totalCandidaturas > 0 
                ? (candidaturasEmAnalise / (double) totalCandidaturas) * 100d 
                : 0d;
        double taxaAnaliseParaAceito = candidaturasEmAnalise > 0 
                ? (matchesAceitos / (double) candidaturasEmAnalise) * 100d 
                : 0d;

        Map<String, Object> detalhes = new LinkedHashMap<>();
        detalhes.put("totalCandidaturas", totalCandidaturas);
        detalhes.put("candidaturasPendentes", candidaturasPendentes);
        detalhes.put("candidaturasEmAnalise", candidaturasEmAnalise);
        detalhes.put("matchesAceitos", matchesAceitos);
        detalhes.put("candidaturasRejeitadas", candidaturasRejeitadas);
        detalhes.put("contratosGerados", contratosEfetivos);
        detalhes.put("taxaAceitosParaContrato", round(taxaAceitosParaContrato));
        detalhes.put("taxaPendenteParaAnalise", round(taxaPendenteParaAnalise));
        detalhes.put("taxaAnaliseParaAceito", round(taxaAnaliseParaAceito));
        detalhes.put("totalVagas", todasVagas.size());
        detalhes.put("escopo", "Todas as empresas da plataforma");
        detalhes.put("consideraStatus", "Todas candidaturas x contratos ativos/finalizados");

        String observacoes = null;
        if (todasVagas.isEmpty()) {
            observacoes = "Ainda não há vagas publicadas na plataforma.";
        } else if (totalCandidaturas == 0 && contratosEfetivos == 0) {
            observacoes = "Há " + todasVagas.size() + " vaga(s) publicada(s), mas ainda não há candidaturas ou contratos registrados.";
        } else if (totalCandidaturas > 0 && contratosEfetivos == 0) {
            observacoes = "Há " + totalCandidaturas + " candidatura(s), mas nenhum contrato foi gerado ainda.";
        }

        return PerformanceIndicatorDto.builder()
                .id("match-success-rate")
                .indicador("Taxa de match bem-sucedido")
                .objetivo("Medir a eficácia do algoritmo de matching entre empresas e desenvolvedores")
                .descricao("Percentual de candidaturas que resultaram em contratação efetiva (todas as empresas).")
                .fonteDados(List.of("Candidaturas", "Contracts"))
                .formula("(número de contratos gerados / número total de candidaturas) * 100")
                .valor(valor)
                .unidade("%")
                .meta(meta)
                .metaDescricao("Meta mínima de " + meta + "% para garantir que os matches evoluam para contratação.")
                .detalhes(detalhes)
                .observacoes(observacoes)
                .build();
    }

    private PerformanceIndicatorDto buildAverageHiringTimeIndicatorForAdmin(Long adminUserId, LocalDateTime since) {
        // Buscar todos os contratos efetivos (de todas as empresas) e filtrar por período
        List<Contract> contratos = contractRepository.findByStatusIn(EFFECTIVE_CONTRACT_STATUSES);
        List<Double> temposDias = contratos.stream()
                .filter(contrato -> contrato.getVaga() != null && contrato.getVaga().getPostedDate() != null && contrato.getStartedAt() != null)
                .filter(contrato -> contrato.getStartedAt() != null && !contrato.getStartedAt().isBefore(since))
                .mapToDouble(contrato -> {
                    Duration duracao = Duration.between(contrato.getVaga().getPostedDate(), contrato.getStartedAt());
                    double dias = duracao.toHours() / 24d;
                    return Math.max(0d, dias);
                })
                .boxed()
                .sorted()
                .toList();
        
        double mediaDias = temposDias.stream().mapToDouble(Double::doubleValue).average().orElse(0d);
        double medianaDias = 0d;
        double tempoMinimo = temposDias.isEmpty() ? 0d : temposDias.get(0);
        double tempoMaximo = temposDias.isEmpty() ? 0d : temposDias.get(temposDias.size() - 1);
        
        if (!temposDias.isEmpty()) {
            int meio = temposDias.size() / 2;
            if (temposDias.size() % 2 == 0) {
                medianaDias = (temposDias.get(meio - 1) + temposDias.get(meio)) / 2d;
            } else {
                medianaDias = temposDias.get(meio);
            }
        }
        
        Map<String, Long> contratosPorTipo = contratos.stream()
                .filter(c -> c.getStartedAt() != null && !c.getStartedAt().isBefore(since))
                .collect(Collectors.groupingBy(
                        c -> c.getContractType() != null ? c.getContractType().toString() : "N/A",
                        Collectors.counting()
                ));
        
        double meta = getTargetValue(adminUserId, "average-hiring-time", DEFAULT_AVERAGE_HIRING_TIME);

        Map<String, Object> detalhes = new LinkedHashMap<>();
        detalhes.put("contratosConsiderados", temposDias.size());
        detalhes.put("mediaDias", round(mediaDias));
        detalhes.put("medianaDias", round(medianaDias));
        detalhes.put("tempoMinimo", round(tempoMinimo));
        detalhes.put("tempoMaximo", round(tempoMaximo));
        detalhes.put("contratosPorTipo", contratosPorTipo);
        detalhes.put("janelaAnalise", "Contratos ativos e finalizados (todas as empresas)");
        detalhes.put("escopo", "Todas as empresas da plataforma");

        return PerformanceIndicatorDto.builder()
                .id("average-hiring-time")
                .indicador("Tempo médio de contratação")
                .objetivo("Reduzir o tempo entre a abertura da vaga e a contratação do desenvolvedor")
                .descricao("Média de dias entre a data de criação da vaga e a data de início do contrato (todas as empresas).")
                .fonteDados(List.of("Vagas", "Contracts"))
                .formula("soma(data_contratacao - data_abertura_vaga) / número total de contratações")
                .valor(round(mediaDias))
                .unidade("dias")
                .meta(meta)
                .metaDescricao("Manter o ciclo de contratação abaixo de " + meta + " dias.")
                .detalhes(detalhes)
                .observacoes("Considera apenas contratos cujo status está ativo ou finalizado e que possuem datas preenchidas (todas as empresas).")
                .build();
    }

    private PerformanceIndicatorDto buildEngagementIndicatorForAdmin(Long adminUserId, LocalDateTime since, int periodDays) {
        // Contar devs que se candidataram no período (todas as empresas)
        long devsEngajados = candidaturaRepository.countDistinctUsuariosAtivosDesde(since);
        // Total de devs ativos na plataforma
        long devsAtivos = usuarioRepository.countByTipoIgnoreCaseAndPerfilCompletoTrue("dev");
        double taxa = devsAtivos == 0 ? 0d : (devsEngajados / (double) devsAtivos) * 100d;
        double meta = getTargetValue(adminUserId, "developer-engagement-rate", DEFAULT_DEVELOPER_ENGAGEMENT_RATE);

        Map<String, Object> detalhes = new LinkedHashMap<>();
        detalhes.put("desenvolvedoresAtivos", devsAtivos);
        detalhes.put("desenvolvedoresComCandidaturaNoPeriodo", devsEngajados);
        detalhes.put("janelaDias", periodDays);
        detalhes.put("escopo", "Todas as empresas da plataforma");

        return PerformanceIndicatorDto.builder()
                .id("developer-engagement-rate")
                .indicador("Taxa de engajamento dos desenvolvedores")
                .objetivo("Acompanhar o engajamento dos devs com as oportunidades disponíveis na plataforma")
                .descricao("Percentual de desenvolvedores ativos que se candidataram a pelo menos uma vaga no período (todas as empresas).")
                .fonteDados(List.of("Usuários", "Candidaturas"))
                .formula("(devs com candidatura no período / devs ativos no período) * 100")
                .valor(round(taxa))
                .unidade("%")
                .meta(meta)
                .metaDescricao("Manter ao menos " + meta + "% da base ativa engajada em oportunidades.")
                .detalhes(detalhes)
                .observacoes("Considera desenvolvedores com perfil completo como base ativa e candidaturas a vagas de todas as empresas.")
                .build();
    }

    private PerformanceIndicatorDto buildSatisfactionIndicatorForAdmin(Long adminUserId, LocalDateTime since) {
        // Buscar todos os contratos efetivos (de todas as empresas)
        List<Contract> contratos = contractRepository.findByStatusIn(EFFECTIVE_CONTRACT_STATUSES);
        List<Long> contractIds = contratos.stream().map(Contract::getId).toList();
        
        // Buscar todos os feedbacks e filtrar por período
        List<Feedback> allFeedbacks = feedbackRepository.findAll();
        List<Feedback> feedbacks = allFeedbacks.stream()
                .filter(f -> f.getDataAvaliacao() != null && !f.getDataAvaliacao().isBefore(since))
                .filter(f -> contractIds.contains(f.getProjectId()))
                .toList();
        
        // Separar feedbacks da empresa sobre devs e feedbacks de devs sobre a empresa
        List<Feedback> feedbacksEmpresaParaDev = feedbacks.stream()
                .filter(f -> f.getRatedRole() != null && f.getRatedRole().toString().equals("DEVELOPER"))
                .toList();
        List<Feedback> feedbacksDevParaEmpresa = feedbacks.stream()
                .filter(f -> f.getRatedRole() != null && f.getRatedRole().toString().equals("COMPANY"))
                .toList();
        
        // Calcular médias gerais e por critério
        double mediaGeral = feedbacks.stream()
                .mapToDouble(feedback ->
                        (feedback.getQualidadeTecnica()
                         + feedback.getCumprimentoPrazos()
                         + feedback.getComunicacao()
                         + feedback.getColaboracao()) / 4d
                )
                .average()
                .orElse(0d);
        
        double mediaEmpresaParaDev = feedbacksEmpresaParaDev.stream()
                .mapToDouble(f -> (f.getQualidadeTecnica() + f.getCumprimentoPrazos() + f.getComunicacao() + f.getColaboracao()) / 4d)
                .average()
                .orElse(0d);
        
        double mediaDevParaEmpresa = feedbacksDevParaEmpresa.stream()
                .mapToDouble(f -> (f.getQualidadeTecnica() + f.getCumprimentoPrazos() + f.getComunicacao() + f.getColaboracao()) / 4d)
                .average()
                .orElse(0d);
        
        // Médias por critério
        double mediaQualidadeTecnica = feedbacks.stream()
                .mapToDouble(Feedback::getQualidadeTecnica)
                .average()
                .orElse(0d);
        double mediaCumprimentoPrazos = feedbacks.stream()
                .mapToDouble(Feedback::getCumprimentoPrazos)
                .average()
                .orElse(0d);
        double mediaComunicacao = feedbacks.stream()
                .mapToDouble(Feedback::getComunicacao)
                .average()
                .orElse(0d);
        double mediaColaboracao = feedbacks.stream()
                .mapToDouble(Feedback::getColaboracao)
                .average()
                .orElse(0d);
        
        double meta = getTargetValue(adminUserId, "post-hiring-satisfaction", DEFAULT_POST_HIRING_SATISFACTION);

        Map<String, Object> detalhes = new LinkedHashMap<>();
        detalhes.put("avaliacoesConsideradas", feedbacks.size());
        detalhes.put("avaliacoesEmpresaParaDev", feedbacksEmpresaParaDev.size());
        detalhes.put("avaliacoesDevParaEmpresa", feedbacksDevParaEmpresa.size());
        detalhes.put("mediaGeral", round(mediaGeral));
        detalhes.put("mediaEmpresaParaDev", round(mediaEmpresaParaDev));
        detalhes.put("mediaDevParaEmpresa", round(mediaDevParaEmpresa));
        detalhes.put("mediaQualidadeTecnica", round(mediaQualidadeTecnica));
        detalhes.put("mediaCumprimentoPrazos", round(mediaCumprimentoPrazos));
        detalhes.put("mediaComunicacao", round(mediaComunicacao));
        detalhes.put("mediaColaboracao", round(mediaColaboracao));
        detalhes.put("pontuacaoNormalizada", round(mediaGeral == 0 ? 0d : (mediaGeral / 5d) * 100d));
        detalhes.put("escopo", "Todas as empresas da plataforma");

        return PerformanceIndicatorDto.builder()
                .id("post-hiring-satisfaction")
                .indicador("Índice de satisfação pós-contratação")
                .objetivo("Avaliar a qualidade percebida após a contratação, tanto por empresas quanto por devs")
                .descricao("Média das avaliações dadas em contratos concluídos ou ativos (todas as empresas).")
                .fonteDados(List.of("Contratacoes", "Avaliacoes"))
                .formula("soma das notas das avaliações / número total de avaliações registradas")
                .valor(round(mediaGeral))
                .unidade("pt")
                .meta(meta)
                .metaDescricao("Operar com média igual ou superior a " + meta + " pontos.")
                .detalhes(detalhes)
                .observacoes("Calcula a média simples dos quatro critérios do formulário de feedback (escala 1-5) para todas as empresas.")
                .build();
    }
}



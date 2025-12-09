package com.example.devmatch.job_posting_backend.service;

import com.example.devmatch.job_posting_backend.dto.JobMatchDto;
import com.example.devmatch.job_posting_backend.entity.JobPosting;
import com.example.devmatch.job_posting_backend.entity.PerfilDev;
import com.example.devmatch.job_posting_backend.repository.JobPostingRepository;
import com.example.devmatch.job_posting_backend.repository.PerfilDevRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Serviço responsável pelo cálculo de compatibilidade entre vagas e desenvolvedores
 */
@Service
public class MatchingService {
    
    @Autowired
    private JobPostingRepository jobPostingRepository;
    
    @Autowired
    private PerfilDevRepository perfilDevRepository;
    
    @Autowired
    private JobPostingService jobPostingService;
    
    /**
     * Calcula vagas compatíveis para um desenvolvedor
     * @param usuarioId ID do desenvolvedor
     * @return Lista de vagas com percentual de compatibilidade
     */
    public List<JobMatchDto> getVagasCompativeis(Long usuarioId) {
        // Busca o perfil do desenvolvedor
        PerfilDev perfil = perfilDevRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new RuntimeException("Perfil não encontrado"));
        
        // Busca todas as vagas ativas
        List<JobPosting> vagasAtivas = jobPostingRepository.findAll().stream()
                .filter(vaga -> "ativa".equalsIgnoreCase(vaga.getStatus()))
                .collect(Collectors.toList());
        
        // Calcula compatibilidade para cada vaga
        List<JobMatchDto> matches = new ArrayList<>();
        for (JobPosting vaga : vagasAtivas) {
            // Cria objeto para armazenar detalhes do matching
            JobMatchDto.MatchingDetails details = new JobMatchDto.MatchingDetails();
            double compatibilidade = calcularCompatibilidadeDetalhada(perfil, vaga, details);
            
            // Apenas vagas com 60% ou mais de compatibilidade
            if (compatibilidade >= 60.0) {
                JobMatchDto match = new JobMatchDto();
                match.setVagaId(vaga.getId());
                match.setTitulo(vaga.getTitle());
                match.setDescricao(vaga.getDescription());
                match.setExperienceLevel(vaga.getExperienceLevel());
                match.setLocalModalidade(vaga.getLocalModalidade());
                match.setValorReferencia(vaga.getValorReferencia());
                match.setRegime(vaga.getRegime());
                match.setCompatibilidade(compatibilidade);
                match.setMatchingDetails(details); // Adiciona detalhes do matching
                
                // Busca o nome da empresa
                String nomeEmpresa = jobPostingService.getNomeEmpresaByUsuarioId(vaga.getUsuarioId());
                match.setNomeEmpresa(nomeEmpresa);
                
                // Adiciona skills da vaga
                if (vaga.getSkills() != null) {
                    match.setSkills(vaga.getSkills().stream()
                            .map(skill -> skill.getSkill())
                            .collect(Collectors.toList()));
                }
                
                matches.add(match);
            }
        }
        
        // Ordena por compatibilidade (maior primeiro)
        matches.sort((a, b) -> Double.compare(b.getCompatibilidade(), a.getCompatibilidade()));
        
        return matches;
    }
    
    /**
     * Calcula compatibilidade de um candidato específico com uma vaga específica
     * @param desenvolvedorId ID do desenvolvedor
     * @param vagaId ID da vaga
     * @return Percentual de compatibilidade (0-100)
     */
    public double calcularCompatibilidadeCandidato(Long desenvolvedorId, Long vagaId) {
        // Busca o perfil do desenvolvedor
        PerfilDev perfil = perfilDevRepository.findByUsuarioId(desenvolvedorId)
                .orElseThrow(() -> new RuntimeException("Perfil não encontrado"));
        
        // Busca a vaga
        JobPosting vaga = jobPostingRepository.findById(vagaId)
                .orElseThrow(() -> new RuntimeException("Vaga não encontrada"));
        
        // Calcula compatibilidade
        return calcularCompatibilidade(perfil, vaga);
    }
    
    /**
     * Calcula o percentual de compatibilidade entre um perfil e uma vaga
     * @param perfil Perfil do desenvolvedor
     * @param vaga Vaga a ser analisada
     * @return Percentual de compatibilidade (0-100)
     */
    private double calcularCompatibilidade(PerfilDev perfil, JobPosting vaga) {
        return calcularCompatibilidadeDetalhada(perfil, vaga, null);
    }
    
    /**
     * Calcula compatibilidade com detalhes
     * @param perfil Perfil do desenvolvedor
     * @param vaga Vaga a ser analisada
     * @param details Objeto para armazenar detalhes do matching (opcional)
     * @return Percentual de compatibilidade (0-100)
     */
    private double calcularCompatibilidadeDetalhada(PerfilDev perfil, JobPosting vaga, JobMatchDto.MatchingDetails details) {
        double pontuacao = 0.0;
        double pesoTotal = 0.0;
        
        // 1. LOCALIZAÇÃO/MODALIDADE (Peso: 20%)
        double pesoLocalizacao = 20.0;
        pesoTotal += pesoLocalizacao;
        double pontuacaoLocalizacao = pesoLocalizacao * 0.5; // Valor padrão neutro
        
        if (vaga.getLocalModalidade() != null && perfil.getModoTrabalho() != null) {
            String vagaModalidade = vaga.getLocalModalidade().toLowerCase();
            String perfilModalidade = perfil.getModoTrabalho().toLowerCase();
            
            // Remoto é compatível com todos
            if (vagaModalidade.contains("remoto") || perfilModalidade.contains("remoto")) {
                pontuacaoLocalizacao = pesoLocalizacao;
                if (details != null) {
                    details.getMotivosPositivos().add("Modalidade de trabalho compatível (remoto)");
                }
            }
            // Híbrido é parcialmente compatível
            else if (vagaModalidade.contains("híbrido") || perfilModalidade.contains("híbrido")) {
                pontuacaoLocalizacao = pesoLocalizacao * 0.7;
                if (details != null) {
                    details.getMotivosPositivos().add("Modalidade híbrida oferece flexibilidade");
                }
            }
            // Presencial precisa de match exato de localização
            else if (vagaModalidade.contains("presencial") && perfilModalidade.contains("presencial")) {
                // Verifica se a localização é similar
                if (perfil.getLocalizacao() != null && 
                    perfil.getLocalizacao().toLowerCase().contains(vaga.getLocalModalidade().toLowerCase())) {
                    pontuacaoLocalizacao = pesoLocalizacao;
                    if (details != null) {
                        details.getMotivosPositivos().add("Localização é compatível");
                    }
                } else {
                    pontuacaoLocalizacao = pesoLocalizacao * 0.3;
                    if (details != null) {
                        details.getSugestoesMelhoria().add("Considere vagas remotas ou híbridas para ampliar suas opções");
                    }
                }
            } else {
                pontuacaoLocalizacao = pesoLocalizacao * 0.4;
            }
        } else if (details != null) {
            details.getSugestoesMelhoria().add("Complete suas preferências de modalidade de trabalho no perfil");
        }
        pontuacao += pontuacaoLocalizacao;
        if (details != null) {
            details.setScoreLocalizacao((pontuacaoLocalizacao / pesoLocalizacao) * 100);
        }
        
        // 2. FAIXA SALARIAL (Peso: 25%)
        double pesoSalario = 25.0;
        pesoTotal += pesoSalario;
        double pontuacaoSalario = pesoSalario * 0.5; // Valor padrão neutro
        
        if (vaga.getValorReferencia() != null && perfil.getFaixaSalarial() != null) {
            // Extrai valores numéricos das faixas (simplificado)
            String vagaSalario = vaga.getValorReferencia().toLowerCase();
            String perfilSalario = perfil.getFaixaSalarial().toLowerCase();
            
            // Se ambos têm valores, considera compatível se houver overlap
            // Simplificação: se os textos são similares ou "a combinar"
            if (vagaSalario.contains("combinar") || perfilSalario.contains("combinar")) {
                pontuacaoSalario = pesoSalario * 0.8;
                if (details != null) {
                    details.getMotivosPositivos().add("Faixa salarial a combinar oferece flexibilidade");
                }
            } else {
                // Calcula overlap de faixas salariais
                double overlapSalarial = calcularOverlapSalarial(vagaSalario, perfilSalario);
                pontuacaoSalario = pesoSalario * overlapSalarial;
                if (details != null && overlapSalarial > 0.7) {
                    details.getMotivosPositivos().add("Faixa salarial alinhada com suas expectativas");
                } else if (details != null && overlapSalarial < 0.5) {
                    details.getSugestoesMelhoria().add("Verifique se a faixa salarial atende suas expectativas");
                }
            }
        } else if (details != null) {
            if (perfil.getFaixaSalarial() == null) {
                details.getSugestoesMelhoria().add("Adicione sua expectativa salarial no perfil para melhorar o matching");
            }
        }
        pontuacao += pontuacaoSalario;
        if (details != null) {
            details.setScoreSalario((pontuacaoSalario / pesoSalario) * 100);
        }
        
        // 3. TIPO DE CONTRATO (Peso: 15%)
        double pesoContrato = 15.0;
        pesoTotal += pesoContrato;
        double pontuacaoContrato = 0.0; // Inicializa como 0, será calculado
        
        if (vaga.getRegime() != null && perfil.getTipoContrato() != null) {
            // Normaliza strings: lowercase, trim, remove espaços extras
            String vagaRegime = normalizarString(vaga.getRegime());
            String perfilContrato = normalizarString(perfil.getTipoContrato());
            
            // Match exato (comparação direta após normalização) - SEMPRE dá 100%
            if (vagaRegime.equals(perfilContrato)) {
                pontuacaoContrato = pesoContrato; // 100% do peso (15 pontos)
                if (details != null) {
                    details.getMotivosPositivos().add("Tipo de contrato corresponde à sua preferência (" + vaga.getRegime() + ")");
                }
            } 
            // Match usando contains (para casos como "PJ - Pessoa Jurídica" ou variações)
            else if (vagaRegime.contains("pj") && perfilContrato.contains("pj") && 
                     !vagaRegime.contains("clt") && !perfilContrato.contains("clt")) {
                pontuacaoContrato = pesoContrato; // 100% do peso
                if (details != null) {
                    details.getMotivosPositivos().add("Tipo de contrato compatível (PJ)");
                }
            }
            else if (vagaRegime.contains("clt") && perfilContrato.contains("clt") && 
                     !vagaRegime.contains("pj") && !perfilContrato.contains("pj")) {
                pontuacaoContrato = pesoContrato; // 100% do peso
                if (details != null) {
                    details.getMotivosPositivos().add("Tipo de contrato compatível (CLT)");
                }
            }
            // Match para "Cooperado"
            else if (vagaRegime.contains("cooperado") && perfilContrato.contains("cooperado")) {
                pontuacaoContrato = pesoContrato; // 100% do peso
                if (details != null) {
                    details.getMotivosPositivos().add("Tipo de contrato compatível (Cooperado)");
                }
            }
            // Match para "Contrato" (sem ser Cooperado)
            else if (vagaRegime.contains("contrato") && perfilContrato.contains("contrato") && 
                     !vagaRegime.contains("cooperado") && !perfilContrato.contains("cooperado")) {
                pontuacaoContrato = pesoContrato; // 100% do peso
                if (details != null) {
                    details.getMotivosPositivos().add("Tipo de contrato compatível (Contrato)");
                }
            }
            // Match parcial: PJ e Freelancer são similares
            else if ((vagaRegime.contains("pj") && (perfilContrato.contains("freelance") || perfilContrato.contains("freelancer"))) ||
                     ((vagaRegime.contains("freelance") || vagaRegime.contains("freelancer")) && perfilContrato.contains("pj"))) {
                pontuacaoContrato = pesoContrato * 0.8; // 80% do peso
                if (details != null) {
                    details.getMotivosPositivos().add("Tipo de contrato similar (PJ/Freelancer)");
                }
            } 
            // Sem match - penalização
            else {
                pontuacaoContrato = pesoContrato * 0.3; // 30% do peso
                if (details != null) {
                    details.getSugestoesMelhoria().add("Tipo de contrato da vaga (" + vaga.getRegime() + ") difere da sua preferência (" + perfil.getTipoContrato() + ")");
                }
            }
        } else {
            // Se algum valor for null, dá pontuação neutra (50%)
            pontuacaoContrato = pesoContrato * 0.5;
            if (details != null) {
                if (perfil.getTipoContrato() == null) {
                    details.getSugestoesMelhoria().add("Defina seu tipo de contrato preferido no perfil para melhorar o matching");
                }
                if (vaga.getRegime() == null) {
                    // Vaga sem regime definido - não penaliza muito
                    pontuacaoContrato = pesoContrato * 0.7;
                }
            }
        }
        pontuacao += pontuacaoContrato;
        if (details != null) {
            details.setScoreContrato((pontuacaoContrato / pesoContrato) * 100);
        }
        
        // 4. PREFERÊNCIAS DE VAGA (Peso: 15%)
        double pesoPreferencias = 15.0;
        pesoTotal += pesoPreferencias;
        double pontuacaoPreferencias = pesoPreferencias * 0.5; // Valor padrão neutro
        
        if (perfil.getPreferenciasVaga() != null && perfil.getPreferenciasVaga().length > 0) {
            String tituloVaga = vaga.getTitle() != null ? vaga.getTitle().toLowerCase() : "";
            boolean temMatch = false;
            
            for (String preferencia : perfil.getPreferenciasVaga()) {
                String pref = preferencia.toLowerCase();
                if (tituloVaga.contains(pref) || 
                    (pref.contains("full") && tituloVaga.contains("full")) ||
                    (pref.contains("front") && tituloVaga.contains("front")) ||
                    (pref.contains("back") && tituloVaga.contains("back"))) {
                    temMatch = true;
                    if (details != null) {
                        details.getMotivosPositivos().add("Vaga alinhada com suas preferências: " + preferencia);
                    }
                    break;
                }
            }
            
            if (temMatch) {
                pontuacaoPreferencias = pesoPreferencias;
            } else {
                pontuacaoPreferencias = pesoPreferencias * 0.4;
            }
        } else if (details != null) {
            details.getSugestoesMelhoria().add("Adicione suas preferências de vaga no perfil");
        }
        pontuacao += pontuacaoPreferencias;
        if (details != null) {
            details.setScorePreferencias((pontuacaoPreferencias / pesoPreferencias) * 100);
        }
        
        // 5. HABILIDADES/SKILLS (Peso: 25%) - MAIS IMPORTANTE
        double pesoSkills = 25.0;
        pesoTotal += pesoSkills;
        double pontuacaoSkills = pesoSkills * 0.5; // Valor padrão neutro
        
        if (vaga.getSkills() != null && !vaga.getSkills().isEmpty()) {
            // Busca as skills requeridas pela vaga
            List<String> vagaSkills = vaga.getSkills().stream()
                    .map(skill -> skill.getSkill().toLowerCase())
                    .collect(Collectors.toList());
            
            // Busca as skills do desenvolvedor da tabela habilidades
            List<String> perfilSkills = perfil.getHabilidades() != null ? 
                    perfil.getHabilidades().stream()
                            .map(h -> h.getHabilidade().toLowerCase())
                            .collect(Collectors.toList()) 
                    : new ArrayList<>();
            
            int skillsMatch = 0;
            List<String> skillsEncontradas = new ArrayList<>();
            List<String> skillsNaoEncontradas = new ArrayList<>();
            
            for (String skill : vagaSkills) {
                boolean encontrada = perfilSkills.contains(skill);
                if (encontrada) {
                    skillsMatch++;
                    skillsEncontradas.add(skill);
                } else {
                    skillsNaoEncontradas.add(skill);
                }
            }
            
            double percentualSkills = vagaSkills.isEmpty() ? 0.5 : 
                    (double) skillsMatch / vagaSkills.size();
            
            pontuacaoSkills = pesoSkills * Math.min(1.0, percentualSkills + 0.2);
            
            // Popula detalhes das skills
            if (details != null) {
                details.setSkillsEmComum(skillsEncontradas);
                details.setSkillsFaltantes(skillsNaoEncontradas);
                
                if (!skillsEncontradas.isEmpty()) {
                    details.getMotivosPositivos().add("Você possui " + skillsEncontradas.size() + 
                        " de " + vagaSkills.size() + " habilidades requeridas");
                } else if (!skillsNaoEncontradas.isEmpty()) {
                    details.getSugestoesMelhoria().add("Considere adicionar as habilidades requeridas ao seu perfil");
                }
                
                if (!skillsNaoEncontradas.isEmpty() && skillsNaoEncontradas.size() <= 3) {
                    details.getSugestoesMelhoria().add("Considere aprender: " + 
                        String.join(", ", skillsNaoEncontradas.subList(0, Math.min(3, skillsNaoEncontradas.size()))));
                }
            }
        } else if (details != null) {
            // Se não há skills na vaga, dá pontuação neutra
            pontuacaoSkills = pesoSkills * 0.5;
        }
        pontuacao += pontuacaoSkills;
        if (details != null) {
            details.setScoreSkills((pontuacaoSkills / pesoSkills) * 100);
        }
        
        // Calcula percentual final
        return (pontuacao / pesoTotal) * 100.0;
    }
    
    /**
     * Calcula o overlap entre duas faixas salariais
     * @param faixa1 Primeira faixa salarial
     * @param faixa2 Segunda faixa salarial
     * @return Percentual de overlap (0-1)
     */
    private double calcularOverlapSalarial(String faixa1, String faixa2) {
        try {
            // Extrai números das strings
            String[] valores1 = faixa1.replaceAll("[^0-9-]", "").split("-");
            String[] valores2 = faixa2.replaceAll("[^0-9-]", "").split("-");
            
            if (valores1.length >= 2 && valores2.length >= 2) {
                int min1 = Integer.parseInt(valores1[0].trim());
                int max1 = Integer.parseInt(valores1[1].trim());
                int min2 = Integer.parseInt(valores2[0].trim());
                int max2 = Integer.parseInt(valores2[1].trim());
                
                // Calcula overlap
                int overlapMin = Math.max(min1, min2);
                int overlapMax = Math.min(max1, max2);
                
                if (overlapMax > overlapMin) {
                    int overlapRange = overlapMax - overlapMin;
                    int totalRange = Math.max(max1, max2) - Math.min(min1, min2);
                    return (double) overlapRange / totalRange;
                }
            }
        } catch (Exception e) {
            // Se não conseguir parsear, retorna valor neutro
            return 0.5;
        }
        
        return 0.3; // Baixa compatibilidade se não houver overlap
    }
    
    /**
     * Normaliza uma string para comparação (lowercase, trim, remove espaços extras)
     * @param str String a ser normalizada
     * @return String normalizada
     */
    private String normalizarString(String str) {
        if (str == null) {
            return "";
        }
        // Normaliza: lowercase, trim, remove múltiplos espaços, remove caracteres especiais
        // Remove apenas caracteres não alfanuméricos (mantém letras e números)
        String normalized = str.toLowerCase().trim().replaceAll("\\s+", " ");
        // Remove caracteres especiais mas mantém letras acentuadas normalizadas
        normalized = normalized.replaceAll("[^a-z0-9]", "").trim();
        return normalized;
    }
}


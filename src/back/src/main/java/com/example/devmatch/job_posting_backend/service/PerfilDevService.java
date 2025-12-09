package com.example.devmatch.job_posting_backend.service;

import com.example.devmatch.job_posting_backend.dto.PerfilDevDto;
import com.example.devmatch.job_posting_backend.entity.PerfilDev;
import com.example.devmatch.job_posting_backend.repository.PerfilDevRepository;
import com.example.devmatch.job_posting_backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

/**
 * Service responsável pela lógica de negócio de perfis de desenvolvedores
 */
@Service
public class PerfilDevService {
    
    @Autowired
    private PerfilDevRepository perfilDevRepository;
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    /**
     * Cria um novo perfil de desenvolvedor
     * @param perfilDto Dados do perfil a ser criado
     * @return PerfilDevDto com dados do perfil criado
     * @throws RuntimeException se usuário não existir ou já tiver perfil
     */
    public PerfilDevDto criarPerfil(PerfilDevDto perfilDto) {
        // Verifica se o usuário existe
        if (!usuarioRepository.existsById(perfilDto.getUsuarioId())) {
            throw new RuntimeException("Usuário não encontrado.");
        }
        
        // Verifica se o usuário já possui perfil
        if (perfilDevRepository.existsByUsuarioId(perfilDto.getUsuarioId())) {
            throw new RuntimeException("Este usuário já possui um perfil. Use a opção de atualizar.");
        }
        
        // Converte DTO para entidade
        PerfilDev perfil = perfilDto.toEntity();
        perfil.setDataAtualizacao(LocalDateTime.now());
        perfil.setPerfilCompleto(isPerfilCompleto(perfil));
        
        // Salva no banco
        PerfilDev perfilSalvo = perfilDevRepository.save(perfil);
        
        return PerfilDevDto.fromEntity(perfilSalvo);
    }
    
    /**
     * Atualiza um perfil de desenvolvedor existente
     * @param usuarioId ID do usuário dono do perfil
     * @param perfilDto Dados atualizados do perfil
     * @return PerfilDevDto com dados do perfil atualizado
     * @throws RuntimeException se perfil não existir
     */
    public PerfilDevDto atualizarPerfil(Long usuarioId, PerfilDevDto perfilDto) {
        // Busca o perfil existente
        PerfilDev perfilExistente = perfilDevRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new RuntimeException("Perfil não encontrado. Crie um perfil primeiro."));
        
        // Atualiza os campos
        if (perfilDto.getTitular() != null) {
            perfilExistente.setTitular(perfilDto.getTitular());
        }
        if (perfilDto.getResumo() != null) {
            perfilExistente.setResumo(perfilDto.getResumo());
        }
        if (perfilDto.getLocalizacao() != null) {
            perfilExistente.setLocalizacao(perfilDto.getLocalizacao());
        }
        if (perfilDto.getGithub() != null) {
            perfilExistente.setGithub(perfilDto.getGithub());
        }
        if (perfilDto.getLinkedin() != null) {
            perfilExistente.setLinkedin(perfilDto.getLinkedin());
        }
        if (perfilDto.getPortfolio() != null) {
            perfilExistente.setPortfolio(perfilDto.getPortfolio());
        }
        if (perfilDto.getFaixaSalarial() != null) {
            perfilExistente.setFaixaSalarial(perfilDto.getFaixaSalarial());
        }
        if (perfilDto.getTipoContrato() != null) {
            perfilExistente.setTipoContrato(perfilDto.getTipoContrato());
        }
        if (perfilDto.getModoTrabalho() != null) {
            perfilExistente.setModoTrabalho(perfilDto.getModoTrabalho());
        }
        if (perfilDto.getDisponibilidade() != null) {
            perfilExistente.setDisponibilidade(perfilDto.getDisponibilidade());
        }
        if (perfilDto.getPreferenciasVaga() != null) {
            perfilExistente.setPreferenciasVaga(perfilDto.getPreferenciasVaga());
        }
        if (perfilDto.getIdiomas() != null) {
            perfilExistente.setIdiomas(perfilDto.getIdiomas());
        }
        
        // Atualiza habilidades se fornecidas
        if (perfilDto.getHabilidades() != null) {
            // Remove habilidades antigas
            perfilExistente.getHabilidades().clear();
            
            // Adiciona novas habilidades
            perfilDto.getHabilidades().forEach(habDto -> {
                var habilidade = habDto.toEntity();
                habilidade.setPerfilDev(perfilExistente);
                perfilExistente.getHabilidades().add(habilidade);
            });
        }
        
        // Atualiza certificações se fornecidas
        if (perfilDto.getCertificacoes() != null) {
            // Remove certificações antigas
            perfilExistente.getCertificacoes().clear();
            
            // Adiciona novas certificações
            perfilDto.getCertificacoes().forEach(certDto -> {
                var certificacao = certDto.toEntity();
                certificacao.setPerfilDev(perfilExistente);
                perfilExistente.getCertificacoes().add(certificacao);
            });
        }
        
        // Atualiza experiências se fornecidas
        if (perfilDto.getExperiencias() != null) {
            // Remove experiências antigas
            perfilExistente.getExperiencias().clear();
            
            // Adiciona novas experiências
            perfilDto.getExperiencias().forEach(expDto -> {
                var experiencia = expDto.toEntity();
                experiencia.setPerfilDev(perfilExistente);
                perfilExistente.getExperiencias().add(experiencia);
            });
        }
        
        // Atualiza formações se fornecidas
        if (perfilDto.getFormacoes() != null) {
            // Remove formações antigas
            perfilExistente.getFormacoes().clear();
            
            // Adiciona novas formações
            perfilDto.getFormacoes().forEach(formDto -> {
                var formacao = formDto.toEntity();
                formacao.setPerfilDev(perfilExistente);
                perfilExistente.getFormacoes().add(formacao);
            });
        }
        
        // Atualiza projetos se fornecidos
        if (perfilDto.getProjetos() != null) {
            // Remove projetos antigos
            perfilExistente.getProjetos().clear();
            
            // Adiciona novos projetos
            perfilDto.getProjetos().forEach(projDto -> {
                var projeto = projDto.toEntity();
                projeto.setPerfilDev(perfilExistente);
                perfilExistente.getProjetos().add(projeto);
            });
        }
        
        perfilExistente.setDataAtualizacao(LocalDateTime.now());
        perfilExistente.setPerfilCompleto(isPerfilCompleto(perfilExistente));
        
        // Salva as alterações
        PerfilDev perfilAtualizado = perfilDevRepository.save(perfilExistente);
        
        return PerfilDevDto.fromEntity(perfilAtualizado);
    }
    
    /**
     * Busca o perfil de um desenvolvedor pelo ID do usuário
     * @param usuarioId ID do usuário
     * @return PerfilDevDto com dados do perfil
     * @throws RuntimeException se perfil não existir
     */
    public PerfilDevDto buscarPorUsuarioId(Long usuarioId) {
        PerfilDev perfil = perfilDevRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new RuntimeException("Perfil não encontrado."));
        
        return PerfilDevDto.fromEntity(perfil);
    }
    
    /**
     * Verifica se o perfil possui as informações mínimas necessárias
     * @param perfil Perfil a ser verificado
     * @return true se o perfil está completo, false caso contrário
     */
    private boolean isPerfilCompleto(PerfilDev perfil) {
        return perfil.getTitular() != null && !perfil.getTitular().isEmpty() &&
               perfil.getResumo() != null && !perfil.getResumo().isEmpty() &&
               perfil.getLocalizacao() != null && !perfil.getLocalizacao().isEmpty();
    }
}


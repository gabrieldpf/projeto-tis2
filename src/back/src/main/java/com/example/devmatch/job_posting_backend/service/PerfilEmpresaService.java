package com.example.devmatch.job_posting_backend.service;

import com.example.devmatch.job_posting_backend.dto.PerfilEmpresaDto;
import com.example.devmatch.job_posting_backend.entity.PerfilEmpresa;
import com.example.devmatch.job_posting_backend.entity.Usuario;
import com.example.devmatch.job_posting_backend.repository.PerfilEmpresaRepository;
import com.example.devmatch.job_posting_backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PerfilEmpresaService {

    @Autowired
    private PerfilEmpresaRepository perfilEmpresaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Transactional
    public PerfilEmpresa criarOuAtualizar(Long usuarioId, PerfilEmpresaDto dto) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        PerfilEmpresa perfil = perfilEmpresaRepository.findByUsuarioId(usuarioId)
            .orElse(new PerfilEmpresa());

        perfil.setUsuario(usuario);
        perfil.setNomeEmpresa(dto.getNomeEmpresa());
        perfil.setDescricao(dto.getDescricao());
        perfil.setSetor(dto.getSetor());
        perfil.setTamanho(dto.getTamanho());
        perfil.setLocalizacao(dto.getLocalizacao());
        perfil.setAnoFundacao(dto.getAnoFundacao());
        perfil.setWebsite(dto.getWebsite());
        perfil.setLinkedin(dto.getLinkedin());
        perfil.setInstagram(dto.getInstagram());
        perfil.setFacebook(dto.getFacebook());
        perfil.setCultura(dto.getCultura());
        perfil.setBeneficios(dto.getBeneficios());
        perfil.setMissao(dto.getMissao());
        perfil.setVisao(dto.getVisao());
        perfil.setValores(dto.getValores());
        perfil.setLogoUrl(dto.getLogoUrl());

        PerfilEmpresa perfilSalvo = perfilEmpresaRepository.save(perfil);

        // Recarrega o perfil para garantir coleção de benefícios atualizada
        PerfilEmpresa perfilReload = perfilEmpresaRepository.findByUsuarioId(usuarioId)
            .orElse(perfilSalvo);

        // Bypass: marcar como completo após salvar (destrava onboarding)
        usuario.setPerfilCompleto(true);
        usuarioRepository.save(usuario);

        return perfilReload;
    }
    
    /**
     * Verifica se o perfil da empresa está completo
     * Campos obrigatórios: nome, descrição, setor, tamanho, localização, cultura e pelo menos 2 benefícios
     */
    private boolean verificarPerfilCompleto(PerfilEmpresa perfil) {
        if (perfil.getNomeEmpresa() == null || perfil.getNomeEmpresa().trim().isEmpty()) {
            return false;
        }
        if (perfil.getDescricao() == null || perfil.getDescricao().trim().length() < 10) {
            return false;
        }
        if (perfil.getSetor() == null || perfil.getSetor().trim().isEmpty()) {
            return false;
        }
        if (perfil.getTamanho() == null || perfil.getTamanho().trim().isEmpty()) {
            return false;
        }
        if (perfil.getLocalizacao() == null || perfil.getLocalizacao().trim().isEmpty()) {
            return false;
        }
        if (perfil.getCultura() == null || perfil.getCultura().trim().isEmpty()) {
            return false;
        }
        if (perfil.getBeneficios() == null || perfil.getBeneficios().size() < 2) {
            return false;
        }
        return true;
    }

    public PerfilEmpresa buscarPorUsuarioId(Long usuarioId) {
        return perfilEmpresaRepository.findByUsuarioId(usuarioId)
            .orElseThrow(() -> new RuntimeException("Perfil da empresa não encontrado"));
    }

    public boolean existePerfil(Long usuarioId) {
        return perfilEmpresaRepository.existsByUsuarioId(usuarioId);
    }
    
    /**
     * Verifica se o perfil da empresa está completo (público)
     */
    public boolean isPerfilCompleto(Long usuarioId) {
        try {
            PerfilEmpresa perfil = buscarPorUsuarioId(usuarioId);
            return verificarPerfilCompleto(perfil);
        } catch (RuntimeException e) {
            return false;
        }
    }
}


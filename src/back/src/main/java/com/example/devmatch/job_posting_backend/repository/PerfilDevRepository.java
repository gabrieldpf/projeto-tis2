package com.example.devmatch.job_posting_backend.repository;

import com.example.devmatch.job_posting_backend.entity.PerfilDev;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository para acesso aos dados de perfis de desenvolvedores
 */
@Repository
public interface PerfilDevRepository extends JpaRepository<PerfilDev, Long> {
    
    /**
     * Busca perfil de desenvolvedor pelo ID do usuário
     * @param usuarioId ID do usuário
     * @return Optional contendo o perfil se existir
     */
    Optional<PerfilDev> findByUsuarioId(Long usuarioId);
    
    /**
     * Verifica se já existe um perfil para o usuário
     * @param usuarioId ID do usuário
     * @return true se existir, false caso contrário
     */
    boolean existsByUsuarioId(Long usuarioId);
}


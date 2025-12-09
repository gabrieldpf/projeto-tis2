package com.example.devmatch.job_posting_backend.repository;

import com.example.devmatch.job_posting_backend.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repositório para acesso aos dados de usuários
 * Gerencia operações CRUD e consultas customizadas para a entidade Usuario
 */
@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    /**
     * Busca um usuário pelo email
     * @param email Email do usuário
     * @return Optional contendo o usuário se encontrado
     */
    Optional<Usuario> findByEmail(String email);
    
    /**
     * Verifica se existe um usuário com o email fornecido
     * @param email Email a ser verificado
     * @return true se existe, false caso contrário
     */
    boolean existsByEmail(String email);

    /**
     * Conta usuários por tipo (dev ou empresa)
     */
    long countByTipoIgnoreCase(String tipo);

    /**
     * Conta usuários de um tipo específico cujo perfil já foi completado
     */
    long countByTipoIgnoreCaseAndPerfilCompletoTrue(String tipo);
}


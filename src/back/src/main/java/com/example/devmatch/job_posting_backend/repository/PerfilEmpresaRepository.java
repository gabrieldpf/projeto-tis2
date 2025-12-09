package com.example.devmatch.job_posting_backend.repository;

import com.example.devmatch.job_posting_backend.entity.PerfilEmpresa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PerfilEmpresaRepository extends JpaRepository<PerfilEmpresa, Long> {
    Optional<PerfilEmpresa> findByUsuarioId(Long usuarioId);
    boolean existsByUsuarioId(Long usuarioId);
}


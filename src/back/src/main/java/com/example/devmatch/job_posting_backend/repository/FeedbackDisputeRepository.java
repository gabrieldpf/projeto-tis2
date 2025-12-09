package com.example.devmatch.job_posting_backend.repository;


import com.example.devmatch.job_posting_backend.entity.DisputeStatus;
import com.example.devmatch.job_posting_backend.entity.FeedbackDispute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FeedbackDisputeRepository extends JpaRepository<FeedbackDispute, Long> {

    long countByOpenedByUserIdAndStatus(Long openedByUserId, DisputeStatus status);

    List<FeedbackDispute> findByOpenedByUserId(Long openedByUserId);
    
    // Método para listar todas as disputas abertas (para administradores)
    // Usa JOIN FETCH para garantir que o Feedback seja carregado junto
    @Query("SELECT d FROM FeedbackDispute d JOIN FETCH d.feedback WHERE d.status = :status")
    List<FeedbackDispute> findByStatus(@Param("status") DisputeStatus status);
}


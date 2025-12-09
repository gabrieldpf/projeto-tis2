package com.example.devmatch.job_posting_backend.repository;

import com.example.devmatch.job_posting_backend.entity.Delivery;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DeliveryRepository extends JpaRepository<Delivery, Long> {
    List<Delivery> findByMilestoneId(Long milestoneId);
    List<Delivery> findByPerfilDevId(Long perfilDevId);
    List<Delivery> findByMilestoneIdAndReviewed(Long milestoneId, Boolean reviewed);
}

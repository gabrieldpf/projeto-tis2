package com.example.devmatch.job_posting_backend.service;

import com.example.devmatch.job_posting_backend.entity.Delivery;
import com.example.devmatch.job_posting_backend.entity.Milestone;
import com.example.devmatch.job_posting_backend.entity.PerfilDev;
import com.example.devmatch.job_posting_backend.repository.DeliveryRepository;
import com.example.devmatch.job_posting_backend.repository.MilestoneRepository;
import com.example.devmatch.job_posting_backend.repository.PerfilDevRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class DeliveryService {
    private final DeliveryRepository deliveryRepository;
    private final MilestoneRepository milestoneRepository;
    private final PerfilDevRepository perfilDevRepository;

    public DeliveryService(DeliveryRepository deliveryRepository, 
                          MilestoneRepository milestoneRepository, 
                          PerfilDevRepository perfilDevRepository) {
        this.deliveryRepository = deliveryRepository;
        this.milestoneRepository = milestoneRepository;
        this.perfilDevRepository = perfilDevRepository;
    }

    @Transactional
    public Delivery createDelivery(Long milestoneId, Long perfilDevId, Delivery delivery) {
        Optional<Milestone> m = milestoneRepository.findById(milestoneId);
        if (m.isEmpty()) throw new IllegalArgumentException("Milestone não encontrado");
        Optional<PerfilDev> p = perfilDevRepository.findById(perfilDevId);
        if (p.isEmpty()) throw new IllegalArgumentException("PerfilDev não encontrado");
        
        // Validação: descrição deve ter no mínimo 50 caracteres
        String descricao = delivery.getDescricaoEntrega() != null ? 
                          delivery.getDescricaoEntrega() : 
                          delivery.getConteudo();
        if (descricao == null || descricao.trim().length() < 50) {
            throw new IllegalArgumentException("Descrição da entrega deve ter no mínimo 50 caracteres");
        }
        
        // Validação: arquivos ou links são obrigatórios
        if ((delivery.getArquivosEntrega() == null || delivery.getArquivosEntrega().trim().isEmpty()) &&
            (delivery.getDescricaoEntrega() == null || delivery.getDescricaoEntrega().trim().isEmpty())) {
            throw new IllegalArgumentException("Arquivos ou links de entrega são obrigatórios");
        }
        
        delivery.setMilestone(m.get());
        delivery.setPerfilDev(p.get());
        delivery.setDescricaoEntrega(descricao);
        delivery.setSubmittedAt(LocalDateTime.now());
        delivery.setReviewed(false);
        return deliveryRepository.save(delivery);
    }

    public Optional<Delivery> findById(Long id) { 
        return deliveryRepository.findById(id); 
    }

    public List<Delivery> findByMilestoneId(Long milestoneId) {
        return deliveryRepository.findByMilestoneId(milestoneId);
    }

    public List<Delivery> findByPerfilDevId(Long perfilDevId) {
        return deliveryRepository.findByPerfilDevId(perfilDevId);
    }

    @Transactional
    public Delivery updateDelivery(Long id, Delivery updated) {
        Delivery existing = deliveryRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Delivery não encontrado"));
        
        if (Boolean.TRUE.equals(existing.getReviewed())) {
            throw new IllegalStateException("Não é possível editar entrega já revisada");
        }
        
        if (updated.getDescricaoEntrega() != null) {
            if (updated.getDescricaoEntrega().trim().length() < 50) {
                throw new IllegalArgumentException("Descrição da entrega deve ter no mínimo 50 caracteres");
            }
            existing.setDescricaoEntrega(updated.getDescricaoEntrega());
        }
        
        if (updated.getArquivosEntrega() != null) {
            existing.setArquivosEntrega(updated.getArquivosEntrega());
        }
        
        if (updated.getHorasTrabalhadas() != null) {
            existing.setHorasTrabalhadas(updated.getHorasTrabalhadas());
        }
        
        // Compatibilidade com campo legado
        if (updated.getConteudo() != null) {
            existing.setConteudo(updated.getConteudo());
        }
        
        return deliveryRepository.save(existing);
    }

    @Transactional
    public Delivery reviewDelivery(Long id, boolean approved, String comentarioRevisao) {
        Delivery existing = deliveryRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Delivery não encontrado"));
        
        if (Boolean.TRUE.equals(existing.getReviewed())) {
            throw new IllegalStateException("Entrega já foi revisada");
        }
        
        // Validação: se rejeitada, comentário deve ter no mínimo 20 caracteres
        if (!approved && (comentarioRevisao == null || comentarioRevisao.trim().length() < 20)) {
            throw new IllegalArgumentException("Comentário de revisão é obrigatório e deve ter no mínimo 20 caracteres quando a entrega é rejeitada");
        }
        
        existing.setReviewed(true);
        existing.setApproved(approved);
        existing.setComentarioRevisao(comentarioRevisao);
        existing.setDataRevisao(LocalDateTime.now());
        
        return deliveryRepository.save(existing);
    }
}

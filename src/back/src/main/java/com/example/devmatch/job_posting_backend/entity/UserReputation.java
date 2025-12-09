package com.example.devmatch.job_posting_backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_reputation")
public class UserReputation {

    @Id
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "score_medio")
    private Double scoreMedio;

    @Column(name = "total_feedbacks")
    private Long totalFeedbacks;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Double getScoreMedio() { return scoreMedio; }
    public void setScoreMedio(Double scoreMedio) { this.scoreMedio = scoreMedio; }

    public Long getTotalFeedbacks() { return totalFeedbacks; }
    public void setTotalFeedbacks(Long totalFeedbacks) { this.totalFeedbacks = totalFeedbacks; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

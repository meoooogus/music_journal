package com.musicjournal.musicjournal.domain.record.entity;

import com.musicjournal.musicjournal.domain.auth.entity.User;
import com.musicjournal.musicjournal.domain.track.entity.Track;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@EntityListeners(AuditingEntityListener.class)  // JPA Auditing 활성화
@Table(name = "records")
public class Record {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long recordId;


    @ManyToOne(fetch = FetchType.LAZY) // 연관 entity를 필요할 때만
    @JoinColumn(name = "user_id", nullable = false) // FK 컬럼 이름 지정
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "track_id", nullable = false)
    private Track track;

    // 사용자가 원하는 기록 일자
    @Column(nullable = false)
    private LocalDate recordedDate;

    // DB에 저장된 실제 일시
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // 코멘트 없이 기록만 남길 수 있도록
    private String comment;

    @Enumerated(EnumType.STRING)  // DB에 문자열로 저장 (SUNNY, RAINY 등)
    private Weather weather;

    public void update(Track track, LocalDate recordedDate, String comment, Weather weather) {
        this.track = track;
        this.recordedDate = recordedDate;
        this.comment = comment;
        this.weather = weather;
    }
}

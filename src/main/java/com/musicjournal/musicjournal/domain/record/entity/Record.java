package com.musicjournal.musicjournal.domain.record.entity;

import com.musicjournal.musicjournal.domain.auth.entity.User;
import com.musicjournal.musicjournal.domain.track.entity.Track;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
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

    @Column(nullable = false)
    private LocalDate date;

    // 코멘트 없이 기록만 남길 수 있도록
    private String comment;
}

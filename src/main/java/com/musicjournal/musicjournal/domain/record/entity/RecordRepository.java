package com.musicjournal.musicjournal.domain.record.entity;

import com.musicjournal.musicjournal.domain.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface RecordRepository extends JpaRepository<Record, Long> {

    // 특정 유저의 특정 날짜 기록 목록 조회
    List<Record> findByUserAndRecordedDate(User user, LocalDate recordedDate);
}

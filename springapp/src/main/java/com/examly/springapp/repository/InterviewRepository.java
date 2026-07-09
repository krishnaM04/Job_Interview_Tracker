package com.examly.springapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.examly.springapp.model.Interview;

public interface InterviewRepository extends JpaRepository<Interview, Long> {
}
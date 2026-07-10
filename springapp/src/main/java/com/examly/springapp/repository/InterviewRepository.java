package com.examly.springapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.examly.springapp.model.Interview;

@Repository
public interface InterviewRepository extends JpaRepository<Interview, Long> {
}
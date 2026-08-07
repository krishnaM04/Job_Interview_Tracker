package com.examly.springapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.examly.springapp.model.Candidate;

@Repository
public interface CandidateRepository extends JpaRepository<Candidate, Long> {
}
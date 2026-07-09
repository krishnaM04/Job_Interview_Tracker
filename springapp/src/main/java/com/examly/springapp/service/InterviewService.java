package com.examly.springapp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.examly.springapp.model.Interview;
import com.examly.springapp.repository.InterviewRepository;

@Service
public class InterviewService {

    @Autowired
    private InterviewRepository repository;

    public Interview addInterview(Interview interview) {
        return repository.save(interview);
    }

    public List<Interview> getAllInterviews() {
        return repository.findAll();
    }
}
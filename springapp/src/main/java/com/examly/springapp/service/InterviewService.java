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

    // CREATE
    public Interview addInterview(Interview interview) {
        return repository.save(interview);
    }

    // READ ALL
    public List<Interview> getAllInterviews() {
        return repository.findAll();
    }

    // READ BY ID
    public Interview getInterviewById(Long id) {
        return repository.findById(id).orElse(null);
    }

    // UPDATE
    public Interview updateInterview(Long id, Interview interview) {
        interview.setId(id);
        return repository.save(interview);
    }

    // DELETE
    public void deleteInterview(Long id) {
        repository.deleteById(id);
    }

    public List<Interview> searchInterviews(Long candidateId, String date, String state) {
        return repository.findAll();
    }

    public Interview addFeedback(Long id, Interview interview) {
        return repository.findById(id).map(existing -> {
            existing.setFeedback(interview.getFeedback());
            return repository.save(existing);
        }).orElse(null);
    }

    public Object getPreparation(Long id) {
        return "Preparation materials for interview " + id;
    }

    public Interview reschedule(Long id, Interview interview) {
        return repository.findById(id).map(existing -> {
            existing.setInterviewDate(interview.getInterviewDate());
            return repository.save(existing);
        }).orElse(null);
    }

    public Object getCalendar(int month, int year) {
        return "Calendar for " + month + "/" + year;
    }

    public Object addReminder(Long id, Object reminder) {
        return "Reminder added for interview " + id;
    }
}
package com.examly.springapp.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.examly.springapp.model.Interview;
import com.examly.springapp.repository.InterviewRepository;

@service
public class InterviewService {
    @Autowired
    InterviewRepository repo;

    public Interview add(Interview interview){
        return repo.save(interview);
    }

    public List<Interview>getAllInterview(){
        return repo.findAll();
    }
}

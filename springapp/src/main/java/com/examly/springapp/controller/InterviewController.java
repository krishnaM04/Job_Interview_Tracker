package com.examly.springapp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.examly.springapp.model.Interview;
import com.examly.springapp.service.InterviewService;

@RestController
@RequestMapping("/api/interviews")
public class InterviewController {

    @Autowired
    private InterviewService service;

    @PostMapping
    public Interview addInterview(@RequestBody Interview interview) {
        return service.addInterview(interview);
    }

    @GetMapping
    public List<Interview> getAllInterviews() {
        return service.getAllInterviews();
    }
}
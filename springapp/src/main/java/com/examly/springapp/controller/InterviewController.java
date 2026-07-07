package com.examly.springapp.controller;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.interviewtracker.model.Interview;
import com.example.interviewtracker.service.InterviewService
@RestController
@RequestMapping("/interviews")
@CrossOrigin(origins="*")
public class InterviewController {
    @Autowired
    private InterviewService service;

    @PostMapping
    public Interview addInterview(@RequestBody Interview interview){
        return service.addInterview(interview);
    }

    @GetMapping
    public List<Interview> getAllInterview(){
        return service.getAllInterview();
    }
}

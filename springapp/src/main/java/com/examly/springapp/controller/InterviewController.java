package com.examly.springapp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.examly.springapp.model.Interview;
import com.examly.springapp.service.InterviewService;

@RestController
@RequestMapping("/api/interviews")
public class InterviewController {

    @Autowired
    private InterviewService service;

    @PostMapping
    public ResponseEntity<Interview> addInterview(@RequestBody Interview interview) {
        return ResponseEntity.ok(service.addInterview(interview));
    }

    @GetMapping
    public ResponseEntity<List<Interview>> getAllInterviews() {
        return ResponseEntity.ok(service.getAllInterviews());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Interview> getInterviewById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getInterviewById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Interview> updateInterview(@PathVariable Long id, @RequestBody Interview interview) {
        return ResponseEntity.ok(service.updateInterview(id, interview));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInterview(@PathVariable Long id) {
        service.deleteInterview(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<Interview>> searchInterviews(
            @RequestParam(required = false) Long candidateId,
            @RequestParam(required = false) String date,
            @RequestParam(required = false) String state) {
        return ResponseEntity.ok(service.searchInterviews(candidateId, date, state));
    }

    @PostMapping("/{id}/feedback")
    public ResponseEntity<Interview> addFeedback(@PathVariable Long id, @RequestBody Interview interview) {
        return ResponseEntity.ok(service.addFeedback(id, interview));
    }

    @GetMapping("/{id}/preparation")
    public ResponseEntity<Object> getPreparation(@PathVariable Long id) {
        return ResponseEntity.ok(service.getPreparation(id));
    }

    @PutMapping("/{id}/reschedule")
    public ResponseEntity<Interview> reschedule(@PathVariable Long id, @RequestBody Interview interview) {
        return ResponseEntity.ok(service.reschedule(id, interview));
    }

    @GetMapping("/calendar/{month}/{year}")
    public ResponseEntity<Object> getCalendar(@PathVariable int month, @PathVariable int year) {
        return ResponseEntity.ok(service.getCalendar(month, year));
    }

    @PostMapping("/{id}/reminders")
    public ResponseEntity<Object> addReminder(@PathVariable Long id, @RequestBody Object reminder) {
        return ResponseEntity.ok(service.addReminder(id, reminder));
    }
}

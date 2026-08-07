package com.examly.springapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.examly.springapp.service.CandidateService;

@RestController
@RequestMapping("/api/candidates")
public class CandidateController {

    @Autowired
    private CandidateService candidateService;

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        return ResponseEntity.ok(candidateService.getProfile());
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Object profile) {
        return ResponseEntity.ok(candidateService.updateProfile(profile));
    }

    @GetMapping("/{id}/applications")
    public ResponseEntity<?> getApplications(@PathVariable Long id) {
        return ResponseEntity.ok(candidateService.getApplications(id));
    }

    @GetMapping("/{id}/interviews")
    public ResponseEntity<?> getInterviews(@PathVariable Long id) {
        return ResponseEntity.ok(candidateService.getInterviews(id));
    }

    @GetMapping("/{id}/analytics")
    public ResponseEntity<?> getAnalytics(@PathVariable Long id) {
        return ResponseEntity.ok(candidateService.getAnalytics(id));
    }

    @PostMapping("/skills")
    public ResponseEntity<?> addSkills(@RequestBody Object skills) {
        return ResponseEntity.ok(candidateService.addSkills(skills));
    }

    @PutMapping("/preferences")
    public ResponseEntity<?> updatePreferences(@RequestBody Object preferences) {
        return ResponseEntity.ok(candidateService.updatePreferences(preferences));
    }

    @GetMapping("/dashboard-stats")
    public ResponseEntity<?> getDashboardStats() {
        return ResponseEntity.ok(candidateService.getDashboardStats());
    }
}

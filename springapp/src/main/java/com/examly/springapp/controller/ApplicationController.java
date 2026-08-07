package com.examly.springapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.examly.springapp.service.ApplicationService;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @GetMapping
    public ResponseEntity<?> getApplications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String sort) {
        return ResponseEntity.ok(applicationService.getApplications(page, size, sort));
    }

    @PostMapping
    public ResponseEntity<?> createApplication(@RequestBody Object application) {
        return ResponseEntity.ok(applicationService.createApplication(application));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getApplication(@PathVariable Long id) {
        return ResponseEntity.ok(applicationService.getApplication(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateApplication(@PathVariable Long id, @RequestBody Object application) {
        return ResponseEntity.ok(applicationService.updateApplication(id, application));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteApplication(@PathVariable Long id) {
        applicationService.deleteApplication(id);
        return ResponseEntity.ok("Deleted successfully");
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchApplications(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String filters) {
        return ResponseEntity.ok(applicationService.searchApplications(q, filters));
    }

    @PostMapping("/{id}/notes")
    public ResponseEntity<?> addNote(@PathVariable Long id, @RequestBody Object note) {
        return ResponseEntity.ok(applicationService.addNote(id, note));
    }

    @GetMapping("/{id}/timeline")
    public ResponseEntity<?> getTimeline(@PathVariable Long id) {
        return ResponseEntity.ok(applicationService.getTimeline(id));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Object status) {
        return ResponseEntity.ok(applicationService.updateStatus(id, status));
    }

    @PostMapping("/bulk-update")
    public ResponseEntity<?> bulkUpdate(@RequestBody Object updates) {
        return ResponseEntity.ok(applicationService.bulkUpdate(updates));
    }

    @GetMapping("/analytics/summary")
    public ResponseEntity<?> getAnalyticsSummary() {
        return ResponseEntity.ok(applicationService.getAnalyticsSummary());
    }

    @GetMapping("/reminders")
    public ResponseEntity<?> getReminders() {
        return ResponseEntity.ok(applicationService.getReminders());
    }
}
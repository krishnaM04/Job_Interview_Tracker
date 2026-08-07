package com.examly.springapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.examly.springapp.service.AnalyticsService;

@RestController
@RequestMapping("/api")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/analytics/candidate/{id}/summary")
    public ResponseEntity<?> getCandidateSummary(@PathVariable Long id) {
        return ResponseEntity.ok(analyticsService.getCandidateSummary(id));
    }

    @GetMapping("/analytics/candidate/{id}/applications")
    public ResponseEntity<?> getCandidateApplications(@PathVariable Long id) {
        return ResponseEntity.ok(analyticsService.getCandidateApplications(id));
    }

    @GetMapping("/analytics/candidate/{id}/interviews")
    public ResponseEntity<?> getCandidateInterviews(@PathVariable Long id) {
        return ResponseEntity.ok(analyticsService.getCandidateInterviews(id));
    }

    @GetMapping("/analytics/market-trends")
    public ResponseEntity<?> getMarketTrends() {
        return ResponseEntity.ok(analyticsService.getMarketTrends());
    }

    @GetMapping("/analytics/salary-insights")
    public ResponseEntity<?> getSalaryInsights() {
        return ResponseEntity.ok(analyticsService.getSalaryInsights());
    }

    @GetMapping("/analytics/industry-analysis")
    public ResponseEntity<?> getIndustryAnalysis() {
        return ResponseEntity.ok(analyticsService.getIndustryAnalysis());
    }

    @GetMapping("/analytics/success-patterns")
    public ResponseEntity<?> getSuccessPatterns() {
        return ResponseEntity.ok(analyticsService.getSuccessPatterns());
    }

    @PostMapping("/reports/generate")
    public ResponseEntity<?> generateReport(@RequestBody Object reportData) {
        return ResponseEntity.ok(analyticsService.generateReport(reportData));
    }

    @GetMapping("/reports/{id}/download")
    public ResponseEntity<?> downloadReport(@PathVariable Long id) {
        return ResponseEntity.ok(analyticsService.downloadReport(id));
    }
}
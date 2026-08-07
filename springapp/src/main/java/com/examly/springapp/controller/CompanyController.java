package com.examly.springapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.examly.springapp.service.CompanyService;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {

    @Autowired
    private CompanyService companyService;

    @GetMapping
    public ResponseEntity<?> getCompanies(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String industry) {
        return ResponseEntity.ok(companyService.getCompanies(page, size, industry));
    }

    @PostMapping
    public ResponseEntity<?> createCompany(@RequestBody Object company) {
        return ResponseEntity.ok(companyService.createCompany(company));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCompany(@PathVariable Long id) {
        return ResponseEntity.ok(companyService.getCompany(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCompany(@PathVariable Long id, @RequestBody Object company) {
        return ResponseEntity.ok(companyService.updateCompany(id, company));
    }

    @GetMapping("/{id}/analytics")
    public ResponseEntity<?> getAnalytics(@PathVariable Long id) {
        return ResponseEntity.ok(companyService.getAnalytics(id));
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchCompanies(@RequestParam(required = false) String q) {
        return ResponseEntity.ok(companyService.searchCompanies(q));
    }

    @GetMapping("/{id}/application-history")
    public ResponseEntity<?> getApplicationHistory(@PathVariable Long id) {
        return ResponseEntity.ok(companyService.getApplicationHistory(id));
    }

    @PostMapping("/{id}/reviews")
    public ResponseEntity<?> addReview(@PathVariable Long id, @RequestBody Object review) {
        return ResponseEntity.ok(companyService.addReview(id, review));
    }

    @GetMapping("/market-insights")
    public ResponseEntity<?> getMarketInsights() {
        return ResponseEntity.ok(companyService.getMarketInsights());
    }

    @GetMapping("/trending")
    public ResponseEntity<?> getTrending() {
        return ResponseEntity.ok(companyService.getTrending());
    }
}
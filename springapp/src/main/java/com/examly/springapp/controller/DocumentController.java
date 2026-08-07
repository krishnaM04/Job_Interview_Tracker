package com.examly.springapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.examly.springapp.service.DocumentService;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @GetMapping
    public ResponseEntity<?> getDocuments(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Long candidateId) {
        return ResponseEntity.ok(documentService.getDocuments(type, candidateId));
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadDocument(@RequestBody Object document) {
        return ResponseEntity.ok(documentService.uploadDocument(document));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDocument(@PathVariable Long id) {
        return ResponseEntity.ok(documentService.getDocument(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDocument(@PathVariable Long id, @RequestBody Object document) {
        return ResponseEntity.ok(documentService.updateDocument(id, document));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDocument(@PathVariable Long id) {
        documentService.deleteDocument(id);
        return ResponseEntity.ok("Deleted successfully");
    }

    @GetMapping("/{id}/versions")
    public ResponseEntity<?> getVersions(@PathVariable Long id) {
        return ResponseEntity.ok(documentService.getVersions(id));
    }

    @PostMapping("/{id}/share")
    public ResponseEntity<?> shareDocument(@PathVariable Long id, @RequestBody Object shareData) {
        return ResponseEntity.ok(documentService.shareDocument(id, shareData));
    }

    @GetMapping("/templates")
    public ResponseEntity<?> getTemplates() {
        return ResponseEntity.ok(documentService.getTemplates());
    }

    @PostMapping("/generate-resume")
    public ResponseEntity<?> generateResume(@RequestBody Object resumeData) {
        return ResponseEntity.ok(documentService.generateResume(resumeData));
    }
}
package com.examly.springapp.controller;

import com.examly.springapp.model.User;
import com.examly.springapp.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<?> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String role) {
        if (role != null && !role.isEmpty()) {
            List<User> users = adminService.getUsersByRole(role);
            return ResponseEntity.ok(users);
        }
        List<User> users = adminService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PostMapping("/users")
    public ResponseEntity<?> createUser(@RequestBody User user) {
        User savedUser = adminService.createUser(user);
        return ResponseEntity.ok(savedUser);
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User user) {
        User updatedUser = adminService.updateUser(id, user);
        if (updatedUser != null) {
            return ResponseEntity.ok(updatedUser);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        boolean deleted = adminService.deleteUser(id);
        if (deleted) {
            return ResponseEntity.ok("User deleted successfully");
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/analytics/system")
    public ResponseEntity<?> getSystemAnalytics() {
        return ResponseEntity.ok("System analytics");
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<?> getAuditLogs() {
        return ResponseEntity.ok("Audit logs");
    }

    @PostMapping("/notifications/broadcast")
    public ResponseEntity<?> broadcastNotification(@RequestBody Object notification) {
        String result = adminService.broadcastNotification(notification);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/reports/usage")
    public ResponseEntity<?> getUsageReport() {
        return ResponseEntity.ok("Usage report");
    }

    @PutMapping("/system/settings")
    public ResponseEntity<?> updateSystemSettings(@RequestBody Object settings) {
        return ResponseEntity.ok("System settings updated");
    }

    @GetMapping("/health-check")
    public ResponseEntity<?> healthCheck() {
        return ResponseEntity.ok("System is healthy");
    }
}

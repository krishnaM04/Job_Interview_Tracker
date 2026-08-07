package com.examly.springapp.service;

import com.examly.springapp.model.RegisterRequest;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Object register(Object userData) {
        String username = null;
        String password = null;
        String role = "USER";

        if (userData instanceof RegisterRequest) {
            RegisterRequest req = (RegisterRequest) userData;
            username = req.getUsername();
            password = req.getPassword();
            role = req.getRole() != null ? req.getRole() : "USER";
        } else if (userData instanceof Map) {
            Map<?, ?> data = (Map<?, ?>) userData;
            username = (String) data.get("username");
            password = (String) data.get("password");
            role = data.get("role") != null ? (String) data.get("role") : "USER";
        }

        if (username == null || password == null) {
            return Map.of("error", "username and password are required");
        }

        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);
        userRepository.save(user);

        String token = jwtUtil.generateToken(username);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("token", token);
        response.put("role", role);
        return response;
    }

    public Object login(Object credentials) {
        String username = null;
        String password = null;

        if (credentials instanceof RegisterRequest) {
            RegisterRequest req = (RegisterRequest) credentials;
            username = req.getUsername();
            password = req.getPassword();
        } else if (credentials instanceof Map) {
            Map<?, ?> data = (Map<?, ?>) credentials;
            username = (String) data.get("username");
            password = (String) data.get("password");
        }

        if (username == null || password == null) {
            return Map.of("error", "username and password are required");
        }

        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isPresent() && passwordEncoder.matches(password, userOpt.get().getPassword())) {
            String token = jwtUtil.generateToken(username);
            Map<String, Object> response = new LinkedHashMap<>();
            response.put("token", token);
            response.put("role", userOpt.get().getRole());
            return response;
        }
        return Map.of("error", "Invalid credentials");
    }

    public Object logout() {
        return Map.of("message", "Logout successful");
    }

    public Object refreshToken(Object token) {
        return Map.of("message", "Token refreshed");
    }

    public Object forgotPassword(Object email) {
        return Map.of("message", "Password reset email sent");
    }

    public Object resetPassword(Object resetData) {
        return Map.of("message", "Password reset successful");
    }

    public Object verifyEmail(String token) {
        return Map.of("message", "Email verified");
    }
}

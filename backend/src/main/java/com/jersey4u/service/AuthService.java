package com.jersey4u.service;

import com.jersey4u.dto.AuthResponse;
import com.jersey4u.dto.LoginRequest;
import com.jersey4u.dto.RegisterRequest;
import com.jersey4u.model.User;
import com.jersey4u.repository.UserRepository;
import com.jersey4u.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Full name is required.");
        }
        if (request.getEmail() == null || !request.getEmail().contains("@")) {
            throw new IllegalArgumentException("A valid email address is required.");
        }
        if (request.getPassword() == null || request.getPassword().length() < 6) {
            throw new IllegalArgumentException("Password must be at least 6 characters long.");
        }

        String normalizedEmail = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new IllegalArgumentException("An account with this email already exists. Please sign in.");
        }

        String hashedPassword = passwordEncoder.encode(request.getPassword().trim());
        String phone = (request.getPhone() != null) ? request.getPhone().trim() : "";

        User newUser = new User(
                request.getName().trim(),
                normalizedEmail,
                hashedPassword,
                phone,
                "ROLE_CUSTOMER"
        );

        User savedUser = userRepository.save(newUser);
        String token = jwtService.generateToken(savedUser.getEmail(), savedUser.getName(), savedUser.getRole());

        return new AuthResponse(token, savedUser.getEmail(), savedUser.getName(), savedUser.getPhone(), savedUser.getRole());
    }

    public AuthResponse login(LoginRequest request) {
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required.");
        }
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            throw new IllegalArgumentException("Password is required.");
        }

        String normalizedEmail = request.getEmail().trim().toLowerCase();

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(normalizedEmail, request.getPassword().trim())
            );
        } catch (BadCredentialsException ex) {
            throw new IllegalArgumentException("Invalid email or password. Please try again.");
        }

        User user = userRepository.findByEmailIgnoreCase(normalizedEmail)
                .orElseThrow(() -> new IllegalArgumentException("Account not found for email: " + normalizedEmail));

        String token = jwtService.generateToken(user.getEmail(), user.getName(), user.getRole());

        return new AuthResponse(token, user.getEmail(), user.getName(), user.getPhone(), user.getRole());
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found for email: " + email));
    }
}

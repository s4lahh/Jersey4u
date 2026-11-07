package com.jersey4u;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@SpringBootApplication
@RestController
public class Jersey4uApplication {

    public static void main(String[] args) {
        SpringApplication.run(Jersey4uApplication.class, args);
    }

    @GetMapping("/api/health")
    public Map<String, Object> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "Jersey4U Backend is alive and running!");
        response.put("service", "jersey4u-backend");
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }
}

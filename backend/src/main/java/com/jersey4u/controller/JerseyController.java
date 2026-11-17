package com.jersey4u.controller;

import com.jersey4u.model.Jersey;
import com.jersey4u.service.JerseyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jerseys")
public class JerseyController {

    private final JerseyService jerseyService;

    // Inject JerseyService via Constructor
    @Autowired
    public JerseyController(JerseyService jerseyService) {
        this.jerseyService = jerseyService;
    }

    // 1. GET /api/jerseys (with optional ?league=La Liga or ?search=Madrid)
    @GetMapping
    public ResponseEntity<List<Jersey>> getAllJerseys(
            @RequestParam(required = false) String league,
            @RequestParam(required = false) String search) {
        
        if (search != null && !search.trim().isEmpty()) {
            return ResponseEntity.ok(jerseyService.searchJerseys(search));
        }
        if (league != null && !league.trim().isEmpty()) {
            return ResponseEntity.ok(jerseyService.getJerseysByLeague(league));
        }
        return ResponseEntity.ok(jerseyService.getAllJerseys());
    }

    // 2. GET /api/jerseys/{id} (e.g. /api/jerseys/1)
    @GetMapping("/{id}")
    public ResponseEntity<Jersey> getJerseyById(@PathVariable Long id) {
        return jerseyService.getJerseyById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 3. GET /api/jerseys/featured
    @GetMapping("/featured")
    public ResponseEntity<List<Jersey>> getFeaturedJerseys() {
        return ResponseEntity.ok(jerseyService.getFeaturedJerseys());
    }

    // 4. POST /api/jerseys (Admin: Add new jersey to catalog)
    @PostMapping
    public ResponseEntity<?> createJersey(@RequestBody Jersey jersey) {
        if (jersey.getName() == null || jersey.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", "Jersey name is required."));
        }
        if (jersey.getTeam() == null || jersey.getTeam().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", "Team is required."));
        }
        if (jersey.getPrice() == null) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", "Price is required."));
        }
        if (jersey.getImageUrl() == null || jersey.getImageUrl().trim().isEmpty()) {
            jersey.setImageUrl("/images/jerseys/real-madrid-home.jpg");
        }
        Jersey saved = jerseyService.saveJersey(jersey);
        return ResponseEntity.status(org.springframework.http.HttpStatus.CREATED).body(saved);
    }

    // 5. PUT /api/jerseys/{id} (Admin: Update existing jersey)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateJersey(@PathVariable Long id, @RequestBody Jersey jersey) {
        try {
            Jersey updated = jerseyService.updateJersey(id, jersey);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", ex.getMessage()));
        }
    }

    // 6. PATCH /api/jerseys/{id}/toggle-stock (Admin: Instant stock switch)
    @PatchMapping("/{id}/toggle-stock")
    public ResponseEntity<?> toggleStock(@PathVariable Long id) {
        try {
            Jersey updated = jerseyService.toggleStock(id);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", ex.getMessage()));
        }
    }

    // 7. DELETE /api/jerseys/{id} (Admin: Remove jersey)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteJersey(@PathVariable Long id) {
        try {
            jerseyService.deleteJersey(id);
            return ResponseEntity.ok(java.util.Map.of("message", "Jersey removed successfully from vault."));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", ex.getMessage()));
        }
    }
}

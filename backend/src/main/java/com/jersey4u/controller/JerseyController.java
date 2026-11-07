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
}

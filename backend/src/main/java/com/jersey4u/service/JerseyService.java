package com.jersey4u.service;

import com.jersey4u.model.Jersey;
import com.jersey4u.repository.JerseyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class JerseyService {

    private final JerseyRepository jerseyRepository;

    // Constructor Injection (Industry Best Practice)
    @Autowired
    public JerseyService(JerseyRepository jerseyRepository) {
        this.jerseyRepository = jerseyRepository;
    }

    // Retrieve all jerseys in the catalog
    public List<Jersey> getAllJerseys() {
        return jerseyRepository.findAll();
    }

    // Retrieve a single jersey by its ID
    public Optional<Jersey> getJerseyById(Long id) {
        return jerseyRepository.findById(id);
    }

    // Retrieve jerseys filtered by league (e.g. "La Liga", "Premier League")
    public List<Jersey> getJerseysByLeague(String league) {
        if (league == null || "all".equalsIgnoreCase(league)) {
            return getAllJerseys();
        }
        return jerseyRepository.findByLeagueIgnoreCase(league);
    }

    // Retrieve featured jerseys for the home page showcase
    public List<Jersey> getFeaturedJerseys() {
        return jerseyRepository.findByFeaturedTrue();
    }

    // Search jerseys by keyword (name, team, league)
    public List<Jersey> searchJerseys(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllJerseys();
        }
        return jerseyRepository.searchByKeyword(keyword.trim());
    }

    // Save or update a jersey
    public Jersey saveJersey(Jersey jersey) {
        return jerseyRepository.save(jersey);
    }
}

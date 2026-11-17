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

    public Jersey updateJersey(Long id, Jersey updated) {
        Jersey existing = jerseyRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Jersey not found with id: " + id));

        if (updated.getName() != null) existing.setName(updated.getName().trim());
        if (updated.getTeam() != null) existing.setTeam(updated.getTeam().trim());
        if (updated.getLeague() != null) existing.setLeague(updated.getLeague().trim());
        if (updated.getSeason() != null) existing.setSeason(updated.getSeason().trim());
        if (updated.getKitType() != null) existing.setKitType(updated.getKitType().trim());
        if (updated.getPrice() != null) existing.setPrice(updated.getPrice());
        if (updated.getOriginalPrice() != null) existing.setOriginalPrice(updated.getOriginalPrice());
        if (updated.getImageUrl() != null) existing.setImageUrl(updated.getImageUrl().trim());
        if (updated.getDescription() != null) existing.setDescription(updated.getDescription().trim());
        existing.setInStock(updated.isInStock());
        existing.setFeatured(updated.isFeatured());

        return jerseyRepository.save(existing);
    }

    public Jersey toggleStock(Long id) {
        Jersey jersey = jerseyRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Jersey not found with id: " + id));
        jersey.setInStock(!jersey.isInStock());
        return jerseyRepository.save(jersey);
    }

    public void deleteJersey(Long id) {
        if (!jerseyRepository.existsById(id)) {
            throw new IllegalArgumentException("Jersey not found with id: " + id);
        }
        jerseyRepository.deleteById(id);
    }
}

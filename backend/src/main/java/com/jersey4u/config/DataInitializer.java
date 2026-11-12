package com.jersey4u.config;

import com.jersey4u.model.Jersey;
import com.jersey4u.repository.JerseyRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final JerseyRepository jerseyRepository;

    public DataInitializer(JerseyRepository jerseyRepository) {
        this.jerseyRepository = jerseyRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Only seed data if the table is currently empty
        if (jerseyRepository.count() > 0) {
            return;
        }

        List<Jersey> starterJerseys = Arrays.asList(
            new Jersey(
                null,
                "Real Madrid 2024/25 Authentic Home Kit",
                "Real Madrid",
                "La Liga",
                "24/25",
                "Home",
                new BigDecimal("899"),
                new BigDecimal("1499"),
                "/images/jerseys/real-madrid-home.jpg",
                "The official 2024/25 Real Madrid Home Jersey honors the club's eternal elegance and unmatched European dominance. Crafted with an exclusive houndstooth texture inspired by traditional 'chulapo' attire from Madrid's annual San Isidro Fiesta, this kit embodies pure royal Madridismo.",
                true,
                true
            ),
            new Jersey(
                null,
                "FC Barcelona 125th Anniversary Home Kit",
                "FC Barcelona",
                "La Liga",
                "24/25",
                "Home",
                new BigDecimal("899"),
                new BigDecimal("1499"),
                "/images/jerseys/barcelona-home.jpg",
                "Commemorating 125 years of Blaugrana glory (1899-2024). Features the iconic half-and-half design inspired by the club's very first kit worn by Joan Gamper, accented with commemorative gold anniversary crest detailing and Catalan Senyera pride.",
                true,
                true
            ),
            new Jersey(
                null,
                "Manchester City 2024/25 Authentic Home Kit",
                "Manchester City",
                "Premier League",
                "24/25",
                "Home",
                new BigDecimal("849"),
                new BigDecimal("1399"),
                "/images/jerseys/man-city-home.jpg",
                "Inspired by Manchester's iconic '0161' telephone dial code, woven directly into the collar and cuffs as a tribute to City's roots and unstoppable Treble-winning era under Pep Guardiola.",
                true,
                true
            ),
            new Jersey(
                null,
                "Arsenal 2024/25 Cannon Crest Home Kit",
                "Arsenal",
                "Premier League",
                "24/25",
                "Home",
                new BigDecimal("849"),
                new BigDecimal("1399"),
                "/images/jerseys/arsenal-home.jpg",
                "For the first time in 35 years, the standalone historic Arsenal Cannon takes center stage across the red and white chest, honoring the club's defensive legacy and Highbury tradition.",
                false,
                true
            ),
            new Jersey(
                null,
                "Argentina 2024 World Champions Copa Edition",
                "Argentina",
                "International",
                "2024",
                "Home",
                new BigDecimal("949"),
                new BigDecimal("1599"),
                "/images/jerseys/argentina-home.jpg",
                "The jersey of champions. Featuring classic sky-blue and white vertical stripes emblazoned with the three golden stars and the official FIFA World Champions golden chest badge.",
                true,
                true
            ),
            new Jersey(
                null,
                "AC Milan 2006/07 Athens Champions League Retro",
                "AC Milan",
                "Retro",
                "06/07",
                "Retro",
                new BigDecimal("799"),
                new BigDecimal("1299"),
                "/images/jerseys/ac-milan-retro.jpg",
                "The iconic all-white 'Maglia Fortunata' lucky kit worn by Kaka, Inzaghi, and Maldini in Athens to lift the 2007 UEFA Champions League trophy against Liverpool.",
                true,
                true
            )
        );

        jerseyRepository.saveAll(starterJerseys);
        System.out.println("✅ DataInitializer: Seeded " + starterJerseys.size() + " INR football kits into MySQL!");
    }
}

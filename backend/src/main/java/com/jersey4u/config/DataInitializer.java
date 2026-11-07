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
                "Real Madrid 2024/25 Home Kit",
                "Real Madrid",
                "La Liga",
                "2024/25",
                "Home",
                new BigDecimal("89.99"),
                new BigDecimal("109.99"),
                "https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&w=600&q=80",
                "Official Real Madrid home kit featuring authentic houndstooth pattern and gold/navy accents.",
                true,
                true
            ),
            new Jersey(
                null,
                "FC Barcelona 2024/25 125th Anniversary Home",
                "FC Barcelona",
                "La Liga",
                "2024/25",
                "Home",
                new BigDecimal("89.99"),
                new BigDecimal("109.99"),
                "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=600&q=80",
                "Celebrating 125 years of Blaugrana history with the iconic half-and-half crest design.",
                true,
                true
            ),
            new Jersey(
                null,
                "Manchester City 2024/25 Home Kit",
                "Manchester City",
                "Premier League",
                "2024/25",
                "Home",
                new BigDecimal("84.99"),
                new BigDecimal("99.99"),
                "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80",
                "Featuring the 0161 Manchester dialing code woven into the collar and cuffs.",
                true,
                true
            ),
            new Jersey(
                null,
                "Arsenal 2024/25 Home Kit",
                "Arsenal",
                "Premier League",
                "2024/25",
                "Home",
                new BigDecimal("84.99"),
                new BigDecimal("99.99"),
                "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=600&q=80",
                "The iconic Cannon emblem on the chest for the first time in 35 years with navy side swoops.",
                true,
                true
            ),
            new Jersey(
                null,
                "Argentina 2024 World Champions Kit",
                "Argentina",
                "International",
                "2024",
                "Home",
                new BigDecimal("94.99"),
                new BigDecimal("119.99"),
                "https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=600&q=80",
                "Three gold stars with Copa America champions badge on iconic Albiceleste stripes.",
                true,
                true
            ),
            new Jersey(
                null,
                "AC Milan 2006/07 Athens Retro Kit",
                "AC Milan",
                "Retro",
                "2006/07",
                "Retro",
                new BigDecimal("79.99"),
                new BigDecimal("95.00"),
                "https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&w=600&q=80",
                "The historic white Champions League final kit worn by Kaka and Inzaghi in Athens 2007.",
                true,
                true
            )
        );

        jerseyRepository.saveAll(starterJerseys);
        System.out.println("✅ DataInitializer: Seeded " + starterJerseys.size() + " football kits into MySQL!");
    }
}

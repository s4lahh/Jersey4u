package com.jersey4u.repository;

import com.jersey4u.model.Jersey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JerseyRepository extends JpaRepository<Jersey, Long> {

    // 1. Derived Query: Finds jerseys by league (ignoring case)
    List<Jersey> findByLeagueIgnoreCase(String league);

    // 2. Derived Query: Finds jerseys marked as featured
    List<Jersey> findByFeaturedTrue();

    // 3. Derived Query: Finds jerseys by club or national team
    List<Jersey> findByTeamIgnoreCase(String team);

    // 4. Custom JPQL Query: Searches keyword across name, team, or league
    @Query("SELECT j FROM Jersey j WHERE " +
           "LOWER(j.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(j.team) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(j.league) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Jersey> searchByKeyword(@Param("keyword") String keyword);
}

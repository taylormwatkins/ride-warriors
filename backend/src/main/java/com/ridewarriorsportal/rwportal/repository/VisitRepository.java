package com.ridewarriorsportal.rwportal.repository;

import com.ridewarriorsportal.rwportal.model.Visit;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VisitRepository extends JpaRepository<Visit, Integer> {

    Optional<Visit> findByUserIdAndDate(Integer userId, LocalDate date);

    Optional<Visit> findByDate(LocalDate date);
}

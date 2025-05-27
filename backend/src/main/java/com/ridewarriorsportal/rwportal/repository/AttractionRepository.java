package com.ridewarriorsportal.rwportal.repository;

import com.ridewarriorsportal.rwportal.model.Attraction;

import java.util.Optional;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AttractionRepository extends JpaRepository<Attraction, Integer> {

    Optional<Attraction> findByName(String name);

    List<Attraction> findAllByType(String type);

}

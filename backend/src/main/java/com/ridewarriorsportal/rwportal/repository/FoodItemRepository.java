package com.ridewarriorsportal.rwportal.repository;

import com.ridewarriorsportal.rwportal.model.Attraction;
import com.ridewarriorsportal.rwportal.model.FoodItem;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FoodItemRepository extends JpaRepository<FoodItem, Integer> {

    Optional<FoodItem> findByName(String name);

    List<FoodItem> findAllByAttraction(Attraction attraction);

}

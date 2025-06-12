package com.ridewarriorsportal.rwportal.repository;

import com.ridewarriorsportal.rwportal.model.Meal;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.*;

@Repository
public interface MealRepository extends JpaRepository<Meal, Integer> {

    Optional<Meal> findByActivityId(Integer activityId);
}

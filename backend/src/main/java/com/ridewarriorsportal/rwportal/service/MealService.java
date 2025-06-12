package com.ridewarriorsportal.rwportal.service;

import com.ridewarriorsportal.rwportal.model.Meal;
import java.util.*;

public interface MealService {
    List<Meal> viewAll();

    void saveMeal(Meal meal);

    Meal findById(Integer id);

    Meal findByActivityId(Integer activityId);

}

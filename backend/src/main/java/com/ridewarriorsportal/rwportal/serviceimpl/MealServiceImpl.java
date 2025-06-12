package com.ridewarriorsportal.rwportal.serviceimpl;

import com.ridewarriorsportal.rwportal.model.Meal;
import com.ridewarriorsportal.rwportal.repository.MealRepository;
import com.ridewarriorsportal.rwportal.service.MealService;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;

@Slf4j
@Service
public class MealServiceImpl implements MealService {

    @Autowired
    private MealRepository mealRepo;

    @Override
    public List<Meal> viewAll() {
        return mealRepo.findAll();
    }

    @Override
    public void saveMeal(Meal meal) {
        mealRepo.save(meal);
    }

    @Override
    public Meal findById(Integer id) {
        Optional<Meal> meal = mealRepo.findById(id);
        return meal.orElse(null);
    }

    @Override
    public Meal findByActivityId(Integer activityId) {
        Optional<Meal> meal = mealRepo.findByActivityId(activityId);
        return meal.orElse(null);
    }

}

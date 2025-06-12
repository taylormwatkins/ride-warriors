package com.ridewarriorsportal.rwportal.controller;

import com.ridewarriorsportal.rwportal.model.Activity;
import com.ridewarriorsportal.rwportal.model.FoodItem;
import com.ridewarriorsportal.rwportal.model.Meal;
import com.ridewarriorsportal.rwportal.service.ActivityService;
import com.ridewarriorsportal.rwportal.service.FoodItemService;
import com.ridewarriorsportal.rwportal.service.MealService;

import lombok.*;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.*;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Slf4j
@Validated
@RestController
@RequestMapping(path = "/api/meals")
public class MealController {

    @Autowired
    private MealService mealService;

    @Autowired
    private FoodItemService foodItemService;

    @Autowired
    private ActivityService activityService;

    @GetMapping("/all")
    public List<Meal> viewAllMeals() {
        return mealService.viewAll();
    }

    @PostMapping("/add")
    public int addMeal(@RequestBody MealRequest request, @RequestParam int activityId) {

        Meal meal = new Meal();

        meal.setRating(request.getRating());

        Activity activity = activityService.findById(activityId);
        meal.setActivity(activity);

        // fetch the foods by ids
        List<FoodItem> foods = foodItemService.findAllById(request.getFoodIds());
        meal.setFoodItems(foods);

        mealService.saveMeal(meal);

        return meal.getId();
    }

    @PutMapping("/updateMeal")
    public int updateMeal(@RequestBody MealRequest request, @RequestParam int activityId) {

        Meal meal = mealService.findByActivityId(activityId);

        if (meal == null) {
            return 0; 
        }

        meal.setRating(request.getRating());

        // fetch the foods by ids
        List<FoodItem> foods = foodItemService.findAllById(request.getFoodIds());
        meal.setFoodItems(foods);

        mealService.saveMeal(meal);

        return meal.getId();
    }
}

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
class MealRequest {
    // private int activityId;
    private int rating;
    private List<Integer> foodIds;

}
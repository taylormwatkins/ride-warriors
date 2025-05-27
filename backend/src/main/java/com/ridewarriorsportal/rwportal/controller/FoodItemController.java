package com.ridewarriorsportal.rwportal.controller;

import com.ridewarriorsportal.rwportal.model.Attraction;
import com.ridewarriorsportal.rwportal.model.FoodItem;
import com.ridewarriorsportal.rwportal.service.AttractionService;
import com.ridewarriorsportal.rwportal.service.FoodItemService;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Slf4j
@Validated
@RestController
@RequestMapping(path = "/api/fooditems")
public class FoodItemController {

    @Autowired
    private FoodItemService foodItemService;

    @Autowired
    private AttractionService attractionService;

    @GetMapping("/all")
    public List<FoodItem> viewAllFoodItems() {
        return foodItemService.viewAll();
    }

    @PostMapping("/add")
    public ResponseEntity<Integer> addFoodItem(@RequestBody FoodItem foodItem, @RequestParam int attractionId) {

        Attraction attraction = attractionService.findById(attractionId);
        foodItem.setAttraction(attraction);

        foodItemService.saveFoodItem(foodItem);

        return ResponseEntity.ok(foodItem.getId());
    }

    @GetMapping("/getByAttraction")
    public ResponseEntity<List<FoodItem>> getByAttraction(@RequestParam int attractionId) {

        Attraction attraction = attractionService.findById(attractionId);

        return ResponseEntity.ok(foodItemService.findAllByAttraction(attraction));
    }

}
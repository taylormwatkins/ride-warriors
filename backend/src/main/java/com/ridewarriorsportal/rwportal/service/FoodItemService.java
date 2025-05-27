package com.ridewarriorsportal.rwportal.service;

import com.ridewarriorsportal.rwportal.model.Attraction;
import com.ridewarriorsportal.rwportal.model.FoodItem;

import java.util.*;

public interface FoodItemService {
    List<FoodItem> viewAll();

    FoodItem findByName(String name);

    FoodItem findById(Integer id);

    List<FoodItem> findAllById(List<Integer> foodIds);

    public void saveFoodItem(FoodItem foodItem);

    List<FoodItem> findAllByAttraction(Attraction attraction);
}

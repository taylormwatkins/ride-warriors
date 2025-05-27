package com.ridewarriorsportal.rwportal.serviceimpl;

import com.ridewarriorsportal.rwportal.model.Attraction;
import com.ridewarriorsportal.rwportal.model.FoodItem;
import com.ridewarriorsportal.rwportal.repository.FoodItemRepository;
import com.ridewarriorsportal.rwportal.service.FoodItemService;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;

@Slf4j
@Service
public class FoodItemServiceImpl implements FoodItemService {

    @Autowired
    private FoodItemRepository foodItemRepo;

    @Override
    public List<FoodItem> viewAll() {
        return foodItemRepo.findAll();
    }

    @Override
    public FoodItem findById(Integer id) {
        Optional<FoodItem> foodItem = foodItemRepo.findById(id);
        return foodItem.orElse(null);
    }

    @Override
    public FoodItem findByName(String name) {
        Optional<FoodItem> foodItem = foodItemRepo.findByName(name);
        return foodItem.orElse(null);
    }

    @Override
    public void saveFoodItem(FoodItem foodItem) {
        foodItemRepo.save(foodItem);
    }

    @Override
    public List<FoodItem> findAllById(List<Integer> foodIds) {
        return foodItemRepo.findAllById(foodIds);
    }

    @Override
    public List<FoodItem> findAllByAttraction(Attraction attraction) {
        return foodItemRepo.findAllByAttraction(attraction);
    }

}

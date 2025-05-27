package com.ridewarriorsportal.rwportal.controller;

import com.ridewarriorsportal.rwportal.model.Attraction;
import com.ridewarriorsportal.rwportal.service.AttractionService;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
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
@RequestMapping(path = "/api/attractions")
public class AttractionController {

    @Autowired
    private AttractionService attractionService;

    @GetMapping("/all")
    public List<Attraction> viewAllAttractions() {
        return attractionService.viewAll();
    }

    @PostMapping("/add")
    public Attraction addAttraction(@RequestBody Attraction attraction) {
        attractionService.addAttraction(attraction.getName(), attraction.getType());
        return attraction;
    }

    @PostMapping("getId")
    public int getId(@RequestBody Attraction attraction) {
        return attraction.getId();
    }

    @GetMapping("/getByType")
    public List<Attraction> getAttractionsByType(@RequestParam String type) {
        return attractionService.findAllByType(type);
    }

}
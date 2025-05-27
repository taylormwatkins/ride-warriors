package com.ridewarriorsportal.rwportal.serviceimpl;

import com.ridewarriorsportal.rwportal.model.Attraction;
import com.ridewarriorsportal.rwportal.repository.AttractionRepository;
import com.ridewarriorsportal.rwportal.service.AttractionService;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;

@Slf4j
@Service
public class AttractionServiceImpl implements AttractionService {

    @Autowired
    private AttractionRepository attractionRepo;

    @Override
    public List<Attraction> viewAll() {
        return attractionRepo.findAll();
    }

    @Override
    public void addAttraction(String name, String type) {
        // create new attraction
        Attraction attraction = new Attraction();

        // set the values
        attraction.setName(name);
        attraction.setType(type);

        // save to the repository
        attractionRepo.save(attraction);

    }

    @Override
    public Attraction findById(Integer id) {
        Optional<Attraction> attraction = attractionRepo.findById(id);
        return attraction.orElse(null);
    }

    @Override
    public List<Attraction> findAllByType(String type) {
        return attractionRepo.findAllByType(type);
    }

}

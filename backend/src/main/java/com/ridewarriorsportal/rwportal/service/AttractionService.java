package com.ridewarriorsportal.rwportal.service;

import com.ridewarriorsportal.rwportal.model.Attraction;
import java.util.*;

public interface AttractionService {
    List<Attraction> viewAll();

    void addAttraction(String name, String type);

    Attraction findById(Integer id);

    List<Attraction> findAllByType(String type);
}

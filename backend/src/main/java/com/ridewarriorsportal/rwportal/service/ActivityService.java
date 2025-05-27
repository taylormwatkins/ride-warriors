package com.ridewarriorsportal.rwportal.service;

import com.ridewarriorsportal.rwportal.model.Activity;
import com.ridewarriorsportal.rwportal.model.Visit;

import java.util.*;

public interface ActivityService {
    List<Activity> viewAll();

    void saveActivity(Activity activity);

    Activity findById(Integer id);

    List<Activity> findAllByVisit(Visit visit);

}

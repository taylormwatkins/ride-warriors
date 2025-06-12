package com.ridewarriorsportal.rwportal.serviceimpl;

import com.ridewarriorsportal.rwportal.model.Activity;
import com.ridewarriorsportal.rwportal.model.Visit;
import com.ridewarriorsportal.rwportal.repository.ActivityRepository;
import com.ridewarriorsportal.rwportal.service.ActivityService;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;

@Slf4j
@Service
public class ActivityServiceImpl implements ActivityService {

    @Autowired
    private ActivityRepository activityRepo;

    @Override
    public List<Activity> viewAll() {
        return activityRepo.findAll();
    }

    @Override
    public void saveActivity(Activity activity) {
        activityRepo.save(activity);
    }

    @Override
    public Activity findById(Integer id) {
        Optional<Activity> activity = activityRepo.findById(id);
        return activity.orElse(null);
    }

    @Override
    public List<Activity> findAllByVisit(Visit visit){
        return activityRepo.findAllByVisit(visit);
    }

    @Override
    public void deleteActivityById(Integer id) {
        activityRepo.deleteById(id);
    }
}

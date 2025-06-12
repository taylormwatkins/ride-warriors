package com.ridewarriorsportal.rwportal.controller;

import com.ridewarriorsportal.rwportal.model.Activity;
import com.ridewarriorsportal.rwportal.model.Visit;
import com.ridewarriorsportal.rwportal.service.ActivityService;
import com.ridewarriorsportal.rwportal.service.VisitService;

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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Slf4j
@Validated
@RestController
@RequestMapping(path = "/api/activities")
public class ActivityController {

    @Autowired
    private ActivityService activityService;

    @Autowired
    private VisitService visitService;

    @GetMapping("/all")
    public List<Activity> viewAllActivities() {
        return activityService.viewAll();
    }

    // TODO: add error handling

    @PostMapping("/add")
    public ResponseEntity<Integer> addActivity(@RequestBody Activity activity, @RequestParam int visitId) {
        try {
            // find and set visit
            Visit visit = visitService.findById(visitId);
            activity.setVisit(visit);

            // save activity to the repository
            activityService.saveActivity(activity);
            System.out.println("Activity saved: " + activity);

            // return ResponseEntity.ok(activity);
            return ResponseEntity.ok(activity.getId());

        } catch (Exception e) {
            System.out.println("Error in activitycontroller " + e);
            return ResponseEntity.ok(0);
        }

    }

    @GetMapping("/getByVisit")
    public ResponseEntity<List<Activity>> getByVisit(@RequestParam int visitId) {

        Visit visit = visitService.findById(visitId);

        return ResponseEntity.ok(activityService.findAllByVisit(visit));
    }

    @PutMapping("/updateActivity")
    public ResponseEntity<Activity> updateActivity(@RequestBody Activity updatedActivity, @RequestParam int activityId) {

        try {
            Activity activity = activityService.findById(activityId);
        

            if (updatedActivity.getTimeOfDay() != null) {
                activity.setTimeOfDay(updatedActivity.getTimeOfDay());
            }
            if (updatedActivity.getWaitTime() != null) {
                activity.setWaitTime(updatedActivity.getWaitTime());
            }
            if (updatedActivity.getFrontRow() != null) {
                activity.setFrontRow(updatedActivity.getFrontRow());
            }
            if (updatedActivity.getComments() != null) {
                activity.setComments(updatedActivity.getComments());
            }

            activityService.saveActivity(activity);
            // return ResponseEntity.ok(activity);
            return ResponseEntity.ok(activity);

        } catch (Exception e) {
            System.out.println("Error updating activity " + e);
            return ResponseEntity.ok(null);
        }
    }

    @PostMapping("/deleteActivity")
    public ResponseEntity<Integer> deleteActivity(@RequestParam int activityId) {
        try {
            Activity activity = activityService.findById(activityId);
            if (activity != null) {
                activityService.deleteActivityById(activityId);
                return ResponseEntity.ok(activityId);
            } else {
                return ResponseEntity.ok(-1); // Activity not found
            }
        } catch (Exception e) {
            System.out.println("Error deleting activity " + e);
            return ResponseEntity.ok(0); 
        }
    }
}

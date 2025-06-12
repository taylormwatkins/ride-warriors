package com.ridewarriorsportal.rwportal.controller;

import com.ridewarriorsportal.rwportal.model.Visit;
import com.ridewarriorsportal.rwportal.model.User;
import com.ridewarriorsportal.rwportal.service.VisitService;
import com.ridewarriorsportal.rwportal.service.UserService;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Slf4j
@Validated
@RestController
@RequestMapping(path = "/api/visits")
public class VisitController {

    @Autowired
    private VisitService visitService;

    @Autowired
    private UserService userService;

    @GetMapping("/all")
    public List<Visit> viewAllVisits() {
        return visitService.viewAll();
    }

    // TODO: add error handling

    @PostMapping("/add")
    public ResponseEntity<Integer> addVisit(@RequestBody Visit visit, @RequestParam int userId) {

        // snag the user
        User user = userService.findById(userId);

        // set user and save to repository
        visit.setUser(user);
        visitService.saveVisit(visit);

        // return ResponseEntity.ok(visit);
        return ResponseEntity.ok(visit.getId());
    }

    @GetMapping("/getByDate")
    public ResponseEntity<Integer> getByDate(@RequestBody Visit visitRequest, @RequestParam int userId) {

        // get the date object
        LocalDate date = visitRequest.getDate();

        // find the visit
        Visit visit = visitService.findByUserIdAndDate(userId, date);

        if (visit == null) {
            return ResponseEntity.ok(0);
        }

        return ResponseEntity.ok(visit.getId());
    }

    @GetMapping("/getById")
    public ResponseEntity<Visit> getById(@RequestParam int visitId) {
        try {
            Visit visit = visitService.findById(visitId);

            return ResponseEntity.ok(visit);

        } catch (Exception e) {
            System.out.println("Error finding visit " + e);
            return ResponseEntity.ok(null);
        }
    }

    @GetMapping("/getByUser")
    public ResponseEntity<List<Visit>> getByUser(@RequestParam int userId) {

        User user = userService.findById(userId);

        List<Visit> visits = visitService.findAllByUser(user);

        if (visits == null) {
            return ResponseEntity.ok(List.of());
        }

        return ResponseEntity.ok(visits);
    }

    @PutMapping("/updateVisit")
    public ResponseEntity<Visit> updateVisit(@RequestBody Visit updatedVisit, @RequestParam int visitId) {

        try {
            Visit visit = visitService.findById(visitId);

            if (updatedVisit.getWindSpeed() != null) {
                visit.setWindSpeed(updatedVisit.getWindSpeed());
            }
            if (updatedVisit.getTemperature() != null) {
                visit.setTemperature(updatedVisit.getTemperature());
            }
            if (updatedVisit.getHumidity() != null) {
                visit.setHumidity(updatedVisit.getHumidity());
            }
            if (updatedVisit.getUvIndex() != null) {
                visit.setUvIndex(updatedVisit.getUvIndex());
            }
            if (updatedVisit.getRain() != null) {
                visit.setRain(updatedVisit.getRain());
            }

            visitService.saveVisit(visit);
            return ResponseEntity.ok(visit);

        } catch (Exception e) {
            System.out.println("Error updating visit " + e);
            return ResponseEntity.ok(null);
        }
    }

    @PostMapping("/deleteVisit")
    public ResponseEntity<Integer> deleteVisit(@RequestParam int visitId) {
        try {
            visitService.deleteById(visitId);
            return ResponseEntity.ok(visitId);

        } catch (Exception e) {
            System.out.println("Error deleting visit " + e);
            return ResponseEntity.ok(0);
        }
    }
}

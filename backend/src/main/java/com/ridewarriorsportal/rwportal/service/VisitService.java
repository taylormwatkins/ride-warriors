package com.ridewarriorsportal.rwportal.service;

import com.ridewarriorsportal.rwportal.model.Visit;
import com.ridewarriorsportal.rwportal.model.User;

import java.time.LocalDate;
import java.util.List;

public interface VisitService {
    List<Visit> viewAll();

    void saveVisit(Visit visit);

    Visit findByUserIdAndDate(Integer userId, LocalDate date);

    Visit findByDate(LocalDate date);

    Visit findById(Integer id);

    List<Visit> findAllByUser(User user);

}

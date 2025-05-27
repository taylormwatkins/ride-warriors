package com.ridewarriorsportal.rwportal.repository;

import com.ridewarriorsportal.rwportal.model.Activity;
import com.ridewarriorsportal.rwportal.model.Visit;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Integer> {

    List<Activity> findAllByVisit(Visit visit);
}

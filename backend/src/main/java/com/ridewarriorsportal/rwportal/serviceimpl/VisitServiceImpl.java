package com.ridewarriorsportal.rwportal.serviceimpl;

import com.ridewarriorsportal.rwportal.model.Visit;
import com.ridewarriorsportal.rwportal.repository.VisitRepository;
import com.ridewarriorsportal.rwportal.service.VisitService;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;
import java.time.LocalDate;

@Slf4j
@Service
public class VisitServiceImpl implements VisitService {

    @Autowired
    private VisitRepository visitRepo;

    @Override
    public List<Visit> viewAll() {
        return visitRepo.findAll();
    }

    @Override
    public void saveVisit(Visit visit) {
        visitRepo.save(visit);
    }

    @Override
    public Visit findByUserIdAndDate(Integer userId, LocalDate date) {
        Optional<Visit> visit = visitRepo.findByUserIdAndDate(userId, date);
        return visit.orElse(null);
    }

    @Override
    public Visit findByDate(LocalDate date) {
        Optional<Visit> visit = visitRepo.findByDate(date);
        return visit.orElse(null);
    }

    @Override
    public Visit findById(Integer id) {
        Optional<Visit> visit = visitRepo.findById(id);
        return visit.orElse(null);
    }

}

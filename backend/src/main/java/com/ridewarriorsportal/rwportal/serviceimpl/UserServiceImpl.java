package com.ridewarriorsportal.rwportal.serviceimpl;

import com.ridewarriorsportal.rwportal.model.User;
import com.ridewarriorsportal.rwportal.repository.UserRepository;
import com.ridewarriorsportal.rwportal.service.UserService;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;

@Slf4j
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepo;

    @Override
    public List<User> viewAll() {
        return userRepo.findAll();
    }

    @Override
    public User findByName(String name) {
        Optional<User> user = userRepo.findByName(name);
        return user.orElse(null);
    }

    @Override
    // should i change this to Integer?
    public User findById(Integer id) {
        Optional<User> user = userRepo.findById(id);
        return user.orElse(null);
    }

    @Override
    public void saveUser(User user) {
        userRepo.save(user);
    }
}

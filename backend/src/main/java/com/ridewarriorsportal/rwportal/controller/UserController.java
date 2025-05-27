package com.ridewarriorsportal.rwportal.controller;

import com.ridewarriorsportal.rwportal.model.User;
import com.ridewarriorsportal.rwportal.service.UserService;

import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpSession;
import java.util.*;

@Slf4j
@Validated
@RestController
@RequestMapping(path = "/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/all")
    public List<User> viewAllUsers() {
        return userService.viewAll();
    }

    // TODO: these should really be returning response bodies with proper HTTP
    // status codes, not just integers
    // we'll fix that later

    @PostMapping("/newUser")
    public ResponseEntity<Integer> newUser(@RequestBody User user, HttpSession session) {

        // TODO: I need to add some error catching in here
        // right now it's just assumed that everything will be fine

        // create a new user
        userService.saveUser(user);

        // save to http session
        session.setAttribute("userName", user.getName());
        session.setAttribute("userId", user.getId());

        Integer userId = (Integer) session.getAttribute("userId");

        // return a success response
        return ResponseEntity.ok(userId);
    }

    @PostMapping("/login")
    public ResponseEntity<Integer> login(@RequestBody User user, HttpSession session) {

        System.out.println("User: " + user.getName());

        // check if username is provided
        if (user.getName() == null || user.getName().isEmpty()) {
            return ResponseEntity.ok(-1);
        }

        // check if user exists in the database
        User currentUser = userService.findByName(user.getName());

        // if not return 0
        if (currentUser == null) {
            // return ResponseEntity.ok("User not found");
            return ResponseEntity.ok(0);

        }
        // store user's name and id in the session
        session.setAttribute("userName", currentUser.getName());
        session.setAttribute("userId", currentUser.getId());

        Integer userId = (Integer) session.getAttribute("userId");

        // return a success response
        return ResponseEntity.ok(userId);

    }

    @GetMapping("/checkSession")
    public ResponseEntity<Integer> checkSession(HttpSession session) {

        // check if we have a userId attribute in the session
        Integer userId = (Integer) session.getAttribute("userId");

        // if we do, return userId
        // otherwise return 0
        if (userId != null) {
            return ResponseEntity.ok(userId);
        } else {
            return ResponseEntity.ok(0);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Integer> logout(HttpSession session) {
        // there needs to be error handling here as well

        // destroy the session
        session.invalidate(); // destroy the session

        // return a success response
        return ResponseEntity.ok(0);
    }

}
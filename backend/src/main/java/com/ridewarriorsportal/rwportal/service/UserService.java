package com.ridewarriorsportal.rwportal.service;

import com.ridewarriorsportal.rwportal.model.User;
import java.util.*;

public interface UserService {

    List<User> viewAll();

    User findByName(String name);

    User findById(Integer id);

    public void saveUser(User user);

}

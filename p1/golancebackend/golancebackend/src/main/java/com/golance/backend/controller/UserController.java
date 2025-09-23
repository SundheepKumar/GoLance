package com.golance.backend.controller;


import com.golance.backend.dto.LoginResponse;
import com.golance.backend.model.User;
import com.golance.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserService userService;

    //registering a new user
    @PostMapping("/register")
    public User registerUser(@RequestBody User user){
        return userService.registerUser(user);
    }

//    //login user
//    @PostMapping("/login")
//    public String loginUser(@RequestBody User loginRequest){
//        boolean isValid = userService.validateUser(
//                loginRequest.getEmail(),
//                loginRequest.getPassword()
//
//        );
//
//        if(isValid){
//            return "Login Successful";
//        }
//        else{
//            return "Invalid email or password";
//        }
//    }
@PostMapping("/login")
public Object loginUser(@RequestBody User loginRequest) {
    Optional<User> userOpt = userService.findByEmail(loginRequest.getEmail());

    if (userOpt.isPresent()) {
        User user = userOpt.get();
        if (user.getPassword().equals(loginRequest.getPassword())) {
            // return response with user details
            return new LoginResponse(
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getRole(),
                    "Login Successful"
            );
        }
    }
    return new LoginResponse(null, null, null, null, "Invalid email or password");
}

}

package com.golance.backenb.controller;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MyController {

    @GetMapping("/")
    public String home() {
        return "Welcome to Golance Backend!";
    }

    @GetMapping("/hello")
    public String hello() {
        return "Hello World!";
    }
}

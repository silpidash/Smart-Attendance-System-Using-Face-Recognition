package com.cws.sam.controllers;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

@GetMapping("/hello")
    public String greet() {
        return "Welcome to Smart Attendance Management System";
    }

}

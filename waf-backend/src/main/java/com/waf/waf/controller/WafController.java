package com.waf.waf.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import com.waf.waf.service.WafService;
import com.waf.waf.model.RequestLog;
import com.waf.waf.repository.RequestLogRepository;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
public class WafController {

    @Autowired
    private WafService wafService;

    @Autowired
    private RequestLogRepository repository;

    // ✅ Analyze request
    @PostMapping("/analyze")
    public String analyze(@RequestBody String input) {
        return wafService.analyze(input);
    }

    // ✅ Get all logs
    @GetMapping("/logs")
    public List<RequestLog> getLogs() {
        return repository.findAll();
    }
}
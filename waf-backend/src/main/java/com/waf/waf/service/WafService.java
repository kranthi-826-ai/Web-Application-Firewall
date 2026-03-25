package com.waf.waf.service;
    
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.waf.waf.model.RequestLog;
import com.waf.waf.repository.RequestLogRepository;

import java.time.LocalDateTime;

@Service
public class WafService {  

    @Autowired
    private RequestLogRepository repository;

    public String analyze(String input) {

        RequestLog log = new RequestLog();
        log.setRequestData(input);
        log.setTimestamp(LocalDateTime.now());

        if (input.contains("OR 1=1") || input.toLowerCase().contains("select")) {
            log.setStatus("BLOCK");
            log.setAttackType("SQL Injection");
            log.setSeverity("HIGH");
        } 
        else if (input.toLowerCase().contains("<script>")) {
            log.setStatus("BLOCK");
            log.setAttackType("XSS");
            log.setSeverity("HIGH");
        } 
        else {
            log.setStatus("ALLOW");
            log.setAttackType("NONE");
            log.setSeverity("LOW");
        }

        repository.save(log); // 🔥 SAVE TO DB

        return log.getStatus() + " - " + log.getAttackType();
    }
}
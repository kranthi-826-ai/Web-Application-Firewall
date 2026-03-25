package com.waf.waf.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.waf.waf.model.RequestLog;

public interface RequestLogRepository extends JpaRepository<RequestLog, Long> {
}
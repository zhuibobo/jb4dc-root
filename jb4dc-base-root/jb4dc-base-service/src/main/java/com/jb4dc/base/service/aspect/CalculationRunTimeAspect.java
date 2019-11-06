package com.jb4dc.base.service.aspect;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/11/5
 * To change this template use File | Settings | File Templates.
 */
@Aspect
@Component
public class CalculationRunTimeAspect {
    final static Logger log = LoggerFactory.getLogger(CalculationRunTimeAspect.class);

    ThreadLocal<Long> beginTime = new ThreadLocal<>();

    @Pointcut("@annotation(calculationRunTime)")
    public void serviceStatistics(CalculationRunTime calculationRunTime) {
    }

    @Before("serviceStatistics(calculationRunTime)")
    public void doBefore(JoinPoint joinPoint, CalculationRunTime calculationRunTime) {
        // 记录请求到达时间
        beginTime.set(System.currentTimeMillis());
        log.info("计算信息:{}", calculationRunTime.note());
    }

    @After("serviceStatistics(calculationRunTime)")
    public void doAfter(CalculationRunTime calculationRunTime) {
        log.info("Note:{}/Time:{}", calculationRunTime.note(), System.currentTimeMillis() - beginTime.get());
    }
}

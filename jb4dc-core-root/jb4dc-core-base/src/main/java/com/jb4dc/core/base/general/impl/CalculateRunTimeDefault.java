package com.jb4dc.core.base.general.impl;

import com.jb4dc.core.base.general.ICalculateRunTime;

public class CalculateRunTimeDefault {
    public static void CalculateRunTimeDefault(ICalculateRunTime calculateRunTime, String outpre){
        long startTime = System.currentTimeMillis();
        calculateRunTime.Run();
        long endTime = System.currentTimeMillis();
        long runTime=(endTime - startTime);
        System.out.println(outpre+"执行时间:"+runTime);
    }
}

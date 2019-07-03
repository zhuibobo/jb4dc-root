package com.jb4dc.code.generate.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/7/3
 * To change this template use File | Settings | File Templates.
 */

@Controller
@RequestMapping("/jb4dc/codegenerate")
public class CoderGenerateController {

    @RequestMapping("/manager")
    public ModelAndView manager(){
        ModelAndView modelAndView=new ModelAndView();
        modelAndView.setViewName("CodeGenerate/Manager");
        return modelAndView;
    }
}

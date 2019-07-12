package com.jb4dc.feb.dist.webserver.rest.base;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jb4dc.core.base.exception.JBuild4DCGenerallyException;
import com.jb4dc.core.base.vo.JBuild4DCResponseVo;
import org.springframework.web.bind.annotation.RequestBody;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.text.ParseException;

public interface IGeneralRest<T> {

    JBuild4DCResponseVo getListData(Integer pageSize, Integer pageNum, String search_condition, boolean loadDict) throws IOException, ParseException;

    JBuild4DCResponseVo saveEdit(@RequestBody T entity, HttpServletRequest request) throws Exception;

    JBuild4DCResponseVo statusChange(String ids, String status, HttpServletRequest request) throws JsonProcessingException;

    JBuild4DCResponseVo delete(String recordId, HttpServletRequest request) throws JBuild4DCGenerallyException, JsonProcessingException;

    JBuild4DCResponseVo move(String recordId, String type, HttpServletRequest request) throws JBuild4DCGenerallyException, JsonProcessingException;
}

package com.musicjournal.musicjournal.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

// SPA fallback — API·정적 리소스가 아닌 경로를 index.html로 forward
// 브라우저 새로고침·직접 URL 접근 시 React 앱이 정상 로드되도록 보장
@Controller
public class SpaController {

    @GetMapping("/{path:[^\\.]*}")
    public String forward() {
        return "forward:/index.html";
    }
}

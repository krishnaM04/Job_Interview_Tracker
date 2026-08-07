package com.examly.springapp.util;

import java.time.LocalDate;

public class DateUtil {

    public static String today() {
        return LocalDate.now().toString();
    }
}
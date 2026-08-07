package com.examly.springapp.util;

public class ValidationUtil {

    public static boolean isNullOrBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
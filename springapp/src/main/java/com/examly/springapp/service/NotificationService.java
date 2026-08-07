package com.examly.springapp.service;

import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    public Object sendNotification(Object notification) {
        return "Notification sent";
    }

    public Object broadcastNotification(Object notification) {
        return "Notification broadcasted to all users";
    }
}
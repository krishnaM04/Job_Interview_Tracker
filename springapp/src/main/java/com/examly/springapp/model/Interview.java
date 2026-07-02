package com.examly.springapp.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GenerationValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.time.LocalDate;
    @Entity
    public class Interview{

        @Id
        @GenerationValue(strategy = GenerationType.IDENTITY)
        private Long interviewId;

        private String candidateName;
        private String companyName;
        private String jobTitle;
        private LocalDate interviewDate;
        private String interviewType;
        private String status;
        private String feedback;

        public Interview() {}

    }
}

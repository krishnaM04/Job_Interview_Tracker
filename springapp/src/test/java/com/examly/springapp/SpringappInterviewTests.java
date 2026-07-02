package com.examly.springapp;

import java.io.File;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(classes = SpringappApplication.class)
@AutoConfigureMockMvc
public class SpringappInterviewTests {

    @Autowired
    private MockMvc mockMvc;

    // === API TESTS ===

    @Test
    void SpringBoot_DevelopCoreAPIsAndBusinessLogic_test_Add_Interview() throws Exception {
        String json = """
        {
          "candidateName": "John Doe",
          "companyName": "Acme Corp",
          "jobTitle": "Software Engineer",
          "interviewDate": "2025-08-10",
          "interviewType": "Technical",
          "status": "Scheduled",
          "feedback": "N/A"
        }
        """;

        mockMvc.perform(post("/api/interviews")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    void SpringBoot_DevelopCoreAPIsAndBusinessLogic_test_Get_All_Interviews() throws Exception {
        mockMvc.perform(get("/api/interviews")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    // === DIRECTORY CHECKS ===

    @Test
    void SpringBoot_ProjectAnalysisAndUMLDiagram_test_Controller_Directory_Exists() {
        File dir = new File("src/main/java/com/examly/springapp/controller");
        assertTrue(dir.exists() && dir.isDirectory());
    }

    @Test
    void SpringBoot_ProjectAnalysisAndUMLDiagram_test_Model_Directory_Exists() {
        File dir = new File("src/main/java/com/examly/springapp/model");
        assertTrue(dir.exists() && dir.isDirectory());
    }

    @Test
    void SpringBoot_ProjectAnalysisAndUMLDiagram_test_Repository_Directory_Exists() {
        File dir = new File("src/main/java/com/examly/springapp/repository");
        assertTrue(dir.exists() && dir.isDirectory());
    }

    @Test
    void SpringBoot_ProjectAnalysisAndUMLDiagram_test_Service_Directory_Exists() {
        File dir = new File("src/main/java/com/examly/springapp/service");
        assertTrue(dir.exists() && dir.isDirectory());
    }

    // === FILE CHECKS ===

    @Test
    void SpringBoot_DatabaseAndSchemaSetup_test_InterviewModel_File_Exists() {
        File file = new File("src/main/java/com/examly/springapp/model/Interview.java");
        assertTrue(file.exists());
    }

    @Test
    void SpringBoot_ProjectAnalysisAndUMLDiagram_test_InterviewController_File_Exists() {
        File file = new File("src/main/java/com/examly/springapp/controller/InterviewController.java");
        assertTrue(file.exists());
    }

    @Test
    void SpringBoot_ProjectAnalysisAndUMLDiagram_test_InterviewRepository_File_Exists() {
        File file = new File("src/main/java/com/examly/springapp/repository/InterviewRepository.java");
        assertTrue(file.exists());
    }

    @Test
    void SpringBoot_ProjectAnalysisAndUMLDiagram_test_InterviewService_File_Exists() {
        File file = new File("src/main/java/com/examly/springapp/service/InterviewService.java");
        assertTrue(file.exists());
    }

    // === CLASS CHECKS ===

    @Test
    void SpringBoot_ProjectAnalysisAndUMLDiagram_test_InterviewModel_Class_Exists() {
        checkClassExists("com.examly.springapp.model.Interview");
    }

    // === FIELD CHECKS ===

    @Test
    void SpringBoot_ProjectAnalysisAndUMLDiagram_test_Interview_Has_CandidateName_Field() {
        checkFieldExists("com.examly.springapp.model.Interview", "candidateName");
    }

    // === UTILITY METHODS ===

    private void checkClassExists(String className) {
        try {
            Class.forName(className);
        } catch (ClassNotFoundException e) {
            fail("Class " + className + " does not exist.");
        }
    }

    private void checkFieldExists(String className, String fieldName) {
        try {
            Class<?> clazz = Class.forName(className);
            clazz.getDeclaredField(fieldName);
        } catch (ClassNotFoundException | NoSuchFieldException e) {
            fail("Field " + fieldName + " not found in " + className);
        }
    }
}

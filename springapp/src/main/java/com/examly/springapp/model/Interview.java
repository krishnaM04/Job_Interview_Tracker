package com.examly.springapp.model;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GeneratedType;
import jakarta.persistence.ID;

@Entity
public class Interview{
    @ID
    @GeneratedValue(strategy = GeneratedType.IDENTITY)
    private long id;
    private String candidateName;
    private String company;
    private String role;
    private String interviewDate;
    private String status;

    public Interview(){

    }
    
    public Interview(Long id,String candidateName, String company, String role,String interviewDate,String status){
        this.id=id;
        this.candidateName=candidateName;
        this.company = company;
        this.role=role;
        this.interviewDate=interviewDate;
        this.status=status;
    }

    public Long getid(){
        return id;
    }
    public void setId(Long id){
        this.id=id;
    }
    public String getCandidateName(){
        return candidateName;
    }

    public void setCandidateName(String candidateName){
        this.candidateName=candidateName;
    }
    public String getCompany(){
        return company;
    }
    public void setCompany(String company){
        this.company=company;
    }
    public String getRole(){
        return role;
    }
    public void setRole(String role){
        this.role=role;
    }
    public String getInterviewDate(){
        return interviewDate;
    }
    public void setInterviewDate(String interviewDate){
        this.interviewDate=interviewDate;
    }
    public String getStatus(){
        return status;
    }
    public void setStatus(String status){
        this.status=status;
    }
}

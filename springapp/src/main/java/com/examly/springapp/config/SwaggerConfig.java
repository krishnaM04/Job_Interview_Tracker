package com.examly.springapp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiKey;
import springfox.documentation.service.AuthorizationScope;
import springfox.documentation.service.SecurityReference;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spi.service.contexts.SecurityContext;
import springfox.documentation.spring.web.plugins.Docket;

import java.security.Principal;
import java.util.List;

@Configuration
public class SwaggerConfig {

    @Bean
    public Docket api() {
        return new Docket(DocumentationType.SWAGGER_2)
                .ignoredParameterTypes(
                        java.security.Principal.class,
                        org.springframework.security.core.Authentication.class
                )
                .select()
                .apis(RequestHandlerSelectors.basePackage("com.examly.springapp"))
                .paths(PathSelectors.any())
                .build()
                .securitySchemes(List.of(new ApiKey("Bearer", "Authorization", "header")))
                .securityContexts(List.of(
                        SecurityContext.builder()
                                .securityReferences(List.of(
                                        new SecurityReference("Bearer",
                                                new AuthorizationScope[]{
                                                        new AuthorizationScope("global", "accessEverything")
                                                })
                                ))
                                .forPaths(PathSelectors.ant("/secured/**"))
                                .build()
                ));
    }
}

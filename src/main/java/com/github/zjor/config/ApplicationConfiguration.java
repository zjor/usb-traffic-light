package com.github.zjor.config;

import com.github.zjor.ampel.cleware.TrafficLight;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ApplicationConfiguration {

    @Bean
    public TrafficLight trafficLight() {
        return new TrafficLight();
    }

}

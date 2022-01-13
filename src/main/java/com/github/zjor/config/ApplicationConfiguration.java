package com.github.zjor.config;

import com.github.zjor.ampel.cleware.TrafficLight;
import com.github.zjor.ampel.cleware.TrafficLightDriver;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ApplicationConfiguration {

    @Bean
    public TrafficLightDriver trafficLightDriver() {
        return new TrafficLightDriver();
    }

    @Bean
    public TrafficLight trafficLight(TrafficLightDriver driver) {
        return new TrafficLight(driver);
    }

}

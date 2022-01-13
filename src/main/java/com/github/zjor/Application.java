package com.github.zjor;

import com.github.zjor.ampel.cleware.TrafficLight;
import com.github.zjor.ampel.cleware.TrafficLightDriver;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;

@Slf4j
@SpringBootApplication
public class Application {

    public static void main(String[] args) {
        ApplicationContext context = SpringApplication.run(Application.class, args);
        TrafficLightDriver driver = context.getBean(TrafficLightDriver.class);
        driver.init();

        if (driver.isInitialized()) {
            TrafficLight light = context.getBean(TrafficLight.class);
            light.setState(light.getState());
        } else {
            log.warn("TrafficLightDriver is not initialized");
        }
    }
}

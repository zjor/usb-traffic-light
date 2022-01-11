package com.github.zjor;

import com.github.zjor.ampel.cleware.TrafficLight;
import com.github.zjor.ampel.cleware.TrafficLightState;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/traffic-light")
public class TrafficLightController {

    private final TrafficLight trafficLight;

    public TrafficLightController(TrafficLight trafficLight) {
        this.trafficLight = trafficLight;
    }

    @GetMapping("state")
    public TrafficLightState getState() {
        return trafficLight.getState();
    }

    @PostMapping("state")
    public TrafficLightState setState(@RequestBody TrafficLightState req) {
        trafficLight.setState(req);
        return trafficLight.getState();
    }

}

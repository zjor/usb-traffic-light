package com.github.zjor.ampel.cleware;

import lombok.extern.slf4j.Slf4j;

/**
 * Provides abstraction layer over Traffic Light.
 * Maintains state of the device.
 */
@Slf4j
public class TrafficLight {

    private final TrafficLightDriver driver;

    /**
     * [red, yellow, green]
     */
    private boolean[] state = new boolean[]{false, false, false};

    public TrafficLight(TrafficLightDriver driver) {
        this.driver = driver;
    }

    public TrafficLightState getState() {
        return new TrafficLightState(state[0], state[1], state[2]);
    }

    public void setState(TrafficLightState state) {
        setState(state.isRed(), state.isYellow(), state.isGreen());
    }

    public void setState(boolean red, boolean yellow, boolean green) {
        driver.write(TrafficLightDriver.COLOR_RED, red);
        driver.write(TrafficLightDriver.COLOR_YELLOW, yellow);
        driver.write(TrafficLightDriver.COLOR_GREEN, green);
        state = new boolean[]{red, yellow, green};
    }

}

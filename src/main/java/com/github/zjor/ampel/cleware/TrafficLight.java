package com.github.zjor.ampel.cleware;

import static com.github.zjor.ampel.cleware.TrafficLightDriver.*;

/**
 * Provides abstraction layer over Traffic Light.
 * Maintains state of the device.
 */
public class TrafficLight {

    private TrafficLightDriver driver;

    private Indicator red, yellow, green;

    public TrafficLight() {
        driver = new TrafficLightDriver();
        driver.init();

        red = new Indicator(driver, COLOR_RED);
        yellow = new Indicator(driver, COLOR_YELLOW);
        green = new Indicator(driver, COLOR_GREEN);

        red.setEnabled(false);
        yellow.setEnabled(false);
        green.setEnabled(false);
    }

    public TrafficLightState getState() {
        return new TrafficLightState(red.isEnabled(), yellow.isEnabled(), green.isEnabled());
    }

    public void setState(TrafficLightState state) {
        red.setEnabled(state.isRed());
        yellow.setEnabled(state.isYellow());
        green.setEnabled(state.isGreen());
    }

    public void setState(boolean red, boolean yellow, boolean green) {
        setState(new TrafficLightState(red, yellow, green));
    }

}

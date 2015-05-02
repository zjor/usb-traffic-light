package edu.royz.cleware.ampel;

import static edu.royz.cleware.ampel.TrafficLightDriver.*;

/**
 * Provides abstraction layer over Traffic Light.
 * Maintains state of the device.
 */
public class TrafficLightController {

    private TrafficLightDriver driver;

    private Indicator red, yellow, green;

    public TrafficLightController() {
        driver = new TrafficLightDriver();
        driver.init();

        red = new Indicator(driver, COLOR_RED);
        yellow = new Indicator(driver, COLOR_YELLOW);
        green = new Indicator(driver, COLOR_GREEN);

        red.set(false);
        yellow.set(false);
        green.set(false);
    }

    public Indicator getRed() {
        return red;
    }

    public Indicator getYellow() {
        return yellow;
    }

    public Indicator getGreen() {
        return green;
    }

}

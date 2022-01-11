package com.github.zjor.ampel;

import static com.github.zjor.ampel.TrafficLightDriver.VALUE_OFF;
import static com.github.zjor.ampel.TrafficLightDriver.VALUE_ON;

public class Indicator {

    private byte color;
    private boolean enabled;
    private TrafficLightDriver driver;

    Indicator(TrafficLightDriver driver, byte color) {
        this.driver = driver;
        this.color = color;
    }

    public boolean get() {
        return enabled;
    }

    public void set(boolean v) {
        if (v != enabled) {
            enabled = v;
            driver.write(color, enabled ? VALUE_ON : VALUE_OFF);
        }
    }

    public void toggle() {
        set(!enabled);
    }
}

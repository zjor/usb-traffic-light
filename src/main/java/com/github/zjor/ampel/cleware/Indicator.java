package com.github.zjor.ampel.cleware;

import lombok.Getter;

import static com.github.zjor.ampel.cleware.TrafficLightDriver.VALUE_OFF;
import static com.github.zjor.ampel.cleware.TrafficLightDriver.VALUE_ON;

public class Indicator {

    private final TrafficLightDriver driver;
    private final byte color;

    @Getter
    private boolean enabled;

    Indicator(TrafficLightDriver driver, byte color) {
        this.driver = driver;
        this.color = color;
    }

    public void setEnabled(boolean v) {
        enabled = v;
        driver.write(color, enabled ? VALUE_ON : VALUE_OFF);
    }
}

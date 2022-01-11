package com.github.zjor.ampel.cleware;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrafficLightState {
    private boolean red;
    private boolean yellow;
    private boolean green;
}

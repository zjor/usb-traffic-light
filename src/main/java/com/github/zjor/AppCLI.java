package com.github.zjor;

import com.github.zjor.ampel.cleware.TrafficLight;

public class AppCLI {
    public static void main(String[] args) throws InterruptedException {
        TrafficLight light = new TrafficLight();
        Thread t = new Thread(new Worker(light));
        t.start();

        t.join();
    }

    public static class Worker implements Runnable {

        public static final long DELAY = 2000L;

        boolean[] redPattern = new boolean[]{false, false, true, true};
        boolean[] yellowPattern = new boolean[]{false, true, false, true};
        boolean[] greenPattern = new boolean[]{true, false, false, false};

        int time;

        private TrafficLight controller;

        Worker(TrafficLight controller) {
            this.controller = controller;
        }

        @Override
        public void run() {
            while (true) {
                try {
                    Thread.sleep(DELAY);
                    controller.setState(
                            redPattern[time % 4],
                            yellowPattern[time % 4],
                            greenPattern[time % 4]
                    );

                    time++;
                } catch (InterruptedException e) {
                }
            }
        }
    }
}

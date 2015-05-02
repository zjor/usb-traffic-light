package edu.royz;

import edu.royz.cleware.ampel.TrafficLightController;

public class App {
    public static void main(String[] args) throws InterruptedException {
        TrafficLightController light = new TrafficLightController();
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

        private TrafficLightController controller;

        Worker(TrafficLightController controller) {
            this.controller = controller;
        }

        @Override
        public void run() {
            while (true) {
                try {
                    Thread.sleep(DELAY);
                    controller.getRed().set(redPattern[time % 4]);
                    controller.getYellow().set(yellowPattern[time % 4]);
                    controller.getGreen().set(greenPattern[time % 4]);

                    time++;
                } catch (InterruptedException e) {
                }
            }
        }
    }
}

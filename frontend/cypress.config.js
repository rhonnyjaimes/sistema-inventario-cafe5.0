import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173/", // <-- Agrega esto
    video: false,
    screenshortOnRunFailure: true,
    viewporthWidth: 1200,
    defaultCommandTimeout: 5000,
    defaultCommandTimeout: 15000, // Aumentar timeout global
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});

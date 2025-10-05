import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { seedDatabase } from "./lib/seedData";

// Initialize MSW and seed database
async function enableMocking() {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const { worker } = await import('./lib/mocks/browser');

    await worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: {
        url: '/mockServiceWorker.js',
      },
    });

    console.log('MSW started successfully');

    // Seed database on first load
    await seedDatabase();
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error initializing MSW or seeding database:', error);
    // Continue with app initialization even if MSW fails
  }
}

enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(<App />);
}).catch((error) => {
  console.error('Failed to initialize app:', error);
  // Still try to render the app
  createRoot(document.getElementById("root")!).render(<App />);
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      '@fullcalendar/core',
      '@fullcalendar/daygrid',
      '@fullcalendar/react',
    ],
  },
  resolve: {
    // Ensures Vite properly respects FullCalendar's conditional module exports
    mainFields: ['module', 'main'],
  },
});
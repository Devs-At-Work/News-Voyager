import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173, // Port used by docker container
    strictPort: true,
     watch: {
       usePolling: true
     },
     allowedHosts: [
      'k8s-newsvoyagergroup-3ca1d929c3-709340557.us-west-2.elb.amazonaws.com',
      'localhost'
    ]
  }
})

import { defineStore } from 'pinia';
import axios from 'axios';

const apiUrl = process.env.VUE_APP_BACKEND_URL;

export const useCheckPatientStore = defineStore('checkPatientStore', {
  state: () => ({
    name: '',
    room: '',
    accommodation: '',
    appointment: null,
    noMatchFound: false,
    errorMessage: '',
  }),
  actions: {
    async checkPatient() {
      try {
        // Reset state before making a request
        this.errorMessage = '';
        this.noMatchFound = false;
        this.appointment = null;

        console.log('Checking patient:', {
          name: this.name,
          room: this.room,
          accommodation: this.accommodation,
        });

        // Make the API request
        const response = await axios.get(`${apiUrl}/api/patients/find-patient`, {
          params: {
            name: this.name,
            room: this.room,
            accommodation: this.accommodation,
          },
        });

        console.log('Response received:', response.data);

        // Check if the response contains data
        if (response.data && response.data.length > 0) {
          // Match found
          this.appointment = response.data[0];
          this.noMatchFound = false;
        } else {
          // No match found
          this.noMatchFound = true;
        }
      } catch (error) {
        // Handle specific cases for different error statuses
        if (error.response) {
          if (error.response.status === 404) {
            // Treat 404 as "no match found"
            console.warn('No match found:', error.response.data);
            this.noMatchFound = true;
            this.errorMessage = '';
          } else {
            // Other server errors
            console.error('Server error:', error.response.data);
            this.errorMessage = 'An error occurred on the server. Please try again later.';
          }
        } else if (error.request) {
          console.error('No response received:', error.request);
          this.errorMessage = 'Unable to connect to the server. Please check your network connection.';
        } else {
          console.error('Error:', error.message);
          this.errorMessage = 'An unexpected error occurred. Please try again.';
        }
      }
    },
    resetStore() {
      console.log('Resetting store');
      this.name = '';
      this.room = '';
      this.accommodation = '';
      this.appointment = null;
      this.noMatchFound = false;
      this.errorMessage = '';
    },
  },
});
 
<template>
    <div class="driver-view-container container">
        <h2 class="title is-2">{{ $t("driver.heading") }}</h2>

        <!-- Show the schedule if no ride is selected -->
        <div v-if="!selectedRide">
            <table class="table is-fullwidth is-striped mb-5">
                <thead>
                    <tr>
                        <th>{{ $t("driver.departureTime") }}</th>
                        <th>{{ $t("driver.hospital") }}</th>
                        <th>{{ $t("driver.viewPassengers") }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="ride in rides" :key="ride.id">
                        <td>{{ formatTime(ride.departure_time) }}</td>
                        <td>{{ ride.hospital_name }}</td>
                        <td>
                            <button class="button is-light" @click="viewPassengers(ride.id)">
                                {{ $t("driver.viewButton") }}
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Show the ride details if a ride is selected -->
        <div v-else>
            <RideDetailsOverlay :ride="selectedRide" @close="selectedRide = null" @back="selectedRide = null" />
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import RideDetailsOverlay from '@/components/RideDetailsOverlay.vue';
const apiUrl = process.env.VUE_APP_BACKEND_URL;

export default {
    components: {
        RideDetailsOverlay,
    },
    data() {
        return {
            rides: [], // List of rides
            selectedRide: null, // Currently selected ride details
        };
    },
    mounted() {
        this.fetchRides();
    },
    computed: {
        // Access the auth store to get the token
        authStore() {
            return useAuthStore();
        },
    },
    methods: {
        // Fetch the list of rides
        async fetchRides() {
            try {
                const response = await axios.get(`${apiUrl}/api/rides/driver_view`);
                console.log('Fetched rides:', response.data); // Log the fetched rides
                this.rides = response.data;
            } catch (error) {
                console.error('Error fetching rides:', error);
            }
        },
        // Fetch the passengers for a specific ride
        async viewPassengers(rideId) {
            try {
                const response = await axios.get(`${apiUrl}/api/rides/${rideId}/patients/`);
                console.log('API Response for passengers:', response.data); // Debugging log
                this.selectedRide = {
                    id: rideId,
                    patients: response.data.patients || [], // Ensure patients is an array
                };
                console.log('Selected Ride:', this.selectedRide); // Confirm selectedRide structure
            } catch (error) {
                console.error('Error fetching passengers:', error);
                this.selectedRide = null; // Reset on failure
            }
        },
        // Format time strings
        formatTime(time) {
            return time ? time.substring(0, 5) : 'N/A'; // Handle missing time
        },
    },
};
</script>

<style scoped>
.driver-view-container {
    padding: 20px;
}

.table {
    margin-top: 20px;
}
</style>
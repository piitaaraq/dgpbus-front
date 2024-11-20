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
        RideDetailsOverlay
    },
    data() {
        return {
            rides: [],
            selectedRide: null,
            ridePatients: []
        };
    },
    mounted() {
        this.fetchRides();
    },
    computed: {
        // Access the auth store to get the token
        authStore() {
            return useAuthStore();
        }
    },
    methods: {
        // Fetch the list of rides
        async fetchRides() {
            try {
                const response = await axios.get(`${apiUrl}/api/rides/driver_view`);
                this.rides = response.data;
            } catch (error) {
                console.error('Error fetching rides:', error);
            }
        },
        // Fetch the patients assigned to a specific ride
        async viewPassengers(rideId) {
            try {
                // Fetch ride details along with patients
                const response = await axios.get(`${apiUrl}/api/rides/${rideId}/patients/`);
                this.selectedRide = { id: rideId, patients: response.data };
            } catch (error) {
                console.error('Error fetching passengers:', error);
            }
        },
        formatTime(time) {
            return time ? time.substring(0, 5) : '';
        }
    }
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
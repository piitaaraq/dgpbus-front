<template>
    <div class="driver-view-container container">
        <h2 class="title is-2">{{ $t("driver.heading") }}</h2>

        <!-- Show the schedule if no ride is selected -->
        <div v-if="!selectedRide">
            <table class="table is-fullwidth is-striped mb-5">
                <thead>
                    <tr>
                        <th>{{ $t("driver.departureTime") }}</th>
                        <th>{{ $t("driver.viewPassengers") }}</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-for="group in todayRides" :key="group.departure_time">
                        <!-- Row for the departure time -->
                        <tr>
                            <td :rowspan="group.destinations.length">
                                {{ formatTime(group.departure_time) }}
                            </td>
                            <td>
                                <button class="button is-light" @click="viewPassengers(group.destinations[0]?.id)">
                                    {{ $t("driver.viewButton") }}
                                </button>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>

            <!-- Header for today's rides -->
            <h3 class="title is-4">{{ $t("driver.todayRidesHeading") }}</h3>

            <table class="table is-fullwidth is-striped">
                <thead>
                    <tr>
                        <th>{{ $t("driver.departureTime") }}</th>
                        <th>{{ $t("driver.hospital") }}</th>
                        <th>{{ $t("driver.name") }}</th>
                        <th>{{ $t("driver.room") }}</th>
                        <th>{{ $t("driver.checkedIn") }}</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-for="ride in todayRides" :key="ride.id">
                        <tr v-for="patient in ride.patients" :key="patient.id">
                            <td>{{ formatTime(ride.departure_time) }}</td>
                            <td>{{ ride.destination }}</td>
                            <td>{{ patient.name }}</td>
                            <td>{{ patient.room }}</td>
                            <td>
                                <span v-if="patient.checked_in">
                                    {{ $t("driver.checkedIn") }}
                                </span>
                                <span v-else>
                                    {{ $t("driver.notCheckedIn") }}
                                </span>
                            </td>
                        </tr>
                    </template>
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
            todayRides: [], // List of all rides today
            selectedRide: null, // Currently selected ride details
        };
    },
    mounted() {
        this.fetchRides();
        this.fetchTodayRides();
    },
    computed: {
        // Access the auth store to get the token
        authStore() {
            return useAuthStore();
        },
    },
    methods: {


        groupByDepartureTime(rides) {
            // Group rides by departure_time
            const grouped = rides.reduce((acc, ride) => {
                if (!acc[ride.departure_time]) {
                    acc[ride.departure_time] = [];
                }
                acc[ride.departure_time].push(ride);
                return acc;
            }, {});

            // Convert grouped object into an array for easier rendering
            return Object.keys(grouped).map((time) => ({
                departure_time: time,
                destinations: grouped[time],
            }));
        },
        // Fetch today's rides
        async fetchTodayRides() {
            try {
                const response = await axios.get(`${apiUrl}/api/rides/today`);
                const rides = response.data;

                // Transform the rides data
                this.todayRides = this.groupByDepartureTime(rides);
            } catch (error) {
                console.error('Error fetching today\'s rides:', error);
            }
        },

        // Fetch the list of rides
        async fetchRides() {
            try {
                const response = await axios.get(`${apiUrl}/api/rides/driver_view`);
                this.rides = response.data;
            } catch (error) {
                console.error('Error fetching rides:', error);
            }
        },

        // Fetch the passengers for a specific ride
        async viewPassengers(rideId) {
            try {
                const response = await axios.get(`${apiUrl}/api/rides/${rideId}/patients/`);
                this.selectedRide = {
                    id: rideId,
                    patients: response.data.patients || [], // Ensure patients is an array
                };
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
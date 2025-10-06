<template>
    <div class="ride-details">
        <button class="button is-light mb-4" @click="goBack">
            {{ $t("driver.backButton") }}
        </button>

        <h3 class="title is-4">
            {{ $t("driver.passengersHeading") }} - {{ ride.departure_time }}
        </h3>
        <table class="table is-fullwidth">
            <thead>
                <tr>
                    <th>{{ $t("driver.name") }}</th>
                    <th>{{ $t("driver.room") }}</th>
                    <th>{{ $t("driver.hospital") }}</th>
                    <th>{{ $t("driver.checkedIn") }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(patient, index) in ride.patients" :key="index">
                    <td>{{ patient.name }}</td>
                    <td>{{ patient.room }}</td>
                    <td>{{ patient.destination }}</td>
                    <td>
                        <input type="checkbox" v-model="patient.checked_in" />
                    </td>
                </tr>
            </tbody>
        </table>

        <button class="button is-primary mt-4" @click="confirmAllUpdates" :disabled="isLoading">
            <font-awesome-icon icon="check" /> {{ $t("driver.confirmAll") }}
        </button>
    </div>
</template>


<script>
import api from '@/api';

export default {
    data() {
        return {
            ride: null, // Holds the current ride details
            isLoading: false,
        };
    },
    async created() {
        await this.fetchRideDetails();
    },
    methods: {
        async fetchRideDetails() {
            const rideId = parseInt(this.$route.params.id);
            try {
                // Fetch all rides for today
                const response = await api.get('rides/today/');
                const todayRides = response.data;

                // Find the departure_time of the selected ride
                const currentRide = todayRides.find(ride => ride.id === rideId);
                if (!currentRide) {
                    throw new Error('Ride not found');
                }

                // Filter rides with the same departure_time
                const groupedRides = todayRides.filter(
                    ride => ride.departure_time === currentRide.departure_time
                );

                // Combine patients from all rides with the same departure_time
                const combinedPatients = groupedRides.flatMap(ride => ride.patients);

                // Set the ride data with combined patients
                this.ride = {
                    ...currentRide,
                    patients: combinedPatients,
                };
            } catch (error) {
                console.error('Error fetching ride details:', error);
            }
        },
        async confirmAllUpdates() {
            this.isLoading = true;
            try {
                const response = await api.patch('rides/${this.ride.id}/toggle-status/');
                this.ride.status = response.data.status;
                alert(this.$t("driver.updateSuccess"));
            } catch (error) {
                console.error('Error updating ride status:', error);
                alert(this.$t("driver.updateError"));
            } finally {
                this.isLoading = false;
            }
        },
        goBack() {
            this.$router.go(-1);
        },
    },
};
</script>

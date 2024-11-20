<template>
    <div class="ride-details">
        <button class="button is-light mb-4" @click="goBack">
            <font-awesome-icon :icon="['fas', 'arrow-left']" /> {{ $t("driver.backButton") }}
        </button>

        <h3 class="title is-4">{{ $t("driver.passengersHeading") }}</h3>
        <table class="table is-fullwidth">
            <thead>
                <tr>
                    <th>{{ $t("driver.name") }}</th>
                    <th>{{ $t("driver.room") }}</th>
                    <th>{{ $t("driver.status") }}</th>
                    <th>{{ $t("driver.checkedIn") }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="patient in ride.patients" :key="patient.id">
                    <td>{{ patient.name }}</td>
                    <td>{{ patient.room }}</td>
                    <td>{{ patient.status ? $t("driver.checkedIn") : $t("driver.notCheckedIn") }}</td>
                    <td>
                        <input type="checkbox" v-model="patient.status" />
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
import axios from 'axios';
const apiUrl = process.env.VUE_APP_BACKEND_URL;

export default {
    data() {
        return {
            ride: null,
            isLoading: false
        };
    },
    async created() {
        await this.fetchRideDetails();
    },
    methods: {
        async fetchRideDetails() {
            const rideId = this.$route.params.id;
            try {
                const response = await axios.get(`${apiUrl}/api/rides/${rideId}/`);
                this.ride = response.data;
            } catch (error) {
                console.error('Error fetching ride details:', error);
            }
        },
        async confirmAllUpdates() {
            this.isLoading = true;
            try {
                const response = await axios.patch(`${apiUrl}/api/rides/${this.ride.id}/toggle-status/`);
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
        }
    }
};
</script>

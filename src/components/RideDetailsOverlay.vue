<template>
    <div class="ride-details">
        <!-- Back button to return to the schedule -->
        <button class="button is-light mb-4" @click="closeDetails">
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
                <tr v-for="ridePatient in ridePatients" :key="ridePatient.id">
                    <td>{{ ridePatient.patient.name }}</td>
                    <td>{{ ridePatient.patient.room }}</td>
                    <td>{{ ridePatient.checked_in ? $t("driver.checkedIn") : $t("driver.notCheckedIn") }}</td>
                    <td>
                        <input type="checkbox" :checked="ridePatient.checked_in" @change="toggleCheckIn(ridePatient)" />
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import axios from 'axios';
const apiUrl = process.env.VUE_APP_BACKEND_URL;

export default {
    props: {
        ride: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            ridePatients: [], // Holds the patients assigned to the ride along with check-in status
            isLoading: false
        };
    },
    async mounted() {
        await this.fetchRidePatients();
    },
    methods: {
        async fetchRidePatients() {
            try {
                const response = await axios.get(`${apiUrl}/api/rides/${this.ride.id}/patients/`);
                this.ridePatients = response.data;
            } catch (error) {
                console.error('Error fetching ride patients:', error);
            }
        },
        async toggleCheckIn(ridePatient) {
            try {
                const response = await axios.patch(`${apiUrl}/api/rides/${this.ride.id}/toggle-check-in/`, {
                    patient_id: ridePatient.patient.id
                });
                ridePatient.checked_in = response.data.checked_in;
            } catch (error) {
                console.error('Error toggling check-in status:', error);
                alert(this.$t("driver.updateError"));
            }
        },
        closeDetails() {
            this.$emit('close');
        }
    }
};

</script>


<style scoped>
.ride-details {
    padding: 20px;
}

.button {
    margin-bottom: 15px;
}

.table th,
.table td {
    width: 25%;
    text-align: left;
    white-space: nowrap;
}
</style>

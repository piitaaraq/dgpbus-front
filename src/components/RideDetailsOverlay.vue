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
                    <th>{{ $t("driver.toggle") }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="ridePatient in ridePatients" :key="ridePatient.id"
                    :class="{ 'is-checked-in': ridePatient.checked_in }">
                    <td>{{ ridePatient.patient?.name || 'Unknown Name' }}</td>
                    <td>{{ ridePatient.patient?.room || 'N/A' }}</td>
                    <td>{{ ridePatient.checked_in ? $t("driver.checkedIn") : $t("driver.notCheckedIn") }}</td>
                    <td>
                        <button @click="toggleCheckIn(ridePatient)"
                            :class="['button check-in-btn', ridePatient.checked_in ? 'is-warning' : 'is-success']">
                            {{ ridePatient.checked_in ? $t('driver.ikkeMed') : $t('driver.med') }}
                        </button>
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
            required: true,
        },
    },
    data() {
        return {
            ridePatients: [], // Holds the patients assigned to the ride along with check-in status
        };
    },
    async mounted() {
        await this.fetchRidePatients();
    },
    methods: {
        async fetchRidePatients() {
            try {
                const response = await axios.get(`${apiUrl}/api/rides/${this.ride.id}/patients/`);
                console.log('API Response for ride patients:', response.data);

                // Transform response if needed
                this.ridePatients = (response.data.patients || []).map(patient => ({
                    id: patient.id,
                    patient: {
                        name: patient.name || 'Unknown Name',
                        room: patient.room || 'N/A',
                    },
                    checked_in: patient.checked_in || false,
                }));
            } catch (error) {
                console.error('Error fetching ride patients:', error);
            }
        },
        async toggleCheckIn(ridePatient) {
            try {
                console.log('Toggling check-in for patient ID:', ridePatient.id); // Debugging log
                const response = await axios.patch(`${apiUrl}/api/rides/${this.ride.id}/toggle-check-in/`, {
                    patient_id: ridePatient.id, // Use ridePatient.id directly
                });
                ridePatient.checked_in = response.data.checked_in; // Update the local state
            } catch (error) {
                console.error('Error toggling check-in status:', error);
                alert(this.$t("driver.updateError"));
            }
        },
        closeDetails() {
            this.$emit('close');
        },
    },
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

.is-checked-in {
    background-color: #dff0d8;
    /* Light green background */
    color: #3c763d;
    /* Dark green text */
}
</style>

<template>
    <div class="all-appointments-container container">
        <h3 class="title is-3">{{ $t("appointments.heading") }}</h3>

        <table v-if="rides.length > 0" class="table is-fullwidth is-striped is-hoverable">
            <thead>
                <tr>
                    <th>{{ $t("appointments.name") }}</th>
                    <th>{{ $t("appointments.accommodation") }}</th>
                    <th>{{ $t("appointments.hospital") }}</th>
                    <th>{{ $t("appointments.appointmentDate") }}</th>
                    <th>{{ $t("appointments.appointmentTime") }}</th>
                    <th>{{ $t("appointments.busTime") }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="ride in rides" :key="ride.id">
                    <td>{{ ride.name }}</td>
                    <td>{{ ride.accommodation ? ride.accommodation.name : 'N/A' }}</td>
                    <td>{{ ride.hospital_name }}</td>
                    <td>{{ formatDate(ride.appointment_date) }}</td>
                    <td>{{ formatTime(ride.appointment_time) }}</td>
                    <td>{{ ride.bus_time ? formatTime(ride.bus_time) : 'Taxa' }}</td>
                </tr>
            </tbody>
        </table>

        <p v-else class="is-size-2 is-size-4-mobile">
            {{ $t("appointments.noAppointments") }}
        </p>
    </div>
</template>

<script>
import axios from 'axios';
const apiUrl = process.env.VUE_APP_BACKEND_URL;

export default {
    name: 'AllAppointments',
    data() {
        return {
            rides: []
        };
    },
    mounted() {
        this.fetchRides();
    },
    methods: {
        async fetchRides() {
            try {
                const response = await axios.get(`${apiUrl}/api/patients/alle-aftaler`);

                // Sort the data by appointment_date
                this.rides = response.data.sort((a, b) => new Date(a.appointment_date) - new Date(b.appointment_date));
            } catch (error) {
                console.error('Error fetching rides:', error);
            }
        },
        formatTime(time) {
            return time ? time.substring(0, 5) : '';
        },
        formatDate(date) {
            return new Date(date).toLocaleDateString('da-DK', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
        }
    }
};
</script>

<style scoped>
.all-appointments-container {
    padding: 20px;
}

.table {
    margin-top: 20px;
    font-size: 1rem;
}
</style>
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
                    <th>Tolk</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="ride in rides" :key="ride.id">
                    <td>{{ ride.patient_name }} {{ ride.patient_last_name }}</td>
                    <td>{{ ride.accommodation_name || 'N/A' }}</td>
                    <td>{{ ride.hospital_name }}</td>
                    <td>{{ formatDate(ride.appointment_date) }}</td>
                    <td>{{ formatTime(ride.appointment_time) }}</td>
                    <td>
                        {{ getBusTime(ride) ? formatTime(getBusTime(ride)) : 'Taxa' }}
                    </td>
                    <td class="has-text-centered">
                        <font-awesome-icon v-if="ride.translator === true" :icon="['fas', 'check']"
                            class="has-text-success" title="Tolk: ja" />
                        <font-awesome-icon v-else :icon="['fas', 'xmark']" class="has-text-danger" title="Tolk: nej" />
                    </td>

                </tr>
            </tbody>

        </table>

        <p v-else class="is-size-2 is-size-4-mobile">
            {{ $t("appointments.noAppointments") }}
        </p>
    </div>
</template>

<script>
// import axios from 'axios';
import api from '@/api';
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
            const response = await api.get(`${apiUrl}/api/appointments/alle-aftaler/`);
            console.log('Fetched rides:', response.data);
            // sort by date then time
            this.rides = response.data.sort((a, b) => {
                const d = new Date(a.appointment_date) - new Date(b.appointment_date);
                return d !== 0 ? d : a.appointment_time.localeCompare(b.appointment_time);
            });
        },
        getBusTime(ride) {
            // prefer the effective time, fall back to manual/computed if needed
            return ride.bus_time_effective || ride.bus_time_manual || ride.bus_time_computed || null;
        },
        formatTime(t) { return t ? t.slice(0, 5) : ''; },
        formatDate(d) {
            return new Date(d).toLocaleDateString('da-DK', { year: 'numeric', month: '2-digit', day: '2-digit' });
        },
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
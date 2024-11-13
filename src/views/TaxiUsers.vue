<template>
    <div class="taxi-users-container container">
        <h2 class="title is-2">{{ $t("taxi.heading") }}</h2>

        <!-- Table for today's appointments -->
        <h3 class="title is-4">{{ $t("taxi.today") }}</h3>
        <table class="table is-fullwidth is-striped">
            <thead>
                <tr>
                    <th>{{ $t("taxi.name") }}</th>
                    <th>{{ $t("taxi.phone") }}</th>
                    <th>{{ $t("taxi.accommodation") }}</th>
                    <th>{{ $t("taxi.appDate") }}</th>
                    <th>{{ $t("taxi.appTime") }}</th>
                    <th>{{ $t("taxi.hospital") }}</th>
                    <th>{{ $t("taxi.department") }}</th>
                    <th>{{ $t("taxi.hasTaxi") }}</th> <!-- Column for taxi status -->
                    <th>{{ $t("taxi.statusTaxi") }}</th> <!-- Button to order a taxi -->
                </tr>
            </thead>
            <tbody>
                <tr v-for="patient in upcomingPatients" :key="patient.id" :class="{ 'has-taxi': patient.has_taxi }">
                    <td>{{ patient.name }}</td>
                    <td>{{ patient.phone_no }}</td>
                    <td>{{ patient.accommodation.name }} </td>
                    <td>{{ formatDate(patient.appointment_date) }}</td>
                    <td>{{ formatTime(patient.appointment_time) }}</td>
                    <td>{{ patient.hospital_name }}</td>
                    <td>{{ patient.department }}</td>
                    <td>{{ formatBoolean(patient.has_taxi) }}</td>
                    <td>
                        <button @click="toggleTaxi(patient)"
                            :class="['button taxi-btn', patient.has_taxi ? 'is-warning' : 'is-success']">
                            {{ patient.has_taxi ? $t('taxi.cancel') : $t('taxi.order') }}
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>

    </div>
</template>

<script>
import axios from 'axios';
const apiUrl = process.env.VUE_APP_BACKEND_URL

export default {
    data() {
        return {
            patients: []  // All patients
        };
    },
    computed: {
        upcomingPatients() {
            const todayStr = new Date().toISOString().slice(0, 10); // Get today's date in 'YYYY-MM-DD' format

            return this.patients
                .filter(patient => {
                    // Ensure that appointment_date is in 'YYYY-MM-DD' format
                    const appointmentDateStr = patient.appointment_date;
                    // Include only appointments that are today or in the future
                    return appointmentDateStr >= todayStr;
                })
                .sort((a, b) => {
                    // Sort by appointment_date first, then by appointment_time
                    const dateComparison = a.appointment_date.localeCompare(b.appointment_date);
                    if (dateComparison === 0) {
                        return a.appointment_time.localeCompare(b.appointment_time);
                    }
                    return dateComparison;
                });
        }
    },
    mounted() {
        this.fetchPatients();
    },
    methods: {
        async fetchPatients() {
            try {
                const response = await axios.get(`${apiUrl}/api/patients/taxi-users/`);
                this.patients = response.data;
            } catch (error) {
                console.error('Error fetching patients:', error);
            }
        },
        async toggleTaxi(patient) {
            try {
                const response = await axios.patch(`${apiUrl}/api/patients/${patient.id}/toggle-taxi/`);
                patient.has_taxi = response.data.has_taxi;
            } catch (error) {
                console.error('Error toggling taxi status:', error);
            }
        },
        formatDate(date) {
            const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
            return new Date(date).toLocaleDateString('en-GB', options);
        },
        formatTime(time) {
            return time ? time.substring(0, 5) : '';
        },
        formatBoolean(value) {
            const locale = this.$i18n.locale;
            if (locale === 'da') {
                return value ? 'Ja' : 'Nej';
            } else if (locale === 'gl') {
                return value ? 'Aap' : 'Naamik';
            }
            return value ? 'yes' : 'no';
        }
    }
};
</script>

<style scoped>
.taxi-users-container {
    padding: 20px;
}

.table {
    margin-top: 20px;
}

.has-taxi {
    background-color: lightgray;
}

.taxi-btn {
    width: 100px;
}
</style>

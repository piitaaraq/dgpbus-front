<template>
    <div class="taxi-users-container container">
        <h2 class="title is-2">{{ $t("taxi.heading") }}</h2>

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
                    <th>{{ $t("taxi.hasTaxi") }}</th>
                    <th>{{ $t("taxi.statusTaxi") }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="patient in upcomingPatients" :key="patient.id" :class="{ 'has-taxi': patient.has_taxi }">
                    <td>{{ patient.patient_name }}</td>
                    <td>{{ getPhone(patient) }}</td>
                    <td>{{ patient.accommodation_name || 'N/A' }}</td>
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
import api from '@/api';
const apiUrl = process.env.VUE_APP_BACKEND_URL;

export default {
    data() {
        return {
            patients: [],
        };
    },
    computed: {
        upcomingPatients() {
            const todayStr = new Date().toISOString().slice(0, 10);
            return this.patients
                .filter(p => (p.appointment_date || '') >= todayStr)
                .sort((a, b) => {
                    const d = a.appointment_date.localeCompare(b.appointment_date);
                    return d !== 0 ? d : (a.appointment_time || '').localeCompare(b.appointment_time || '');
                });
        },
    },
    mounted() {
        this.fetchPatients();
    },
    methods: {
        async fetchPatients() {
            try {
                const { data } = await api.get(`${apiUrl}/api/appointments/taxi-users/`);
                this.patients = data;
                console.log('taxi-users:', data);
            } catch (error) {
                console.error('Error fetching patients:', error);
            }
        },
        async toggleTaxi(patient) {
            try {
                const { data } = await api.patch(`${apiUrl}/api/appointments/${patient.id}/toggle-taxi/`);
                patient.has_taxi = data.has_taxi;
            } catch (error) {
                console.error('Error toggling taxi status:', error);
            }
        },
        getPhone(p) {
            return p.phone_no || p.patient_phone || p.phone || '-';
        },
        formatDate(date) {
            return new Date(date).toLocaleDateString('da-DK', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            });
        },
        formatTime(time) {
            return time ? String(time).slice(0, 5) : '';
        },
        formatBoolean(value) {
            const locale = this.$i18n?.locale || 'da';
            if (locale === 'da') return value ? 'Ja' : 'Nej';
            if (locale === 'gl') return value ? 'Aap' : 'Naamik';
            return value ? 'yes' : 'no';
        },
    },
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
    background-color: #f5f5f5;
}

.taxi-btn {
    width: 100px;
}
</style>

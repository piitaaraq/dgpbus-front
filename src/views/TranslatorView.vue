<template>
    <div class="translator-view-container container">
        <h2>Patienter med behov for tolk</h2>

        <div v-for="(appts, hospital) in groupedPatients" :key="hospital" class="hospital-section">
            <h3 class="hospital-title">{{ hospital }}</h3>

            <table class="table is-fullwidth">
                <thead>
                    <tr>
                        <th>{{ $t("confirm.bustime") }}</th>
                        <th>{{ $t("confirm.name") }}</th>
                        <th>{{ $t("confirm.dob") }}</th>
                        <th>{{ $t("confirm.phone") }}</th>
                        <th>{{ $t("confirm.accommodation") }}</th>
                        <th>{{ $t("confirm.appDate") }}</th>
                        <th>{{ $t("confirm.appTime") }}</th>
                        <th>{{ $t("confirm.department") }}</th>
                        <th>{{ $t("confirm.desc") }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="appt in sortedAppointments(appts)" :key="appt.id">
                        <td>{{ formatTime(getBusTime(appt)) || '-' }}</td>
                        <td>{{ appt.patient_name }} {{ appt.patient_last_name }}</td>
                        <td>{{ getDob(appt) }}</td>
                        <td>{{ getPhone(appt) }}</td>
                        <td>{{ appt.accommodation_name || 'N/A' }}</td>
                        <td>{{ formatDate(appt.appointment_date) }}</td>
                        <td>{{ formatTime(appt.appointment_time) }}</td>
                        <td>{{ appt.department }}</td>
                        <td>{{ appt.description }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import api from '@/api';

export default {
    data() {
        return {
            appointments: [],
        };
    },
    computed: {
        // group by hospital_name
        groupedPatients() {
            return this.appointments.reduce((acc, a) => {
                const key = a.hospital_name || 'Ukendt hospital';
                (acc[key] ||= []).push(a);
                return acc;
            }, {});
        },
    },
    methods: {
        async fetchPatients() {
            try {
                const { data } = await api.get('appointments/translator-view/');
                console.log('translator-view data:', data);
                this.appointments = data;
            } catch (e) {
                console.error('Error fetching translator view:', e);
            }
        },
        getBusTime(a) {
            return a.bus_time_effective || a.bus_time_manual || a.bus_time_computed || null;
        },
        getPhone(a) {
            // prefer the new flattened field you added in the serializer
            return a.patient_phone || a.phone_no || a.patient_phone_no || '-';
        },
        getDob(a) {
            // show '-' unless you also expose patient_dob from the serializer
            return a.patient_dob ? this.formatDate(a.patient_dob) : '-';
        },
        sortedAppointments(list) {
            return [...list].sort((x, y) => {
                const d = (x.appointment_date || '').localeCompare(y.appointment_date || '');
                return d !== 0 ? d : (x.appointment_time || '').localeCompare(y.appointment_time || '');
            });
        },
        formatDate(dateStr) {
            if (!dateStr) return '-';
            return new Date(dateStr).toLocaleDateString('da-DK', {
                year: 'numeric', month: '2-digit', day: '2-digit',
            });
        },
        formatTime(timeStr) {
            return timeStr ? String(timeStr).slice(0, 5) : '';
        },
    },
    mounted() {
        this.fetchPatients();
    },
};
</script>

<style scoped>
.translator-view-container {
    padding: 20px;
}

.hospital-section {
    margin-bottom: 30px;
}

.hospital-title {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 10px;
}

.table {
    margin-top: 10px;
}
</style>

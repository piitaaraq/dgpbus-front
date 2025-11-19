<template>
    <div class="appointment-table-wrapper">
        <table class="table is-fullwidth is-striped">
            <thead>
                <tr>
                    <th>{{ $t("confirm.hospital") }}</th>
                    <th>{{ $t("confirm.bustime") }}</th>
                    <th>{{ $t("confirm.appDate") }}</th>
                    <th>{{ $t("confirm.appTime") }}</th>
                    <th>{{ $t("confirm.department") }}</th>
                    <th>{{ $t("confirm.desc") }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="appointment in appointments" :key="appointment.id">
                    <td>{{ appointment.hospital_name }}</td>
                    <td>{{ formatTime(busTime(appointment)) || '-' }}</td>
                    <td>{{ formatDate(appointment.appointment_date) }}</td>
                    <td>{{ formatTime(appointment.appointment_time) }}</td>
                    <td>{{ appointment.department }}</td>
                    <td>{{ appointment.description }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    props: {
        appointments: {
            type: Array,
            default: () => [],
        },
    },

    methods: {
        busTime(appointment) {
            return (
                appointment.bus_time_effective ||
                appointment.bus_time_manual ||
                appointment.bus_time_computed ||
                null
            );
        },

        formatDate(date) {
            if (!date) return '-';
            return new Date(date).toLocaleDateString('da-DK', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            });
        },

        formatTime(time) {
            return time ? String(time).slice(0, 5) : '';
        },
    },
};
</script>

<style scoped>
.appointment-table-wrapper {
    overflow-x: auto;
}

.table {
    background: white;
}

@media screen and (max-width: 768px) {
    .table {
        font-size: 0.875rem;
    }

    th,
    td {
        padding: 0.5em;
    }
}
</style>
<template>
    <div class="existing-appointments-step">
        <h4 class="title is-4">
            {{ $t("formular.existingAppointments") || "Eksisterende aftaler" }}
        </h4>

        <div v-if="patientName" class="mb-4">
            <p class="is-size-5">
                {{ $t("formular.appointmentsFor") || "Aftaler for" }}: <strong>{{ patientName }}</strong>
            </p>
        </div>

        <div v-if="existingAppointments.length > 0" class="mb-5">
            <AppointmentTable :appointments="sortedAppointments" />
        </div>

        <div v-else class="notification is-info is-light mb-5">
            <p>{{ $t("formular.noAppointments") || "Ingen aftaler fundet" }}</p>
        </div>

        <div class="content mb-4">
            <p class="is-size-5">
                {{ $t("formular.proceedToNew") || "Fortsæt for at oprette en ny aftale" }}
            </p>
        </div>

        <div class="field is-grouped" style="gap: 10px">
            <div class="control">
                <button class="button is-primary" type="button" @click="$emit('next')">
                    {{ $t("formular.createNew") || "Opret ny aftale" }}
                </button>
            </div>
            <div class="control">
                <button class="button is-light" type="button" @click="$emit('back')">
                    {{ $t("formular.back") }}
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import AppointmentTable from './AppointmentTable.vue';

export default {
    components: {
        AppointmentTable,
    },

    props: {
        existingAppointments: {
            type: Array,
            default: () => [],
        },
        patientName: {
            type: String,
            default: '',
        },
    },

    emits: ['next', 'back'],

    computed: {
        sortedAppointments() {
            return [...this.existingAppointments].sort((a, b) => {
                const d = (a.appointment_date || '').localeCompare(b.appointment_date || '');
                return d !== 0 ? d : (a.appointment_time || '').localeCompare(b.appointment_time || '');
            });
        },
    },
};
</script>

<style scoped>
.existing-appointments-step {
    margin-bottom: 2rem;
}
</style>
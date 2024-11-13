<template>
    <div>
        <div class="columns">
            <div class="column">
                <h2>{{ $t("formular.heading") }}</h2>
                <p class="is-size-4">
                    {{ $t("patientinfo.para1") }}
                </p>
            </div>
            <div class="column">
                <!-- Display patient details if an appointment is found -->
                <div v-if="appointment && Object.keys(appointment).length > 0">
                    <p class="is-size-4 m-0">{{ $t("formular.name") }}: {{ appointment.name }}</p>
                    <p class="is-size-4 m-0">{{ $t("formular.appDate") }}: {{ appointment.appointment_date }}</p>
                    <p class="is-size-4 m-0">{{ $t("formular.appTime") }}: {{ appointment.appointment_time }}</p>
                    <p class="is-size-4 m-0">{{ $t("formular.hospital") }}: {{ hospitalName }}</p>
                    <p class="is-size-4 m-0">{{ $t("formular.department") }}: {{ appointment.department }}</p>
                    <p class="is-size-4" v-if="appointment.bus_time">{{ $t("formular.busTime") }}: {{
                        appointment.bus_time }}</p>
                </div>

                <!-- Display message if no match is found -->
                <div v-else-if="noMatchFound">
                    <p class="is-size-4">{{ $t("formular.noAppointmentFound") }}</p>
                    <p class="is-size-4">{{ $t("formular.pleaseRegister") }}</p>
                </div>

                <!-- Navigation buttons -->
                <div class="buttons">
                    <button class="button is-medium is-primary" @click="goToHospitalList">
                        {{ $t("formular.goToHospitalList") }}
                    </button>
                    <button class="button is-medium is-secondary" @click="goBack">
                        {{ $t("formular.goBack") }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

const apiUrl = process.env.VUE_APP_BACKEND_URL;

export default {
    props: {
        appointment: Object,
        noMatchFound: Boolean,
    },
    data() {
        return {
            hospitals: [],
        };
    },
    computed: {
        hospitalName() {
            // Find the hospital name using the appointment's hospital ID
            if (this.appointment && this.appointment.hospital && this.hospitals.length > 0) {
                const hospital = this.hospitals.find(h => h.id === this.appointment.hospital);
                return hospital ? hospital.hospital_name : this.$t("formular.unknownHospital");
            }
            return this.$t("formular.unknownHospital");
        },
    },
    async mounted() {
        await this.fetchHospitals();
    },
    methods: {
        async fetchHospitals() {
            try {
                const response = await axios.get(`${apiUrl}/api/hospitals/`);
                this.hospitals = response.data;
            } catch (error) {
                console.error('Error fetching hospital data:', error);
            }
        },
        goToHospitalList() {
            this.$router.push({ name: 'HospitalList' });
        },
        goBack() {
            this.$emit('goBack');
        },
    },
};
</script>

<style scoped>
h2 {
    margin-bottom: 1.5rem;
}

p {
    margin-bottom: 0.75rem;
}

.buttons {
    margin-top: 2rem;
    display: flex;
    gap: 1rem;
}
</style>

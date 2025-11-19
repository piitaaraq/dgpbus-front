<template>
    <div class="container px-3 py-5">
        <!-- Header -->
        <div class="mb-5">
            <h3 class="title is-3 is-size-4-mobile">{{ $t("formular.heading") }}</h3>
            <p class="is-size-5 content mb-2">
                {{ $t("hospitalform.para0", { hospital: hospitalName }) }}
            </p>
            <p class="is-size-5 content">
                {{ $t("hospitalform.para2") }}
            </p>
        </div>

        <!-- Step Indicator -->
        <StepIndicator :current-step="currentStep" :steps="steps" class="mb-5" />

        <!-- Step 1: Patient Info -->
        <PatientInfoStep v-if="currentStep === 1" :hospital-id="id" :accommodations="accommodations"
            :initial-data="patientData" @next="handlePatientInfoSubmit" @back="goBack" />

        <!-- Step 2: Existing Appointments -->
        <ExistingAppointmentsStep v-if="currentStep === 2" :existing-appointments="existingAppointments"
            :patient-name="patientData.name" @next="goToStep(3)" @back="goToStep(1)" />

        <!-- Step 3: New Appointment -->
        <NewAppointmentStep v-if="currentStep === 3" :hospital-id="id" :initial-data="appointmentData"
            @next="handleAppointmentSubmit" @back="goToStep(2)" />

        <!-- Step 4: Confirmation -->
        <ConfirmationStep v-if="currentStep === 4" :patient-data="patientData" :appointment-data="appointmentData"
            :hospital-name="hospitalName" :bus-time="busTime" @submit="handleFinalSubmit" @back="goToStep(3)" />
    </div>
</template>

<script>
import { useFormStore } from '@/stores/formStore';
import { useCheckPatientStore } from '@/stores/checkPatientStore';
import api from '@/api';
import StepIndicator from '@/components/StepIndicator.vue';
import PatientInfoStep from '@/components/PatientInfoStep.vue';
import ExistingAppointmentsStep from '@/components/ExistingAppointmentsStep.vue';
import NewAppointmentStep from '@/components/NewAppointmentStep.vue';
import ConfirmationStep from '@/components/ConfirmationStep.vue';

export default {
    components: {
        StepIndicator,
        PatientInfoStep,
        ExistingAppointmentsStep,
        NewAppointmentStep,
        ConfirmationStep,
    },

    props: ['id'],

    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.isFreshEntry = !from?.name || from.name === 'HospitalList';
            if (vm.isFreshEntry) {
                const check = useCheckPatientStore();
                const formStore = useFormStore();
                (check.$reset && check.$reset()) || (check.resetStore && check.resetStore());
                (formStore.$reset && formStore.$reset()) || (formStore.resetStore && formStore.resetStore());
            }
            vm.resetFlow();
        });
    },

    beforeRouteUpdate(to, from, next) {
        this.isFreshEntry = from.name === 'HospitalList';

        // Reset stores when coming from HospitalList or switching hospitals
        if (this.isFreshEntry || to.params.id !== from.params.id) {
            const check = useCheckPatientStore();
            const formStore = useFormStore();
            (check.$reset && check.$reset()) || (check.resetStore && check.resetStore());
            (formStore.$reset && formStore.$reset()) || (formStore.resetStore && formStore.resetStore());

            this.resetFlow();
            this.fetchHospitalDetails();
        }
        next();
    },

    data() {
        return {
            isFreshEntry: false,
            currentStep: 1,
            hospitalName: '',
            accommodations: [],
            existingAppointments: [],
            busTime: null,
            patientData: {
                name: '',
                last_name: '',
                day_of_birth: '',
                phone_no: '',
                accommodation: '',
                room: '',
            },
            appointmentData: {
                appointment_date: '',
                appointment_time: '',
                department: '',
                description: '',
                needs_translator: false,
                trolley: false,
                wheelchair: false,
                companion: false,
            },
            steps: [
                { number: 1, label: 'formular.patientInfo' },
                { number: 2, label: 'formular.existingAppointments' },
                { number: 3, label: 'formular.newAppointment' },
                { number: 4, label: 'formular.confirmation' },
            ],
        };
    },

    mounted() {
        this.resetFlow();
        this.fetchHospitalDetails();
        this.fetchAccommodations();
    },

    activated() {
        this.resetFlow();
    },

    methods: {
        resetFlow() {
            this.currentStep = 1;
            this.existingAppointments = [];
            this.busTime = null;

            if (this.isFreshEntry) {
                // Always reset to blank form when coming from HospitalList
                this.patientData = {
                    name: '',
                    last_name: '',
                    day_of_birth: '',
                    phone_no: '',
                    accommodation: '',
                    room: '',
                };
                this.appointmentData = {
                    appointment_date: '',
                    appointment_time: '',
                    department: '',
                    description: '',
                    needs_translator: false,
                    trolley: false,
                    wheelchair: false,
                    companion: false,
                };
            } else {
                // Pre-fill from store if not a fresh entry (e.g., browser back)
                const check = useCheckPatientStore();
                this.patientData = {
                    name: check.name || '',
                    last_name: check.last_name || '',
                    day_of_birth: check.day_of_birth || '',
                    phone_no: check.phone_no || '',
                    accommodation: check.accommodation || '',
                    room: check.room || '',
                };
            }
        },

        async fetchHospitalDetails() {
            try {
                const { data } = await api.get(`hospitals/${this.id}`);
                this.hospitalName = data.hospital_name || data.name || '';
            } catch (e) {
                console.error('Error fetching hospital details:', e);
            }
        },

        async fetchAccommodations() {
            try {
                const { data } = await api.get('accommodations/');
                this.accommodations = data;
            } catch (e) {
                console.error('Error fetching accommodations:', e);
            }
        },

        async handlePatientInfoSubmit(patientInfo) {
            this.patientData = { ...patientInfo };

            // Save to check store
            const check = useCheckPatientStore();
            Object.assign(check, patientInfo);

            // Fetch existing appointments
            try {
                const params = {
                    name: patientInfo.name,
                    last_name: patientInfo.last_name,
                    day_of_birth: patientInfo.day_of_birth,
                };
                const { data } = await api.get('appointments/find-patient/', { params });
                this.existingAppointments = Array.isArray(data) ? data : [];
            } catch (e) {
                if (e?.response?.status === 404) {
                    this.existingAppointments = [];
                } else {
                    console.error('Error checking existing appointments:', e);
                }
            }

            this.goToStep(2);
        },

        async handleAppointmentSubmit(appointmentInfo) {
            this.appointmentData = { ...appointmentInfo };

            // Calculate bus time if applicable
            const ensureSeconds = (t) => (t && t.length === 5 ? `${t}:00` : t);
            const acc = this.accommodations.find(x => x.name === this.patientData.accommodation);
            const accommodation_id = acc ? acc.id : null;
            const hospital_id = Number(this.id);

            const wantsCalc =
                [1, 3, 7].includes(hospital_id) &&
                this.patientData.accommodation === 'Det grønlandske Patienthjem';

            if (wantsCalc) {
                try {
                    const payload = {
                        hospital_id,
                        accommodation_id,
                        appointment_date: appointmentInfo.appointment_date,
                        appointment_time: ensureSeconds(appointmentInfo.appointment_time),
                    };
                    const { data } = await api.post('appointments/calculate-bus-time/', payload);
                    this.busTime = data?.bus_time || null;
                } catch (err) {
                    console.error('Bus-time error:', err?.response?.data || err.message);
                    this.busTime = null;
                }
            }

            this.goToStep(4);
        },

        async handleFinalSubmit() {
            const token = localStorage.getItem('auth_token');
            const auth = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

            const ensureSeconds = (t) => {
                if (!t) return t;
                return t.length === 5 ? `${t}:00` : t;
            };

            const acc = this.accommodations.find(x => x.name === this.patientData.accommodation);
            const accommodation_id = acc ? acc.id : null;

            try {
                // 1) Create Patient (personal-only)
                const patientPayload = {
                    name: this.patientData.name,
                    last_name: this.patientData.last_name,
                    day_of_birth: this.patientData.day_of_birth || null,
                    phone_no: this.patientData.phone_no || null,
                    room: this.patientData.room || null,
                    default_accommodation: accommodation_id,
                };

                const { data: patient } = await api.post('patients/', patientPayload, auth);

                // 2) Create Appointment (link via patient_id)
                const apptPayload = {
                    patient_id: patient.id,
                    hospital_id: Number(this.id),
                    accommodation_id: accommodation_id,
                    appointment_date: this.appointmentData.appointment_date,
                    appointment_time: ensureSeconds(this.appointmentData.appointment_time),
                    bus_time_manual: this.busTime ?? null,
                    translator: !!this.appointmentData.needs_translator,
                    wheelchair: !!this.appointmentData.wheelchair,
                    trolley: !!this.appointmentData.trolley,
                    companion: !!this.appointmentData.companion,
                    department: this.appointmentData.department || '',
                    description: this.appointmentData.description || '',
                };

                await api.post('appointments/', apptPayload, auth);

                // Success → reset stores + navigate (with brief delay to show success message)
                const checkStore = useCheckPatientStore();
                const formStore = useFormStore();
                (checkStore.$reset?.() || checkStore.resetStore?.());
                (formStore.$reset?.() || formStore.resetStore?.());

                // Delay navigation to show success message
                setTimeout(() => {
                    this.$router.push({ name: 'HospitalList' });
                }, 2000); // 2 second delay
            } catch (error) {
                console.error('Error creating patient/appointment:', error?.response?.data || error.message);
                const status = error?.response?.status;
                if (status === 401 || status === 403) {
                    alert('Du skal være logget ind for at oprette aftalen (eller åbne for offentlig oprettelse i backend).');
                } else {
                    alert('Noget gik galt under oprettelse. Prøv igen.');
                }
                // Re-throw to let ConfirmationStep handle loading state
                throw error;
            }
        },

        goToStep(step) {
            this.currentStep = step;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },

        goBack() {
            this.$router.push({ name: 'HospitalList' });
        },
    },
};
</script>

<style scoped>
/* Add any container-specific styles here */
</style>
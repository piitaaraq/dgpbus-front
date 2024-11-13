<template>
  <div class="homepage-container container pt-4">
    <div v-if="currentView === 'appointmentSetup'">
      <AppointmentSetup @basicInfoSubmitted="handleBasicInfo" />
    </div>
    <div v-else-if="currentView === 'patientInfo'">
      <PatientInfo :appointment="patientStore.appointment" :noMatchFound="patientStore.noMatchFound"
        @goBack="resetToAppointmentSetup" />
    </div>
    <CookieConsent />

    <!-- Show error message if there's an actual error -->
    <div v-if="patientStore.errorMessage" class="notification is-danger">
      {{ patientStore.errorMessage }}
    </div>
  </div>
</template>

<script>
import AppointmentSetup from '@/components/AppointmentSetup.vue';
import PatientInfo from '@/components/PatientInfo.vue';
import CookieConsent from '@/components/CookieConsent.vue';
import { useCheckPatientStore } from '@/stores/checkPatientStore';

export default {
  name: 'HomePage',
  components: {
    AppointmentSetup,
    PatientInfo,
    CookieConsent,
  },
  setup() {
    const patientStore = useCheckPatientStore();
    return { patientStore };
  },
  data() {
    return {
      currentView: 'appointmentSetup',
    };
  },
  methods: {
    async handleBasicInfo(form) {
      this.patientStore.name = form.name;
      this.patientStore.room = form.room;
      this.patientStore.accommodation = form.accommodation;

      await this.patientStore.checkPatient();
      this.currentView = 'patientInfo';
    },
    resetToAppointmentSetup() {
      this.patientStore.resetStore();
      this.currentView = 'appointmentSetup';
    },
  },
};
</script>

<style scoped>
.homepage-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
}

.notification {
  margin-top: 1rem;
}
</style>

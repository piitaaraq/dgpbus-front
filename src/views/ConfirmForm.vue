<template>
  <div class="confirmation-form-container container px-3">
    <div class="explanatory-text py-2">
      <h3 class="title is-3 is-size-4-mobile">{{ $t("confirm.heading") }} </h3>
      <p class="is-size-4">
        {{ $t("confirm.para1") }}
      </p>
      <p v-if="busTime" class="is-size-4">
        {{ $t("confirm.para2") }}
      </p>
    </div>
    <div class="form-section">
      <div class="form-review">
        <p><strong>{{ $t("confirm.name") }}:</strong> {{ formData.name }}</p>
        <p><strong>{{ $t("confirm.phone") }}:</strong> {{ formData.phone_no }}</p>
        <p><strong>{{ $t("confirm.accommodation") }}:</strong> {{ formData.accommodation }}</p>
        <p><strong>{{ $t("confirm.room") }}:</strong> {{ formData.room }}</p>
        <p><strong>{{ $t("confirm.hospital") }}:</strong> {{ hospitalName }}</p>
        <p><strong>{{ $t("confirm.appDate") }}:</strong> {{ formData.appointment_date }}</p>
        <p><strong>{{ $t("confirm.appTime") }}:</strong> {{ formData.appointment_time }}</p>
        <p><strong>{{ $t("confirm.department") }}:</strong> {{ formData.department }}</p>
        <p><strong>{{ $t("confirm.desc") }}:</strong> {{ formData.description }}</p>
        <p>
          <strong>{{ $t("confirm.translator") }}:</strong>
          {{ formData.needs_translator ? $t("formular.radioY") : $t("formular.radioN") }}
        </p>
        <p>
          <strong>{{ $t("confirm.wheelchair") }}:</strong>
          {{ formData.wheelchair ? $t("formular.radioY") : $t("formular.radioN") }}
        </p>
        <p>
          <strong>{{ $t("confirm.trolley") }}:</strong>
          {{ formData.trolley ? $t("formular.radioY") : $t("formular.radioN") }}
        </p>
        <p>
          <strong>{{ $t("confirm.companion") }}:</strong>
          {{ formData.companion ? $t("formular.radioY") : $t("formular.radioN") }}
        </p>
        <p v-if="busTime"><strong>{{ $t("confirm.bustime") }}:</strong> {{ busTime }}</p>
      </div>

      <!-- Greyed-out box showing user input -->

      <!-- Confirm and Go Back buttons -->
      <div class="field is-grouped mt-4">
        <div class="control">
          <button class="button is-primary" @click="submitUserData">{{ $t("confirm.confirm") }} </button>
          <!-- Button to accept entry -->
        </div>
        <div class="control">
          <button class="button is-light" @click="goBack">{{ $t("confirm.back") }} </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useFormStore } from '@/stores/formStore';
import { useCheckPatientStore } from '@/stores/checkPatientStore'; // Adjust the path if necessary
const apiUrl = process.env.VUE_APP_BACKEND_URL;

export default {
  data() {
    const formStore = useFormStore();
    console.log('FormData on load:', formStore.formData);
    return {
      hospitalName: '',
      formData: formStore.formData, // Bind formData from the store
      busTime: formStore.formData.busTime, // Extract busTime for easier use
    };
  },
  mounted() {
    if (this.formData.hospital) {
      this.fetchHospitalDetails();
    }
  },
  methods: {
    async submitUserData() {
      try {
        // Submit formData to the backend via POST request
        await axios.post(`${apiUrl}/api/patients/`, this.formData);

        // Reset the store after successful submission
        const checkPatientStore = useCheckPatientStore(); // Access the store instance
        checkPatientStore.resetStore();

        // On successful submission, navigate to the homepage or a success page
        this.$router.push({ name: 'HospitalList' });
      } catch (error) {
        console.error('Error creating user:', error);
      }
    },
    async fetchHospitalDetails() {
      try {
        const response = await axios.get(`${apiUrl}/api/hospitals/${this.formData.hospital}`);
        this.hospitalName = response.data.hospital_name;
      } catch (error) {
        console.error('Error fetching hospital details:', error);
      }
    },
    goBack() {
      this.$router.go(-1); // Navigate back to the form page
    },
  },
};
</script>

<style scoped>
.confirmation-form-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.form-review {
  flex: 1;
  border-left: 1px solid #eaeaea;
  padding-left: 1.5rem;
}

.explanatory-text {
  flex: 1;
}

.table {
  max-width: 100%;
}

.form-review p {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.form-review strong {
  display: inline-block;
  min-width: 140px;
}

@media (max-width: 768px) {
  .confirmation-form-container {
    flex-direction: column;
  }

  .explanatory-text,
  .form-review {
    margin-bottom: 1.5rem;
  }
}
</style>

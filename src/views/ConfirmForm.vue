<template>
  <div class="container px-3 py-5">

    <!-- Heading and Explanation -->
    <div class="mb-5">
      <h3 class="title is-3 is-size-4-mobile">{{ $t("confirm.heading") }}</h3>
      <p class="is-size-5 mb-2">
        {{ $t("confirm.para1") }}
      </p>
      <p v-if="busTime" class="is-size-5">
        {{ $t("confirm.para2") }}
      </p>
    </div>

    <!-- Confirmation Summary -->
    <div class="box form-review mb-5 has-background-light">

      <div class="field-row">
        <p class="field-label">{{ $t("confirm.name") }}:</p>
        <span>{{ formData.name }}</span>
      </div>

      <div class="field-row">
        <p class="field-label">{{ $t("confirm.dob") }}:</p>
        <span>{{ formData.day_of_birth }}</span>
      </div>

      <div class="field-row">
        <p class="field-label">{{ $t("confirm.phone") }}:</p>
        <span>{{ formData.phone_no }}</span>
      </div>

      <hr>

      <div class="field-row">
        <p class="field-label">{{ $t("confirm.accommodation") }}:</p>
        <span>{{ formData.accommodation }}</span>
      </div>

      <div class="field-row">
        <p class="field-label">{{ $t("confirm.room") }}:</p>
        <span>{{ formData.room }}</span>
      </div>

      <hr>

      <div class="field-row">
        <p class="field-label">{{ $t("confirm.hospital") }}:</p>
        <span>{{ hospitalName }}</span>
      </div>

      <div class="field-row">
        <p class="field-label">{{ $t("confirm.appDate") }}:</p>
        <span>{{ formData.appointment_date }}</span>
      </div>

      <div class="field-row">
        <p class="field-label">{{ $t("confirm.appTime") }}:</p>
        <span>{{ formData.appointment_time }}</span>
      </div>

      <div class="field-row">
        <p class="field-label">{{ $t("confirm.department") }}:</p>
        <span>{{ formData.department }}</span>
      </div>

      <div class="field-row">
        <p class="field-label">{{ $t("confirm.desc") }}:</p>
        <span>{{ formData.description }}</span>
      </div>

      <hr>

      <div class="field-row">
        <p class="field-label">{{ $t("confirm.translator") }}:</p>
        <span>{{ formData.needs_translator ? $t("formular.radioY") : $t("formular.radioN") }}</span>
      </div>

      <div class="field-row">
        <p class="field-label">{{ $t("confirm.wheelchair") }}:</p>
        <span>{{ formData.wheelchair ? $t("formular.radioY") : $t("formular.radioN") }}</span>
      </div>

      <div class="field-row">
        <p class="field-label">{{ $t("confirm.trolley") }}:</p>
        <span>{{ formData.trolley ? $t("formular.radioY") : $t("formular.radioN") }}</span>
      </div>

      <div class="field-row">
        <p class="field-label">{{ $t("confirm.companion") }}:</p>
        <span>{{ formData.companion ? $t("formular.radioY") : $t("formular.radioN") }}</span>
      </div>

      <div class="field-row" v-if="busTime">
        <p class="field-label">{{ $t("confirm.bustime") }}:</p>
        <span>{{ busTime }}</span>
      </div>

    </div>

    <!-- Buttons -->
    <div class="buttons is-centered">
      <button class="button is-primary" @click="submitUserData">
        {{ $t("confirm.confirm") }}
      </button>
      <button class="button is-light" @click="goBack">
        {{ $t("confirm.back") }}
      </button>
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
.form-review p {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.form-review p {
  display: inline-block;
  min-width: 330px;
  text-align: right;
}

.form-review .field-label {
  font-family: "Roboto Flex", sans-serif;
  font-weight: 300;
  display: inline-block;
  min-width: 330px;
  text-align: right;
}

@media (max-width: 1023px) {

  /* Bulma's breakpoint for desktop-down */
  .form-review p {
    min-width: 0;
    width: auto;
    text-align: left;
    font-size: 1rem;
  }
  .form-review .field-label {
    min-width: 0;
    width: auto;
    font-family: "Roboto Flex", sans-serif;
    font-weight: 300;
    text-align: left;
    font-size: 1rem;
  }
}

.form-review hr {
  margin: 1.5rem 0;
  border: none;
  height: 1px;
  background-color: var(--bulma-primary-light);
}

.form-review p {
  padding-left: 0.5rem;
}

.form-review .field-row {
  margin-bottom: 1rem;
  font-size: 1.25rem;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
}


.form-review .field-row .field-label {
  font-family: "Roboto Flex", sans-serif;
  font-weight: 300;
  display: inline-block;
  min-width: 330px;
  text-align: right;
  margin-right: 1rem;
}

@media (max-width: 1023px) {
  .form-review .field-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .form-review .field-row .field-label {
    font-family: "Roboto Flex", sans-serif;
    font-weight: 300;
    min-width: unset;
    width: auto;
    text-align: left;
    margin-right: 0;
    margin-bottom: 0.25rem;
    font-size: 1rem;
  }
}
</style>

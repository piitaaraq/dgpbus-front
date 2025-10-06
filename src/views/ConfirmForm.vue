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
        <p class="field-label">{{ $t("confirm.last_name") }}:</p>
        <span>{{ formData.last_name }}</span>
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
import api from '@/api';
import { useFormStore } from '@/stores/formStore';
import { useCheckPatientStore } from '@/stores/checkPatientStore';

function ensureSeconds(t) {
  if (!t) return t;
  return t.length === 5 ? `${t}:00` : t;
}

export default {
  data() {
    const formStore = useFormStore();
    return {
      hospitalName: '',
      formData: formStore.formData,   // contains: name, last_name, day_of_birth, phone_no, room, hospital (ID), accommodation_id, appointment_date, appointment_time, department, description, needs_translator, wheelchair, trolley, companion, busTime?
      busTime: formStore.formData.busTime || null,
    };
  },
  mounted() {
    if (this.formData.hospital) {
      this.fetchHospitalDetails();
    }
  },
  methods: {
    async submitUserData() {
      const token = localStorage.getItem('auth_token');
      const auth = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      try {
        // 1) Create Patient (personal-only)
        const patientPayload = {
          name: this.formData.name,
          last_name: this.formData.last_name,
          day_of_birth: this.formData.day_of_birth || null,
          phone_no: this.formData.phone_no || null,
          room: this.formData.room || null,
          // remember usual accommodation for convenience (optional)
          default_accommodation: this.formData.accommodation_id ?? null,
        };

        const { data: patient } = await api.post(
          'patients/',
          patientPayload,
          auth
        );

        // 2) Create Appointment (link via patient_id)
        const apptPayload = {
          patient_id: patient.id,
          hospital_id: Number(this.formData.hospital),                // must be numeric ID
          accommodation_id: this.formData.accommodation_id ?? null,

          appointment_date: this.formData.appointment_date,           // "YYYY-MM-DD"
          appointment_time: ensureSeconds(this.formData.appointment_time), // "HH:MM:SS"

          // If you computed a bus time earlier, treat it as manual override; else let backend compute
          bus_time_manual: this.busTime ?? null,

          translator: !!this.formData.needs_translator,
          has_taxi: !!this.formData.has_taxi,
          wheelchair: !!this.formData.wheelchair,
          trolley: !!this.formData.trolley,
          companion: !!this.formData.companion,
          status: !!this.formData.status, // if present in your form data

          department: this.formData.department || '',
          description: this.formData.description || '',
          // departure_location: this.formData.departure_location || '', // include if you collect it
        };

        await api.post('appointments/', apptPayload, auth);

        // Success → reset + navigate
        const checkStore = useCheckPatientStore();
        const formStore = useFormStore();

        (checkStore.$reset?.() || checkStore.resetStore?.());
        (formStore.$reset?.() || formStore.resetStore?.());

        this.$router.push({ name: 'HospitalList' });
      } catch (error) {
        console.error('Error creating patient/appointment:', error?.response?.data || error.message);
        const status = error?.response?.status;
        if (status === 401 || status === 403) {
          alert('Du skal være logget ind for at oprette aftalen (eller åbne for offentlig oprettelse i backend).');
        } else {
          alert('Noget gik galt under oprettelse. Prøv igen.');
        }
      }
    },
    async fetchHospitalDetails() {
      try {
        const response = await api.get('hospitals/${this.formData.hospital}');
        this.hospitalName = response.data.hospital_name;
      } catch (error) {
        console.error('Error fetching hospital details:', error);
      }
    },
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>


<style scoped>
.form-review p {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.form-review .field-row .field-label {
  font-family: "Roboto Flex", sans-serif;
  font-weight: 400;
  display: inline-block;
  min-width: 330px;
  text-align: right;
  margin-right: 1rem;
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
    font-weight: 400;
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

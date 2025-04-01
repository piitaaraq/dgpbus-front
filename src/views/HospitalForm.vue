<template>
  <div class="hospital-form-container container px-3">
    <div class="explanatory-text mb-3">
      <h3 class="title is-3 is-size-4-mobile">{{ $t("formular.heading") }}</h3>
      <p class="is-size-4 content">
        {{ $t("hospitalform.para0", { hospital: hospitalName }) }}
      </p>
      <p class="is-size-4 content">
        {{ $t('hospitalform.para2') }}
      </p>
    </div>

    <div class="form-section">
      <form @submit.prevent="submitForm">

        <!-- name -->
        <div class="field">
          <label class="label">{{ $t("formular.name") }}</label>
          <div class="control">
            <input class="input is-medium" type="text" :placeholder="$t('formular.namePlaceholder')" v-model="form.name"
              required />
          </div>
        </div>

        <!-- phone -->
        <div class="field">
          <div class="field">
            <label class="label">{{ $t("formular.phone") }}</label>
            <div class="control">
              <input class="input is-medium" type="text" v-model="form.phone_no" required />
            </div>
          </div>
        </div>

        <!-- accommodation -->
        <div class="field">
          <label class="label">{{ $t("formular.accommodation") }}</label>
          <div class="control">
            <div class="select is-medium">
              <select v-model="form.accommodation" required>
                <option value="">{{ $t("formular.selectAccommodation") }}</option>
                <option v-for="accommodation in accommodations" :key="accommodation.id" :value="accommodation.name">
                  {{ accommodation.name }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- room -->
        <div class="field">
          <label class="label">{{ $t("formular.room") }}</label>
          <div class="control">
            <input class="input is-medium" type="text" v-model="form.room" required />
          </div>
        </div>

        <!-- appointment date -->
        <div class="field">
          <label class="label">{{ $t("formular.appDate") }}</label>
          <div class="control">
            <input class="input is-medium" type="date" v-model="form.appointment_date" required />
          </div>
        </div>

        <!-- appointment time -->
        <div class="field">
          <label class="label">{{ $t("formular.appTime") }}</label>
          <div class="control">
            <input class="input is-medium" type="time" v-model="form.appointment_time" required />
          </div>
        </div>

        <!-- department -->
        <div class="field">
          <label class="label">{{ $t("formular.department") }}</label>
          <div class="control">
            <input class="input is-medium" type="text" v-model="form.department" required />
          </div>
        </div>

        <!-- description -->
        <div class="field">
          <label class="label">{{ $t("formular.desc") }}</label>
          <div class="control">
            <textarea class="textarea" v-model="form.description" required></textarea>
          </div>
        </div>

        <!-- translator  -->
        <div class="field">
          <label class="label">{{ $t("formular.translator") }}</label>
          <div class="control">
            <label class="radio">
              <input type="radio" v-model="form.needs_translator" :value="true" />
              {{ $t("formular.radioY") }}
            </label>
            <label class="radio">
              <input type="radio" v-model="form.needs_translator" :value="false" />
              {{ $t("formular.radioN") }}
            </label>
          </div>
        </div>

        <!-- wheelchair -->
        <div class="field">
          <label class="label">{{ $t("formular.wheelchair") }}</label>
          <div class="control">
            <label class="radio">
              <input type="radio" v-model="form.wheelchair" :value="true" />
              {{ $t("formular.radioY") }}
            </label>
            <label class="radio">
              <input type="radio" v-model="form.wheelchair" :value="false" />
              {{ $t("formular.radioN") }}
            </label>
          </div>
        </div>

        <!-- trolley -->
        <div class="field">
          <label class="label">{{ $t("formular.trolley") }}</label>
          <div class="control">
            <label class="radio">
              <input type="radio" v-model="form.trolley" :value="true" />
              {{ $t("formular.radioY") }}
            </label>
            <label class="radio">
              <input type="radio" v-model="form.trolley" :value="false" />
              {{ $t("formular.radioN") }}
            </label>
          </div>
        </div>

        <!-- companion -->
        <div class="field">
          <label class="label">{{ $t("formular.companion") }}</label>
          <div class="control">
            <label class="radio">
              <input type="radio" v-model="form.companion" :value="true" />
              {{ $t("formular.radioY") }}
            </label>
            <label class="radio">
              <input type="radio" v-model="form.companion" :value="false" />
              {{ $t("formular.radioN") }}
            </label>
          </div>
        </div>

        <!-- navbuttons -->
        <div class="field is-grouped mt-4" style="display: flex; gap: 10px">
          <div class="control">
            <button class="button is-large is-primary" type="button" @click="goToConfirmation">
              {{ $t("formular.submit") }}
            </button>
          </div>
          <div class="control">
            <button class="button is-large is-light" type="button" @click="goBack">
              {{ $t("formular.back") }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { useFormStore } from '@/stores/formStore';
import { useCheckPatientStore } from '@/stores/checkPatientStore';
import axios from 'axios';
const apiUrl = process.env.VUE_APP_BACKEND_URL;

export default {
  props: ['id'],
  data() {
    const checkPatientStore = useCheckPatientStore(); // Access checkPatientStore

    return {
      hospitalName: '',
      accommodations: [],
      form: {
        name: checkPatientStore.name || '',
        accommodation: checkPatientStore.accommodation || '',
        room: checkPatientStore.room || '',
        phone_no: '',
        appointment_date: '',
        appointment_time: '',
        department: '',
        description: '',
        needs_translator: false,
        hospital: this.id,
        trolley: false,
        wheelchair: false,
        companion: false,
      }
    };
  },
  mounted() {
    this.fetchHospitalDetails();
    this.fetchAccommodations();
  },
  methods: {
    async fetchHospitalDetails() {
      try {
        const response = await axios.get(`${apiUrl}/api/hospitals/${this.id}`);
        this.hospitalName = response.data.hospital_name;
      } catch (error) {
        console.error('Error fetching hospital details:', error);
      }
    },
    async fetchAccommodations() {
      try {
        const response = await axios.get(`${apiUrl}/api/accommodations/`);
        this.accommodations = response.data;
      } catch (error) {
        console.error('Error fetching accommodations:', error);
      }
    },
    async goToConfirmation() {
      console.log("goToConfirmation started!");
      console.log("Full form data before processing:", this.form);
      // ✅ Log the accommodation_id specifically
      console.log("Accommodation ID before setting in store:", this.form.accommodation_id);

      if (!this.form.accommodation_id) {
        console.warn("⚠️ Accommodation ID is missing! Check the dropdown selection.");
      }
      const formStore = useFormStore();

      // Find the accommodation by name and get its ID
      const selectedAccommodation = this.accommodations.find(
        acc => acc.name === this.form.accommodation
      );
      const formWithAccommodationId = {
        ...this.form,
        accommodation_id: selectedAccommodation ? selectedAccommodation.id : null,
      };

      console.log("Accommodation value:", this.form.accommodation);
      console.log(
        "Comparison of accommodation result:",
        this.form.accommodation === 'Det grønlandske Patienthjem'
      );


      if (
        [1, 3, 7].includes(Number(this.form.hospital)) &&
        this.form.accommodation === 'Det grønlandske Patienthjem'
      ) {
        try {
          console.log("Sending data for bus time calculation:...", formWithAccommodationId);
          const response = await axios.post(
            `${apiUrl}/api/patients/calculate_bus_time/`,
            formWithAccommodationId
          );
          console.log("Bus time response:", response.data);
          const busTime = response.data.bus_time;
          formStore.setFormData({ ...formWithAccommodationId, busTime: busTime || null });
        } catch (error) {
          console.error('Error calculating bus time:...', error);
          alert('An error occurred while calculating the bus time. Please try again.');
        }
      } else {
        formStore.setFormData(formWithAccommodationId);
      }
      this.$router.push({ name: 'ConfirmForm' });
    },
    goBack() {
      this.$router.push({ name: 'HospitalList' });
    },
  },
};

</script>

<style scoped>
/* Flexbox layout for wide screens */
.hospital-form-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.explanatory-text {
  flex: 1;
  margin-right: 40px;
  min-width: 300px;
}

.content {
  font-size: 1.5rem;
}

.label {
  font-size: 1.25rem;
}

.radio {
  font-size: 1.25rem;
}

.form-section {
  flex: 1;
  min-width: 300px;
}

@media (max-width: 768px) {

  /* Stack content vertically for small screens */
  .hospital-form-container {
    flex-direction: column;
  }

  .explanatory-text,
  .form-section {
    margin-right: 0;
  }
}

.radio {
  margin-right: 30px;
}
</style>

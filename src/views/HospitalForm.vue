<template>
  <div class="container px-3 py-5">
    <!-- Explanatory Text -->
    <div class="mb-5">
      <h3 class="title is-3 is-size-4-mobile">{{ $t("formular.heading") }}</h3>
      <p class="is-size-5 content mb-2">
        {{ $t("hospitalform.para0", { hospital: hospitalName }) }}
      </p>
      <p class="is-size-5 content">
        {{ $t("hospitalform.para2") }}
      </p>
    </div>

    <!-- STEP 1: Patient info -->
    <form @submit.prevent="checkExisting" class="mb-5" autocomplete="off">
      <h4 class="title is-4">{{ $t("formular.patientInfo") }}</h4>

      <div class="columns is-multiline">
        <div class="column is-half">
          <div class="field">
            <label class="label">{{ $t("formular.name") }}</label>
            <div class="control">
              <input class="input is-medium" type="text" v-model.trim="form.name" required />
            </div>
          </div>
        </div>
        <div class="column is-half">
          <div class="field">
            <label class="label">{{ $t("formular.last_name") }}</label>
            <div class="control">
              <input class="input is-medium" type="text" v-model.trim="form.last_name" />
            </div>
          </div>
        </div>
      </div>

      <div class="columns is-multiline">
        <div class="column is-half">
          <label class="label">{{ $t("formular.dob") }}</label>
          <div class="control">
            <input class="input is-medium" type="date" v-model="form.day_of_birth" />
          </div>
        </div>
        <div class="column is-half">
          <div class="field">
            <label class="label">{{ $t("formular.phone") }}</label>
            <div class="control">
              <input class="input is-medium" type="text" v-model.trim="form.phone_no" />
            </div>
          </div>
        </div>
      </div>

      <div class="columns is-multiline">
        <div class="column is-half">
          <label class="label">{{ $t("formular.accommodation") }}</label>
          <div class="control">
            <div class="select is-medium is-fullwidth">
              <select v-model="form.accommodation" required>
                <option value="">{{ $t("formular.selectAccommodation") }}</option>
                <option v-for="a in accommodations" :key="a.id" :value="a.name">{{ a.name }}</option>
              </select>
            </div>
          </div>
        </div>

        <div class="column is-half">
          <label class="label">{{ $t("formular.room") }}</label>
          <div class="control">
            <input class="input is-medium" type="text" v-model.trim="form.room" required />
          </div>
        </div>
      </div>

      <div class="field is-grouped mt-2" style="gap:10px">
        <div class="control">
          <button class="button is-link" type="submit" :class="{ 'is-loading': checking }">
            {{ $t("formular.findAppointments") || "Find aftaler" }}
          </button>
        </div>
        <div class="control">
          <button class="button is-light" type="button" @click="goBack">
            {{ $t("formular.back") }}
          </button>
        </div>
      </div>
    </form>

    <!-- Results (after Step 1 submit) -->
    <div v-if="checkDone" class="mb-6">
      <h4 class="title is-5">{{ $t("formular.existingAppointments") || "Eksisterende aftaler" }}</h4>

      <div v-if="existing.length">
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
            <tr v-for="a in existingSorted" :key="a.id">
              <td>{{ a.hospital_name }}</td>
              <td>{{ formatTime(busTime(a)) || '-' }}</td>
              <td>{{ formatDate(a.appointment_date) }}</td>
              <td>{{ formatTime(a.appointment_time) }}</td>
              <td>{{ a.department }}</td>
              <td>{{ a.description }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-else class="has-text-grey">
        {{ $t("formular.noAppointments") || "Ingen aftaler fundet" }}
      </p>
    </div>

    <!-- STEP 2: Appointment details (revealed after check) -->
    <form v-if="checkDone" @submit.prevent="goToConfirmation">
      <h4 class="title is-4">{{ $t("formular.newAppointment") || "Ny aftale" }}</h4>

      <div class="field">
        <label class="label">{{ $t("formular.department") }}</label>
        <input class="input is-medium" type="text" v-model.trim="form.department" required />
      </div>


      <div class="columns is-multiline">
        <div class="column is-half">
          <label class="label">{{ $t("formular.translator") }}</label>
          <div class="control">
            <label class="radio mr-2">
              <input type="radio" v-model="form.needs_translator" :value="true" /> {{ $t("formular.radioY") }}
            </label>
            <label class="radio">
              <input type="radio" v-model="form.needs_translator" :value="false" /> {{ $t("formular.radioN") }}
            </label>
          </div>
        </div>

        <div class="column is-half">
          <label class="label">{{ $t("formular.wheelchair") }}</label>
          <div class="control">
            <label class="radio mr-2">
              <input type="radio" v-model="form.wheelchair" :value="true" /> {{ $t("formular.radioY") }}
            </label>
            <label class="radio">
              <input type="radio" v-model="form.wheelchair" :value="false" /> {{ $t("formular.radioN") }}
            </label>
          </div>
        </div>

        <div class="column is-half">
          <label class="label">{{ $t("formular.trolley") }}</label>
          <div class="control">
            <label class="radio mr-2">
              <input type="radio" v-model="form.trolley" :value="true" /> {{ $t("formular.radioY") }}
            </label>
            <label class="radio">
              <input type="radio" v-model="form.trolley" :value="false" /> {{ $t("formular.radioN") }}
            </label>
          </div>
        </div>

        <div class="column is-half">
          <label class="label">{{ $t("formular.companion") }}</label>
          <div class="control">
            <label class="radio mr-2">
              <input type="radio" v-model="form.companion" :value="true" /> {{ $t("formular.radioY") }}
            </label>
            <label class="radio">
              <input type="radio" v-model="form.companion" :value="false" /> {{ $t("formular.radioN") }}
            </label>
          </div>
        </div>
      </div>

      <div class="columns is-multiline">
        <div class="column is-half">
          <label class="label">{{ $t("formular.appDate") }}</label>
          <input class="input is-medium" type="date" v-model="form.appointment_date" required />
        </div>

        <div class="column is-half">
          <label class="label">{{ $t("formular.appTime") }}</label>
          <input class="input is-medium" type="time" v-model="form.appointment_time" required />
        </div>
      </div>

      <div class="field">
        <label class="label">{{ $t("formular.placeholder") }}</label>
        <textarea class="textarea" v-model.trim="form.description" :placeholder="$t('formular.desc')"
          required></textarea>
      </div>
      <div class="field is-grouped mt-4" style="gap:10px">
        <div class="control">
          <button class="button is-primary" type="submit">
            {{ $t("formular.submit") }}
          </button>
        </div>
        <div class="control">
          <button class="button is-light" type="button" @click="goBack">
            {{ $t("formular.back") }}
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { useFormStore } from '@/stores/formStore';
import { useCheckPatientStore } from '@/stores/checkPatientStore';
import api from '@/api';

export default {
  props: ['id'],

  // Ensure a true blank slate when arriving from HospitalList
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.isFreshEntry = !from?.name || from.name === 'HospitalList';
      if (vm.isFreshEntry) {
        const check = useCheckPatientStore();
        const formStore = useFormStore();
        (check.$reset && check.$reset()) || (check.resetStore && check.resetStore());
        (formStore.$reset && formStore.$reset()) || (formStore.resetStore && formStore.resetStore());
      }
      vm.resetAll();
    });
  },

  // Handle param changes within the same component instance
  beforeRouteUpdate(to, from, next) {
    this.isFreshEntry = from.name === 'HospitalList';
    if (to.params.id !== from.params.id || this.isFreshEntry) {
      this.resetAll();
      this.fetchHospitalDetails();
    }
    next();
  },

  data() {
    const check = useCheckPatientStore();
    return {
      isFreshEntry: false,
      hospitalName: '',
      accommodations: [],
      checking: false,
      checkDone: false,
      existing: [],
      form: {
        // STEP 1
        name: check.name || '',
        last_name: check.last_name || '',
        day_of_birth: check.day_of_birth || '',
        phone_no: check.phone_no || '',
        accommodation: check.accommodation || '',
        room: check.room || '',
        hospital: this.id,
        // STEP 2
        appointment_date: '',
        appointment_time: '',
        department: '',
        description: '',
        needs_translator: false,
        trolley: false,
        wheelchair: false,
        companion: false,
      },
    };
  },

  computed: {
    existingSorted() {
      return [...this.existing].sort((a, b) => {
        const d = (a.appointment_date || '').localeCompare(b.appointment_date || '');
        return d !== 0 ? d : (a.appointment_time || '').localeCompare(b.appointment_time || '');
      });
    },
  },

  mounted() {
    this.resetAll();
    this.fetchHospitalDetails();
    this.fetchAccommodations();
  },

  activated() {
    this.resetAll();
  },

  watch: {
    // OPTIONAL: if user edits Step-1 after checking, hide Step-2/results
    'form.name'() { this.checkDone = false; },
    'form.room'() { this.checkDone = false; },
    'form.accommodation'() { this.checkDone = false; },
  },

  methods: {
    // Blank form that ignores Pinia (used on fresh entry from list)
    blankForm() {
      return {
        // STEP 1
        name: '',
        last_name: '',
        day_of_birth: '',
        phone_no: '',
        accommodation: '',
        room: '',
        hospital: this.id,
        // STEP 2
        appointment_date: '',
        appointment_time: '',
        department: '',
        description: '',
        needs_translator: false,
        trolley: false,
        wheelchair: false,
        companion: false,
      };
    },

    // Prefill Step-1 from check store (used when NOT a fresh entry)
    getInitialForm() {
      const check = useCheckPatientStore();
      return {
        // STEP 1
        name: check.name || '',
        last_name: check.last_name || '',
        day_of_birth: check.day_of_birth || '',
        phone_no: check.phone_no || '',
        accommodation: check.accommodation || '',
        room: check.room || '',
        hospital: this.id,
        // STEP 2
        appointment_date: '',
        appointment_time: '',
        department: '',
        description: '',
        needs_translator: false,
        trolley: false,
        wheelchair: false,
        companion: false,
      };
    },

    resetAll() {
      const hospital = this.id;
      this.form = this.isFreshEntry ? this.blankForm() : this.getInitialForm();
      this.form.hospital = hospital; // enforce
      this.existing = [];
      this.checking = false;
      this.checkDone = false;
    },

    async fetchHospitalDetails() {
      try {
        const { data } = await api.get('hospitals/${this.id}');
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

    busTime(a) {
      return a.bus_time_effective || a.bus_time_manual || a.bus_time_computed || null;
    },

    formatDate(d) {
      if (!d) return '-';
      return new Date(d).toLocaleDateString('da-DK', { year: 'numeric', month: '2-digit', day: '2-digit' });
    },

    formatTime(t) {
      return t ? String(t).slice(0, 5) : '';
    },

    // STEP 1 submit: check for existing appointments
    async checkExisting() {
      const check = useCheckPatientStore();
      Object.assign(check, {
        name: this.form.name,
        last_name: this.form.last_name,
        day_of_birth: this.form.day_of_birth,
        phone_no: this.form.phone_no,
        accommodation: this.form.accommodation,
        room: this.form.room,
      });

      this.checking = true;
      this.checkDone = false;
      this.existing = [];
      try {
        const params = {
          name: this.form.name,
          room: this.form.room,
          accommodation: this.form.accommodation,
        };
        const { data } = await api.get('appointments/find-patient/', { params });
        this.existing = Array.isArray(data) ? data : [];
      } catch (e) {
        if (e?.response?.status === 404) {
          this.existing = [];
        } else {
          console.error('Error checking existing appointments:', e);
        }
      } finally {
        this.checking = false;
        this.checkDone = true;
      }
    },

    async goToConfirmation() {
      const ensureSeconds = (t) => (t && t.length === 5 ? `${t}:00` : t);
      const acc = this.accommodations.find(x => x.name === this.form.accommodation);
      const accommodation_id = acc ? acc.id : null;

      const formStore = useFormStore();
      const normalized = { ...this.form, accommodation_id };

      const hospital_id = Number(this.form.hospital);
      const wantsCalc =
        [1, 3, 7].includes(hospital_id) &&
        this.form.accommodation === 'Det grønlandske Patienthjem';

      if (wantsCalc) {
        try {
          const payload = {
            hospital_id,
            accommodation_id,
            appointment_date: this.form.appointment_date,
            appointment_time: ensureSeconds(this.form.appointment_time),
          };
          const { data } = await api.post('appointments/calculate-bus-time/', payload);
          formStore.setFormData({ ...normalized, busTime: data?.bus_time || null });
        } catch (err) {
          console.error('Bus-time error:', err?.response?.data || err.message);
          formStore.setFormData(normalized);
        }
      } else {
        formStore.setFormData(normalized);
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
.label,
.radio {
  font-size: 1.25rem;
}

.label {
  font-family: "Roboto Flex", sans-serif;
  font-weight: 400;
}

.radio {
  margin-right: 30px;
}

input::placeholder,
textarea::placeholder,
input::-webkit-input-placeholder,
textarea::-webkit-input-placeholder,
input::-moz-placeholder,
textarea::-moz-placeholder,
input:-ms-input-placeholder,
textarea:-ms-input-placeholder,
input:-moz-placeholder,
textarea:-moz-placeholder {
  color: black;
  opacity: 1;
}
</style>

<template>
    <div>
        <form @submit.prevent="submitForm">
            <div class="field">
                <label class="label">{{ $t("formular.accommodation") }}</label>
                <div class="control">
                    <div class="select is-medium">
                        <select v-model="form.accommodation" required>
                            <option value="">{{ $t("formular.selectAccommodation") }}</option>
                            <option v-for="accommodation in accommodations" :key="accommodation.id"
                                :value="accommodation.name">
                                {{ accommodation.name }}
                            </option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="columns">
                <div class="field column">
                    <label class="label">{{ $t("formular.name") }}</label>
                    <div class="control">
                        <input class="input is-medium" type="text" v-model="form.name" required />
                    </div>
                </div>
                <div class="field column">
                    <label class="label">{{ $t("formular.room") }}</label>
                    <div class="control">
                        <input class="input is-medium" type="text" v-model="form.room" required />
                    </div>
                </div>
            </div>
            <button class="button is-medium is-primary" type="submit">
                {{ $t("formular.submit") }}
            </button>
        </form>
    </div>
</template>

<script>
import axios from 'axios';
const apiUrl = process.env.VUE_APP_BACKEND_URL;

export default {
    data() {
        return {
            form: {
                name: '',
                accommodation: '',
                room: '',
            },
            accommodations: [],
        };
    },
    mounted() {
        this.fetchAccommodations();
    },
    methods: {
        async fetchAccommodations() {
            try {
                const response = await axios.get(`${apiUrl}/api/accommodations/`);
                this.accommodations = response.data;
            } catch (error) {
                console.error('Error fetching accommodations:', error);
            }
        },
        submitForm() {
            this.$emit('basicInfoSubmitted', this.form);
        },
    },
};
</script>

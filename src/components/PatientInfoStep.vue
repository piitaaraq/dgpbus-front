<template>
    <form @submit.prevent="handleSubmit" class="patient-info-form" autocomplete="off">
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
                        <input class="input is-medium" type="text" v-model.trim="form.last_name" required />
                    </div>
                </div>
            </div>
        </div>

        <div class="columns is-multiline">
            <div class="column is-half">
                <label class="label">{{ $t("formular.dob") }}</label>
                <div class="control">
                    <input class="input is-medium" type="date" v-model="form.day_of_birth" required />
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
                            <option v-for="a in accommodations" :key="a.id" :value="a.name">
                                {{ a.name }}
                            </option>
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

        <div class="field is-grouped mt-4" style="gap: 10px">
            <div class="control">
                <button class="button is-link" type="submit" :class="{ 'is-loading': isLoading }">
                    {{ $t("formular.findAppointments") || "Find aftaler" }}
                </button>
            </div>
            <div class="control">
                <button class="button is-light" type="button" @click="$emit('back')">
                    {{ $t("formular.back") }}
                </button>
            </div>
        </div>
    </form>
</template>

<script>
export default {
    props: {
        hospitalId: {
            type: [String, Number],
            required: true,
        },
        accommodations: {
            type: Array,
            default: () => [],
        },
        initialData: {
            type: Object,
            default: () => ({}),
        },
    },

    emits: ['next', 'back'],

    data() {
        return {
            isLoading: false,
            form: {
                name: this.initialData.name || '',
                last_name: this.initialData.last_name || '',
                day_of_birth: this.initialData.day_of_birth || '',
                phone_no: this.initialData.phone_no || '',
                accommodation: this.initialData.accommodation || '',
                room: this.initialData.room || '',
            },
        };
    },

    methods: {
        handleSubmit() {
            this.isLoading = true;
            this.$emit('next', { ...this.form });
            // Parent will handle the API call and set isLoading back via navigation
            setTimeout(() => {
                this.isLoading = false;
            }, 500);
        },
    },
};
</script>

<style scoped>
.label {
    font-size: 1.25rem;
    font-family: "Roboto Flex", sans-serif;
    font-weight: 400;
}

input::placeholder,
input::-webkit-input-placeholder,
input::-moz-placeholder,
input:-ms-input-placeholder,
input:-moz-placeholder {
    color: black;
    opacity: 1;
}
</style>
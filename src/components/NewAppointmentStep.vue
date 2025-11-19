<template>
    <form @submit.prevent="handleSubmit" class="new-appointment-form">
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
                        <input type="radio" v-model="form.needs_translator" :value="true" />
                        {{ $t("formular.radioY") }}
                    </label>
                    <label class="radio">
                        <input type="radio" v-model="form.needs_translator" :value="false" />
                        {{ $t("formular.radioN") }}
                    </label>
                </div>
            </div>

            <div class="column is-half">
                <label class="label">{{ $t("formular.wheelchair") }}</label>
                <div class="control">
                    <label class="radio mr-2">
                        <input type="radio" v-model="form.wheelchair" :value="true" />
                        {{ $t("formular.radioY") }}
                    </label>
                    <label class="radio">
                        <input type="radio" v-model="form.wheelchair" :value="false" />
                        {{ $t("formular.radioN") }}
                    </label>
                </div>
            </div>

            <div class="column is-half">
                <label class="label">{{ $t("formular.trolley") }}</label>
                <div class="control">
                    <label class="radio mr-2">
                        <input type="radio" v-model="form.trolley" :value="true" />
                        {{ $t("formular.radioY") }}
                    </label>
                    <label class="radio">
                        <input type="radio" v-model="form.trolley" :value="false" />
                        {{ $t("formular.radioN") }}
                    </label>
                </div>
            </div>

            <div class="column is-half">
                <label class="label">{{ $t("formular.companion") }}</label>
                <div class="control">
                    <label class="radio mr-2">
                        <input type="radio" v-model="form.companion" :value="true" />
                        {{ $t("formular.radioY") }}
                    </label>
                    <label class="radio">
                        <input type="radio" v-model="form.companion" :value="false" />
                        {{ $t("formular.radioN") }}
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

        <div class="field is-grouped mt-4" style="gap: 10px">
            <div class="control">
                <button class="button is-primary" type="submit">
                    {{ $t("formular.continue") || "Fortsæt" }}
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
        initialData: {
            type: Object,
            default: () => ({}),
        },
    },

    emits: ['next', 'back'],

    data() {
        return {
            form: {
                appointment_date: this.initialData.appointment_date || '',
                appointment_time: this.initialData.appointment_time || '',
                department: this.initialData.department || '',
                description: this.initialData.description || '',
                needs_translator: this.initialData.needs_translator || false,
                trolley: this.initialData.trolley || false,
                wheelchair: this.initialData.wheelchair || false,
                companion: this.initialData.companion || false,
            },
        };
    },

    methods: {
        handleSubmit() {
            this.$emit('next', { ...this.form });
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

.radio {
    margin-right: 30px;
    font-size: 1.25rem;
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
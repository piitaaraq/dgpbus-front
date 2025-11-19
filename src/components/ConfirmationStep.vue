<template>
    <div class="confirmation-step">
        <h4 class="title is-4">{{ $t("formular.confirmation") || "Bekræft oplysninger" }}</h4>

        <div class="notification is-info is-light mb-4">
            <p>{{ $t("formular.reviewBeforeSubmit") || "Gennemgå venligst oplysningerne før afsendelse" }}</p>
        </div>

        <!-- Patient Information -->
        <div class="box mb-4">
            <h5 class="title is-5 mb-3">{{ $t("formular.patientInfo") }}</h5>
            <div class="columns is-multiline">
                <div class="column is-half">
                    <strong>{{ $t("formular.name") }}:</strong> {{ patientData.name }} {{ patientData.last_name }}
                </div>
                <div class="column is-half" v-if="patientData.day_of_birth">
                    <strong>{{ $t("formular.dob") }}:</strong> {{ formatDate(patientData.day_of_birth) }}
                </div>
                <div class="column is-half" v-if="patientData.phone_no">
                    <strong>{{ $t("formular.phone") }}:</strong> {{ patientData.phone_no }}
                </div>
                <div class="column is-half">
                    <strong>{{ $t("formular.accommodation") }}:</strong> {{ patientData.accommodation }}
                </div>
                <div class="column is-half">
                    <strong>{{ $t("formular.room") }}:</strong> {{ patientData.room }}
                </div>
            </div>
        </div>

        <!-- Appointment Information -->
        <div class="box mb-4">
            <h5 class="title is-5 mb-3">{{ $t("formular.appointmentDetails") || "Aftaledetaljer" }}</h5>
            <div class="columns is-multiline">
                <div class="column is-half">
                    <strong>{{ $t("confirm.hospital") }}:</strong> {{ hospitalName }}
                </div>
                <div class="column is-half">
                    <strong>{{ $t("formular.department") }}:</strong> {{ appointmentData.department }}
                </div>
                <div class="column is-half">
                    <strong>{{ $t("formular.appDate") }}:</strong> {{ formatDate(appointmentData.appointment_date) }}
                </div>
                <div class="column is-half">
                    <strong>{{ $t("formular.appTime") }}:</strong> {{ formatTime(appointmentData.appointment_time) }}
                </div>
                <div class="column is-full" v-if="busTime">
                    <strong>{{ $t("confirm.bustime") }}:</strong> {{ formatTime(busTime) }}
                </div>
                <div class="column is-full">
                    <strong>{{ $t("formular.desc") }}:</strong><br />
                    {{ appointmentData.description }}
                </div>
            </div>
        </div>

        <!-- Special Requirements -->
        <div class="box mb-4" v-if="hasSpecialRequirements">
            <h5 class="title is-5 mb-3">{{ $t("formular.specialRequirements") || "Særlige behov" }}</h5>
            <div class="tags">
                <span v-if="appointmentData.needs_translator" class="tag is-info is-medium">
                    {{ $t("formular.translator") }}
                </span>
                <span v-if="appointmentData.wheelchair" class="tag is-info is-medium">
                    {{ $t("formular.wheelchair") }}
                </span>
                <span v-if="appointmentData.trolley" class="tag is-info is-medium">
                    {{ $t("formular.trolley") }}
                </span>
                <span v-if="appointmentData.companion" class="tag is-info is-medium">
                    {{ $t("formular.companion") }}
                </span>
            </div>
        </div>

        <!-- Confirmation checkbox -->
        <div class="field mb-4">
            <label class="checkbox">
                <input type="checkbox" v-model="confirmed" />
                {{ $t("formular.confirmCorrect") || "Jeg bekræfter, at oplysningerne er korrekte" }}
            </label>
        </div>

        <!-- Error message -->
        <div v-if="errorMessage" class="notification is-danger mb-4">
            {{ errorMessage }}
        </div>

        <!-- Success message -->
        <div v-if="showSuccess" class="notification is-success mb-4">
            <span class="icon">
                <i class="fas fa-check-circle"></i>
            </span>
            {{ $t("formular.appointmentCreated") || "Aftale oprettet! Sender dig tilbage..." }}
        </div>

        <!-- Actions -->
        <div class="field is-grouped" style="gap: 10px">
            <div class="control">
                <button class="button is-success" type="button" @click="handleSubmit"
                    :disabled="!confirmed || isSubmitting" :class="{ 'is-loading': isSubmitting }">
                    {{ $t("formular.submit") }}
                </button>
            </div>
            <div class="control">
                <button class="button is-light" type="button" @click="$emit('back')" :disabled="isSubmitting">
                    {{ $t("formular.back") }}
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        patientData: {
            type: Object,
            required: true,
        },
        appointmentData: {
            type: Object,
            required: true,
        },
        hospitalName: {
            type: String,
            default: '',
        },
        busTime: {
            type: String,
            default: null,
        },
    },

    emits: ['submit', 'back'],

    data() {
        return {
            confirmed: false,
            isSubmitting: false,
            errorMessage: '',
            showSuccess: false,
        };
    },

    computed: {
        hasSpecialRequirements() {
            return (
                this.appointmentData.needs_translator ||
                this.appointmentData.wheelchair ||
                this.appointmentData.trolley ||
                this.appointmentData.companion
            );
        },
    },

    methods: {
        formatDate(date) {
            if (!date) return '-';
            return new Date(date).toLocaleDateString('da-DK', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            });
        },

        formatTime(time) {
            return time ? String(time).slice(0, 5) : '';
        },

        async handleSubmit() {
            if (!this.confirmed) return;

            this.isSubmitting = true;
            this.errorMessage = '';

            try {
                await this.$emit('submit');
                // Note: Navigation happens in parent, but we can show success briefly
                this.showSuccess = true;
            } catch (error) {
                console.error('Submit error:', error);
                this.errorMessage = error.message || 'Der opstod en fejl. Prøv venligst igen.';
                this.isSubmitting = false;
            }
        },
    },
};
</script>

<style scoped>
.box {
    background: #f5f5f5;
    border-radius: 6px;
}

.title.is-5 {
    color: #363636;
}

.column strong {
    color: #4a4a4a;
}

.checkbox {
    font-size: 1.1rem;
}

.tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.notification.is-success {
    animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media screen and (max-width: 768px) {
    .column {
        padding: 0.5rem;
    }
}
</style>
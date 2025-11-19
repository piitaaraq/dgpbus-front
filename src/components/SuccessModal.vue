<template>
    <transition name="modal-fade">
        <div v-if="show" class="modal is-active">
            <div class="modal-background" @click="$emit('close')"></div>
            <div class="modal-content">
                <div class="box has-text-centered success-box">
                    <div class="icon-wrapper mb-4">
                        <span class="icon is-large has-text-success">
                            <i class="fas fa-check-circle fa-3x"></i>
                        </span>
                    </div>

                    <h3 class="title is-4 mb-3">
                        {{ $t("formular.success") || "Succes!" }}
                    </h3>

                    <p class="subtitle is-5 mb-4">
                        {{ $t("formular.appointmentCreatedSuccess") || "Din aftale er blevet oprettet" }}
                    </p>

                    <div class="content has-text-left mb-4">
                        <p><strong>{{ patientName }}</strong></p>
                        <p>{{ hospitalName }}</p>
                        <p>{{ formatDate(appointmentDate) }} {{ $t("formular.at") || "kl." }} {{
                            formatTime(appointmentTime) }}</p>
                    </div>

                    <p class="is-size-6 has-text-grey">
                        {{ $t("formular.redirecting") || "Sender dig tilbage om" }} {{ countdown }} {{
                            $t("formular.seconds") || "sekunder..." }}
                    </p>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    props: {
        show: {
            type: Boolean,
            default: false,
        },
        patientName: {
            type: String,
            default: '',
        },
        hospitalName: {
            type: String,
            default: '',
        },
        appointmentDate: {
            type: String,
            default: '',
        },
        appointmentTime: {
            type: String,
            default: '',
        },
    },

    emits: ['close'],

    data() {
        return {
            countdown: 3,
        };
    },

    watch: {
        show(newVal) {
            if (newVal) {
                this.countdown = 3;
                this.startCountdown();
            }
        },
    },

    methods: {
        startCountdown() {
            const interval = setInterval(() => {
                this.countdown--;
                if (this.countdown <= 0) {
                    clearInterval(interval);
                }
            }, 1000);
        },

        formatDate(date) {
            if (!date) return '';
            return new Date(date).toLocaleDateString('da-DK', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        },

        formatTime(time) {
            return time ? String(time).slice(0, 5) : '';
        },
    },
};
</script>

<style scoped>
.success-box {
    background: white;
    padding: 3rem 2rem;
    border-radius: 8px;
    max-width: 500px;
    margin: 0 auto;
}

.icon-wrapper {
    animation: scaleIn 0.5s ease-out;
}

@keyframes scaleIn {
    from {
        transform: scale(0);
        opacity: 0;
    }

    to {
        transform: scale(1);
        opacity: 1;
    }
}

.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}

.modal-fade-enter-active .box,
.modal-fade-leave-active .box {
    transition: transform 0.3s ease;
}

.modal-fade-enter-from .box {
    transform: translateY(-50px);
}

.modal-fade-leave-to .box {
    transform: translateY(50px);
}

@media screen and (max-width: 768px) {
    .success-box {
        padding: 2rem 1.5rem;
    }
}
</style>
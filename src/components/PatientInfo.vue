<template>
    <div>
        <h2>{{ $t("formular.heading") }}</h2>
        <p>{{ $t("formular.name") }}: {{ appointment.name }}</p>
        <p>{{ $t("formular.appDate") }}: {{ appointment.appointment_date }}</p>
        <p>{{ $t("formular.appTime") }}: {{ appointment.appointment_time }}</p>
        <p>{{ $t("formular.hospital") }}: {{ appointment.hospital }}</p>
        <p>{{ $t("formular.department") }}: {{ appointment.department }}</p>
        <p v-if="appointment.bus_time">{{ $t("formular.busTime") }}: {{ appointment.bus_time }}</p>
        <button class="button is-medium is-primary" @click="$emit('registerAnother')">
            {{ $t("formular.registerAnother") }}
        </button>
    </div>
</template>

<script>
export default {
    props: ['appointment'],
};
</script>

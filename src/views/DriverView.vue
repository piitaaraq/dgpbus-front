<template>
    <div class="driver-view-container container">
        <h2 class="title is-2">{{ $t("driver.heading") }}</h2>

        <div v-if="!selectedGroup">
            <table class="table is-fullwidth is-striped mb-5">
                <thead>
                    <tr>
                        <th>{{ $t("driver.departureTime") }}</th>
                        <th>{{ $t("driver.passengerCount") }}</th>
                        <th>{{ $t("driver.viewPassengers") }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="group in groupedPatients" :key="group.departure_time">
                        <td>{{ formatTime(group.departure_time) }}</td>
                        <td>
                            {{ totalPassengers(group.patients) }}
                            <span v-if="hasWheelchair(group.patients)">
                                <font-awesome-icon :icon="['fa', 'wheelchair']" class="ml-2" title="Wheelchair" />
                            </span>
                            <span v-if="hasTrolley(group.patients)">
                                <font-awesome-icon :icon="['fa', 'baby-carriage']" class="ml-2" title="Trolley" />
                            </span>
                        </td>
                        <td>
                            <button class="button is-light" @click="viewGroup(group)">
                                {{ $t("driver.viewButton") }}
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-else>
            <button class="button is-light mb-3" @click="selectedGroup = null">
                {{ $t("driver.back") }}
            </button>
            <table class="table is-fullwidth is-striped">
                <thead>
                    <tr>
                        <th>{{ $t("driver.name") }}</th>
                        <th>{{ $t("driver.room") }}</th>
                        <th>{{ $t("driver.hospital") }}</th>
                        <th>{{ $t("driver.status") }}</th>
                        <th>{{ $t("driver.action") }}</th> <!-- New column -->

                    </tr>
                </thead>
                <tbody>
                    <tr v-for="patient in selectedGroup.patients" :key="patient.id">
                        <td>
                            {{ patient.name }}
                            <span v-if="patient.companion" class="has-text-grey is-size-7 ml-1"> +1</span>
                            <span v-if="patient.trolley" class="has-text-grey is-size-7 ml-1" title="Kørestol"> +
                                <font-awesome-icon :icon="['fa', 'baby-carriage']" class="icons" />
                            </span>
                            <span v-if="patient.wheelchair" class="has-text-grey is-size-7 ml-1" title="Barnevogn"> +
                                <font-awesome-icon :icon="['fa', 'wheelchair']" class="icons" />
                            </span>
                        </td>
                        <td>{{ patient.room }}</td>
                        <td>{{ patient.hospital_name }}</td>
                        <td>
                            <span v-if="patient.status">{{ $t("driver.checkedIn") }}</span>
                            <span v-else>{{ $t("driver.notCheckedIn") }}</span>
                        </td>
                        <td>
                            <button class="button is-small is-primary" @click="toggleCheckIn(patient)">
                                {{ patient.status ? $t("driver.undo") : $t("driver.checkIn") }}
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'; // Import FontAwesome
const apiUrl = process.env.VUE_APP_BACKEND_URL;

export default {
    components: {
        FontAwesomeIcon, // Register FontAwesome component
    },
    data() {
        return {
            groupedPatients: [],
            selectedGroup: null,
        };
    },
    mounted() {
        this.fetchRidesToday();
    },
    methods: {
        async fetchRidesToday() {
            try {
                const response = await axios.get(`${apiUrl}/api/patients/rides-today/`);
                const grouped = {};

                response.data.forEach(patient => {
                    const key = patient.bus_time?.substring(0, 5) || 'Ukendt';
                    if (!grouped[key]) grouped[key] = [];
                    grouped[key].push(patient);
                });

                this.groupedPatients = Object.keys(grouped).map(time => ({
                    departure_time: time,
                    patients: grouped[time]
                }));
            } catch (error) {
                console.error('Error fetching today\'s rides:', error);
            }
        },
        totalPassengers(patients) {
            return patients.reduce((count, p) => count + 1 + (p.companion ? 1 : 0), 0);
        },
        async toggleCheckIn(patient) {
            try {
                const response = await axios.patch(`${apiUrl}/api/patients/${patient.id}/toggle-status/`);
                patient.status = response.data.status; // Update local status
            } catch (error) {
                console.error('Error toggling check-in status:', error);
            }
        },
        viewGroup(group) {
            this.selectedGroup = group;
        },
        formatTime(time) {
            return time ? time.substring(0, 5) : 'N/A';
        },
        hasWheelchair(patients) {
            return patients.some(patient => patient.wheelchair);
        },
        hasTrolley(patients) {
            return patients.some(patient => patient.trolley);
        }
    }
};
</script>

<style scoped>
.driver-view-container {
    padding: 20px;
}

.table {
    margin-top: 20px;
}
</style>
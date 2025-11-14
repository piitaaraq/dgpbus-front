<template>
    <div class="all-appointments-container container">
        <h3 class="title is-3">{{ $t("appointments.heading") }}</h3>

        <!-- Filter Section -->
        <div class="filters-section box">
            <div class="columns is-multiline">
                <div class="column is-3">
                    <div class="field">
                        <label class="label">{{ $t("appointments.name") }}</label>
                        <div class="control">
                            <input v-model="filters.name" class="input" type="text"
                                placeholder="For- eller efternavn" />
                        </div>
                    </div>
                </div>
                <div class="column is-2">
                    <div class="field">
                        <label class="label">{{ $t("appointments.accommodation") }}</label>
                        <div class="control">
                            <div class="select is-fullwidth">
                                <select v-model="filters.accommodation">
                                    <option value="">Alle</option>
                                    <option v-for="acc in uniqueAccommodations" :key="acc" :value="acc">
                                        {{ acc }}
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="column is-2">
                    <div class="field">
                        <label class="label">{{ $t("appointments.hospital") }}</label>
                        <div class="control">
                            <div class="select is-fullwidth">
                                <select v-model="filters.hospital">
                                    <option value="">Alle</option>
                                    <option v-for="hosp in uniqueHospitals" :key="hosp" :value="hosp">
                                        {{ hosp }}
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="column is-2">
                    <div class="field">
                        <label class="label">Fra dato</label>
                        <div class="control">
                            <input v-model="filters.dateFrom" class="input" type="date" />
                        </div>
                    </div>
                </div>
                <div class="column is-2">
                    <div class="field">
                        <label class="label">Til dato</label>
                        <div class="control">
                            <input v-model="filters.dateTo" class="input" type="date" />
                        </div>
                    </div>
                </div>
                <div class="column is-1">
                    <div class="field">
                        <label class="label">Tolk</label>
                        <div class="control">
                            <div class="select is-fullwidth">
                                <select v-model="filters.translator">
                                    <option value="">Alle</option>
                                    <option value="true">Ja</option>
                                    <option value="false">Nej</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="column is-12 is-flex is-justify-content-space-between is-align-items-center">
                    <div class="has-text-grey">
                        Viser {{ filteredRides.length }} af {{ rides.length }} aftaler
                    </div>
                    <button class="button is-light" @click="clearFilters">
                        <span class="icon">
                            <font-awesome-icon :icon="['fas', 'times']" />
                        </span>
                        <span>Ryd filtre</span>
                    </button>
                </div>
            </div>
        </div>

        <table v-if="filteredRides.length > 0" class="table is-fullwidth is-striped is-hoverable">
            <thead>
                <tr>
                    <th>{{ $t("appointments.name") }}</th>
                    <th>{{ $t("appointments.accommodation") }}</th>
                    <th>{{ $t("appointments.hospital") }}</th>
                    <th>{{ $t("appointments.appointmentDate") }}</th>
                    <th>{{ $t("appointments.appointmentTime") }}</th>
                    <th>{{ $t("appointments.busTime") }}</th>
                    <th>Tolk</th>
                    <th>Handlinger</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="ride in filteredRides" :key="ride.id">
                    <td>{{ ride.patient_name }} {{ ride.patient_last_name }}</td>
                    <td>{{ ride.accommodation_name || 'N/A' }}</td>
                    <td>{{ ride.hospital_name }}</td>
                    <td>{{ formatDate(ride.appointment_date) }}</td>
                    <td>{{ formatTime(ride.appointment_time) }}</td>
                    <td>
                        {{ getBusTime(ride) ? formatTime(getBusTime(ride)) : 'Taxa' }}
                    </td>
                    <td class="has-text-centered">
                        <font-awesome-icon v-if="ride.translator === true" :icon="['fas', 'check']"
                            class="has-text-success" title="Tolk: ja" />
                        <font-awesome-icon v-else :icon="['fas', 'xmark']" class="has-text-danger" title="Tolk: nej" />
                    </td>
                    <td>
                        <div class="buttons are-small">
                            <button class="button is-info" @click="openEditModal(ride)" title="Rediger">
                                <span class="icon">
                                    <font-awesome-icon :icon="['fas', 'edit']" />
                                </span>
                            </button>
                            <button class="button is-danger" @click="deleteAppointment(ride.id)" title="Slet">
                                <span class="icon">
                                    <font-awesome-icon :icon="['fas', 'trash']" />
                                </span>
                            </button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>

        <p v-else class="is-size-2 is-size-4-mobile">
            {{ filters.name || filters.accommodation || filters.hospital || filters.translator || filters.dateFrom ||
                filters.dateTo
                ? "Ingen aftaler matcher dine filtre"
                : $t("appointments.noAppointments") }}
        </p>
        <!-- Edit Modal Component -->
        <EditAppointmentModal :is-active="isEditModalActive" :appointment="selectedAppointment" @close="closeEditModal"
            @saved="handleAppointmentSaved" @error="handleSaveError" />
    </div>
</template>

<script>
import api from '@/api';
import EditAppointmentModal from '@/components/EditAppointmentModal.vue';

export default {
    name: 'AllAppointments',
    components: {
        EditAppointmentModal
    },
    data() {
        return {
            rides: [],
            filters: {
                name: '',
                accommodation: '',
                hospital: '',
                translator: '',
                dateFrom: '',
                dateTo: ''
            },
            isEditModalActive: false,
            selectedAppointment: null
        };
    },
    computed: {
        uniqueAccommodations() {
            const accommodations = [...new Set(this.rides.map(r => r.accommodation_name).filter(Boolean))];
            return accommodations.sort();
        },
        uniqueHospitals() {
            const hospitals = [...new Set(this.rides.map(r => r.hospital_name).filter(Boolean))];
            return hospitals.sort();
        },
        filteredRides() {
            return this.rides.filter(ride => {
                // Name filter (searches both first and last name)
                const nameMatch = !this.filters.name ||
                    `${ride.patient_name} ${ride.patient_last_name}`
                        .toLowerCase()
                        .includes(this.filters.name.toLowerCase());

                // Accommodation filter
                const accommodationMatch = !this.filters.accommodation ||
                    ride.accommodation_name === this.filters.accommodation;

                // Hospital filter
                const hospitalMatch = !this.filters.hospital ||
                    ride.hospital_name === this.filters.hospital;

                // Translator filter
                const translatorMatch = this.filters.translator === '' ||
                    ride.translator.toString() === this.filters.translator;

                // Date range filter
                const appointmentDate = new Date(ride.appointment_date);
                const dateFromMatch = !this.filters.dateFrom ||
                    appointmentDate >= new Date(this.filters.dateFrom);
                const dateToMatch = !this.filters.dateTo ||
                    appointmentDate <= new Date(this.filters.dateTo);

                return nameMatch && accommodationMatch && hospitalMatch && translatorMatch && dateFromMatch && dateToMatch;
            });
        }
    },
    mounted() {
        this.fetchRides();
    },
    methods: {
        async fetchRides() {
            const response = await api.get('appointments/alle-aftaler/');
            console.log('Fetched rides:', response.data);
            this.rides = response.data.sort((a, b) => {
                const d = new Date(a.appointment_date) - new Date(b.appointment_date);
                return d !== 0 ? d : a.appointment_time.localeCompare(b.appointment_time);
            });
        },
        clearFilters() {
            this.filters = {
                name: '',
                accommodation: '',
                hospital: '',
                translator: '',
                dateFrom: '',
                dateTo: ''
            };
        },
        getBusTime(ride) {
            return ride.bus_time_effective || ride.bus_time_manual || ride.bus_time_computed || null;
        },
        formatTime(t) { return t ? t.slice(0, 5) : ''; },
        formatDate(d) {
            return new Date(d).toLocaleDateString('da-DK', { year: 'numeric', month: '2-digit', day: '2-digit' });
        },
        openEditModal(appointment) {
            this.selectedAppointment = appointment;
            this.isEditModalActive = true;
        },
        closeEditModal() {
            this.isEditModalActive = false;
            this.selectedAppointment = null;
        },
        async handleAppointmentSaved(updatedAppointment) {
            console.log('Appointment saved:', updatedAppointment);
            this.$toast?.success('Aftale opdateret');
            await this.fetchRides(); // Refresh the list
        },
        handleSaveError(error) {
            console.error('Save error:', error);
            this.$toast?.error('Fejl ved opdatering af aftale');
        },
        async deleteAppointment(id) {
            if (!confirm('Er du sikker på, at du vil slette denne aftale?')) {
                return;
            }
            try {
                await api.delete(`appointments/${id}/`);
                this.$toast?.success('Aftale slettet');
                await this.fetchRides();
            } catch (error) {
                console.error('Error deleting appointment:', error);
                this.$toast?.error('Fejl ved sletning af aftale');
            }
        }
    }
};
</script>

<style scoped>
.all-appointments-container {
    padding: 20px;
}

.filters-section {
    margin-bottom: 20px;
}

.table {
    margin-top: 20px;
    font-size: 1rem;
}
</style>
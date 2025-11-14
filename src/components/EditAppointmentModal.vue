<template>
    <div class="modal" :class="{ 'is-active': isActive }">
        <div class="modal-background" @click="close"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">Rediger Aftale</p>
                <button class="delete" aria-label="close" @click="close"></button>
            </header>
            <section class="modal-card-body">
                <div class="columns is-multiline">
                    <div class="column is-6">
                        <div class="field">
                            <label class="label">Fornavn</label>
                            <div class="control">
                                <input v-model="form.patient_name" class="input" type="text" />
                            </div>
                        </div>
                    </div>
                    <div class="column is-6">
                        <div class="field">
                            <label class="label">Efternavn</label>
                            <div class="control">
                                <input v-model="form.patient_last_name" class="input" type="text" />
                            </div>
                        </div>
                    </div>
                    <div class="column is-6">
                        <div class="field">
                            <label class="label">Værelse</label>
                            <div class="control">
                                <input v-model="form.patient_room" class="input" type="text" />
                            </div>
                        </div>
                    </div>
                    <div class="column is-6">
                        <div class="field">
                            <label class="label">Aftale Dato</label>
                            <div class="control">
                                <input v-model="form.appointment_date" class="input" type="date"
                                    @change="onDateChange" />
                            </div>
                        </div>
                    </div>
                    <div class="column is-6">
                        <div class="field">
                            <label class="label">Aftale Tid</label>
                            <div class="control">
                                <input v-model="form.appointment_time" class="input" type="time" />
                            </div>
                        </div>
                    </div>
                    <div class="column is-6">
                        <div class="field">
                            <label class="label">Bus Tid</label>
                            <div class="control">
                                <div class="select is-fullwidth">
                                    <select v-model="busTimeOption" @change="onBusTimeOptionChange">
                                        <option value="AUTO">Automatisk beregnet ({{ computedBusTime }})</option>
                                        <option value="MANUAL">Vælg en anden tid...</option>
                                        <option value="TAXI">Taxa (ingen bus)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <!-- Schedule dropdown if user selects "Vælg anden tid..." -->
                        <div v-if="busTimeOption === 'MANUAL'" class="field mt-2">
                            <label class="label">Vælg afgangstid</label>
                            <div class="control">
                                <div class="select is-fullwidth" :class="{ 'is-loading': isLoadingSchedule }">
                                    <select v-model="form.bus_time_manual">
                                        <option value="">-- Vælg tid --</option>
                                        <option v-for="schedule in schedules" :key="schedule.id"
                                            :value="schedule.departure_time">
                                            {{ formatTime(schedule.departure_time) }}
                                            <template v-if="schedule.destination_name">
                                                ({{ schedule.destination_name }})
                                            </template>
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <p class="help" v-if="schedules.length === 0">
                                Ingen planlagte afgange denne dag
                            </p>
                        </div>
                        <div class="field">
                            <p class="help">
                                <template v-if="busTimeOption === 'AUTO'">
                                    Automatisk beregnet baseret på hospital og indkvartering
                                </template>
                                <template v-else-if="busTimeOption === 'TAXI'">
                                    Patient vil ikke bruge bussen
                                </template>
                                <template v-else-if="busTimeOption === 'MANUAL' && form.bus_time_manual">
                                    Manuel valgt afgang: {{ formatTime(form.bus_time_manual) }}
                                </template>
                                <template v-else-if="busTimeOption === 'MANUAL'">
                                    Vælg en afgangstid fra listen
                                </template>
                            </p>
                        </div>
                    </div>
                    <div class="column is-12">
                        <div class="field">
                            <label class="label">Beskrivelse</label>
                            <div class="control">
                                <textarea v-model="form.description" class="textarea" rows="3"></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="column is-12">
                        <div class="field is-grouped is-grouped-multiline">
                            <div class="control">
                                <label class="checkbox">
                                    <input v-model="form.translator" type="checkbox" />
                                    Tolk
                                </label>
                            </div>
                            <div class="control">
                                <label class="checkbox">
                                    <input v-model="form.trolley" type="checkbox" />
                                    Rollator
                                </label>
                            </div>
                            <div class="control">
                                <label class="checkbox">
                                    <input v-model="form.wheelchair" type="checkbox" />
                                    Kørestol
                                </label>
                            </div>
                            <div class="control">
                                <label class="checkbox">
                                    <input v-model="form.companion" type="checkbox" />
                                    Ledsager
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <footer class="modal-card-foot is-justify-content-space-between">
                <button class="button is-success" @click="save" :class="{ 'is-loading': isSaving }">
                    <span class="icon">
                        <font-awesome-icon :icon="['fas', 'save']" />
                    </span>
                    <span>Gem</span>
                </button>
                <button class="button" @click="close">Annuller</button>
            </footer>
        </div>
    </div>
</template>

<script>
import api from '@/api';

export default {
    name: 'EditAppointmentModal',
    props: {
        isActive: {
            type: Boolean,
            required: true
        },
        appointment: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            form: {
                patient_name: '',
                patient_last_name: '',
                patient_room: '',
                appointment_date: '',
                appointment_time: '',
                bus_time_manual: '',
                description: '',
                translator: false,
                trolley: false,
                wheelchair: false,
                companion: false
            },
            schedules: [],
            busTimeOption: 'AUTO', // 'AUTO', 'MANUAL', or 'TAXI'
            isLoadingSchedule: false,
            isSaving: false,
            computedBusTime: 'Beregnes...'
        };
    },
    watch: {
        appointment: {
            handler(newVal) {
                if (newVal) {
                    this.loadAppointmentData(newVal);
                    this.fetchSchedules(newVal.appointment_date);
                }
            },
            immediate: true
        }
    },
    methods: {
        loadAppointmentData(appointment) {
            this.form = {
                patient_name: appointment.patient_name || '',
                patient_last_name: appointment.patient_last_name || '',
                patient_room: appointment.patient_room || '',
                appointment_date: appointment.appointment_date || '',
                appointment_time: appointment.appointment_time || '',
                bus_time_manual: appointment.bus_time_manual || '',
                description: appointment.description || '',
                translator: appointment.translator || false,
                trolley: appointment.trolley || false,
                wheelchair: appointment.wheelchair || false,
                companion: appointment.companion || false
            };

            // Set the computed bus time display
            this.computedBusTime = appointment.bus_time_computed
                ? this.formatTime(appointment.bus_time_computed)
                : 'N/A';

            // Determine the bus time option based on existing data
            if (!appointment.bus_time_manual && !appointment.bus_time_computed) {
                this.busTimeOption = 'TAXI';
            } else if (appointment.bus_time_manual) {
                this.busTimeOption = 'MANUAL';
            } else {
                this.busTimeOption = 'AUTO';
            }
        },
        async fetchSchedules(date) {
            if (!date) {
                console.warn('No date provided to fetchSchedules');
                return;
            }

            console.log('Fetching schedules for date:', date);
            this.isLoadingSchedule = true;
            try {
                const response = await api.get('schedules/', {
                    params: { date: date }
                });
                this.schedules = response.data;
                console.log('Fetched schedules:', this.schedules);
                console.log('Number of schedules:', this.schedules.length);
            } catch (error) {
                console.error('Error fetching schedules:', error);
                console.error('Error details:', error.response?.data);
                this.$emit('error', { message: 'Kunne ikke hente køreplan' });
            } finally {
                this.isLoadingSchedule = false;
            }
        },
        onDateChange() {
            // Refetch schedules when date changes
            console.log('Date changed to:', this.form.appointment_date);
            this.fetchSchedules(this.form.appointment_date);
        },
        onBusTimeOptionChange() {
            // Clear manual bus time when switching away from MANUAL
            if (this.busTimeOption !== 'MANUAL') {
                this.form.bus_time_manual = '';
            }
        },
        close() {
            this.$emit('close');
        },
        async save() {
            if (!this.appointment?.id) {
                console.error('No appointment ID found');
                return;
            }

            // Handle bus time based on selected option
            let busTimeToSave = null;

            if (this.busTimeOption === 'AUTO') {
                // Use automatic calculation (send null)
                busTimeToSave = null;
            } else if (this.busTimeOption === 'TAXI') {
                // No bus time (taxi user)
                busTimeToSave = null;
            } else if (this.busTimeOption === 'MANUAL') {
                // Use manually selected time
                if (!this.form.bus_time_manual) {
                    this.$emit('error', { message: 'Vælg venligst en afgangstid' });
                    return;
                }
                busTimeToSave = this.form.bus_time_manual;
            }

            this.isSaving = true;
            try {
                // Only send fields that the serializer accepts for writing
                // Don't send patient_name, patient_last_name, patient_room as they're read-only
                const dataToSave = {
                    appointment_date: this.form.appointment_date,
                    appointment_time: this.form.appointment_time,
                    bus_time_manual: busTimeToSave,
                    description: this.form.description,
                    translator: this.form.translator,
                    trolley: this.form.trolley,
                    wheelchair: this.form.wheelchair,
                    companion: this.form.companion
                };

                console.log('Saving appointment:', dataToSave);
                const response = await api.patch(`appointments/${this.appointment.id}/`, dataToSave);
                console.log('Save response:', response.data);
                this.$emit('saved', response.data);
                this.close();
            } catch (error) {
                console.error('Error updating appointment:', error);
                console.error('Error response:', error.response?.data);
                console.error('Error status:', error.response?.status);
                this.$emit('error', error);
            } finally {
                this.isSaving = false;
            }
        },
        formatTime(t) {
            if (!t) return '';
            // Handle both "HH:MM:SS" and "HH:MM" formats
            return t.slice(0, 5);
        }
    }
};
</script>

<style scoped>
.modal-card {
    width: 90%;
    max-width: 800px;
}

.modal-card-body {
    max-height: 70vh;
    overflow-y: auto;
}

.checkbox {
    margin-right: 1rem;
}
</style>
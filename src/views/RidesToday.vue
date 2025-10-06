<template>
    <div class="rides-today-container container is-fluid">
        <h3 class="title is-1">{{ $t("rides.heading") }}</h3>
        <div v-if="!isMobile">
            <table v-if="paginatedBusGroups.length > 0" class="table is-fullwidth">
                <thead>
                    <tr>
                        <th class="is-size-2-desktop is-size-4-tablet is-size-5-mobile">{{
                            $t("rides.bustime") }}</th>
                        <th class="is-size-2-desktop is-size-4-tablet is-size-5-mobile">{{ $t("rides.name") }}</th>
                        <th class="is-size-2-desktop is-size-4-tablet is-size-5-mobile">{{ $t("rides.room") }}</th>
                        <th class="has-text-left is-size-2-desktop is-size-4-tablet is-size-5-mobile">{{
                            $t("rides.hospital") }}</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-for="busGroup in paginatedBusGroups" :key="busGroup.departure_time">
                        <tr v-if="busGroup.patients && busGroup.patients.length > 0">
                            <td class="is-size-4" :rowspan="busGroup.patients.length">
                                {{ formatTime(busGroup.departure_time) }}
                            </td>
                            <td class="is-size-4">{{ busGroup.patients[0].name }}</td>
                            <td class="is-size-4">{{ busGroup.patients[0].room }}</td>
                            <td class="is-size-4">{{ busGroup.patients[0].hospital_name }}</td>
                        </tr>
                        <tr v-for="patient in busGroup.patients.slice(1)" :key="patient.id">
                            <td class="is-size-4">{{ patient.name }}</td>
                            <td class="is-size-4">{{ patient.room }}</td>
                            <td class="is-size-4">{{ patient.hospital_name }}</td>
                        </tr>
                    </template>
                </tbody>

            </table>
            <p v-else class="is-size-2 is-size-4-mobile">
                {{ $t("rides.noRides") }}
            </p>
        </div>


        <!-- Mobile/list view -->
        <div v-else>
            <div v-for="busGroup in paginatedBusGroups" :key="busGroup.departure_time" class="mb-5">
                <h4 class="is-size-4 has-text-weight-bold mb-2">
                    {{ formatTime(busGroup.departure_time) }}
                </h4>
                <div v-for="patient in busGroup.patients" :key="patient.id" class="py-2 px-3 has-background-light mb-1"
                    style="border-radius: 6px;">
                    <p class="is-size-5"><strong>{{ patient.name }}</strong> - <span class="is-size-6 has-text-grey">{{
                        patient.room
                            }}</span>
                    </p>
                </div>
            </div>
        </div>


        <!-- Pagination Controls -->
        <nav class="pagination is-small" role="navigation" aria-label="pagination">
            <button class="pagination-previous" @click="prevPage" :disabled="currentPage === 1">
                {{ $t("pagination.previous") }}
            </button>
            <button class="pagination-next" @click="nextPage" :disabled="currentPage === totalPages">
                {{ $t("pagination.next") }}
            </button>
            <ul class="pagination-list">
                <li v-for="page in totalPages" :key="page">
                    <button class="pagination-link" @click="setPage(page)"
                        :class="{ 'is-current': currentPage === page }">
                        {{ page }}
                    </button>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script>
import api from '@/api';

export default {
    data() {
        return {
            busGroups: [], // ✅ Renamed from 'rides'
            currentPage: 1,
            rowsPerPage: 9,
            autoFlipInterval: null,
            flipIntervalTime: 30000,
            isMobile: window.innerWidth <= 768
        };
    },
    computed: {
        paginatedBusGroups() {
            if (this.busGroups && this.busGroups.length > 0) {
                const start = (this.currentPage - 1) * this.rowsPerPage;
                const end = start + this.rowsPerPage;
                return this.busGroups.slice(start, end);
            }
            return []; // Return empty array if busGroups is undefined or empty
        },
        totalPages() {
            return this.busGroups && this.busGroups.length > 0
                ? Math.ceil(this.busGroups.length / this.rowsPerPage)
                : 1;
        }
    },
    mounted() {
        this.fetchRides();
        this.startAutoFlip();
        window.addEventListener('resize', this.checkMobile);
    },
    beforeUnmount() {
        this.clearAutoFlip(); // Clear the interval when the component is unmounted
        window.removeEventListener('resize', this.checkMobile);
    },
    methods: {
        checkMobile() {
            this.isMobile = window.innerWidth <= 768;
        },

        async fetchRides() {
            try {
                const { data: appts } = await api.get('appointments/rides-today/');

                // helper: "HH:MM:SS" -> "HH:MM"
                const hhmm = (s) => (s ? s.slice(0, 5) : 'Ukendt');

                // Group by effective bus time (manual or computed)
                const grouped = {};
                appts.forEach(a => {
                    const key = hhmm(a.bus_time_effective); // ← new field
                    (grouped[key] ||= []).push({
                        id: a.id,
                        name: a.patient_name ?? '',   // ← from serializer
                        room: a.patient_room ?? '',   // ← from serializer (add this field if you haven't)
                        hospital_name: a.hospital_name || '',
                        // Keep anything else you want to render later:
                        appointment_time: a.appointment_time, // "HH:MM:SS"
                        hospital: a.hospital,                 // id
                        accommodation: a.accommodation,       // id or null
                    });
                });

                // Convert to array and sort time buckets; put "Ukendt" last
                this.busGroups = Object.entries(grouped)
                    .map(([departure_time, patients]) => ({ departure_time, patients }))
                    .sort((a, b) => {
                        if (a.departure_time === 'Ukendt') return 1;
                        if (b.departure_time === 'Ukendt') return -1;
                        return a.departure_time.localeCompare(b.departure_time);
                    });

            } catch (error) {
                console.error("❌ Error fetching rides:", error);
            }
        },

        formatTime(time) {
            return time ? time.substring(0, 5) : '';
        },

        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
            } else {
                this.currentPage = 1;
            }
            this.resetAutoFlip();
        },

        setPage(page) {
            this.currentPage = page;
            this.resetAutoFlip();
        },

        startAutoFlip() {
            this.autoFlipInterval = setInterval(() => {
                this.nextPage();
            }, this.flipIntervalTime);
        },

        clearAutoFlip() {
            if (this.autoFlipInterval) clearInterval(this.autoFlipInterval);
        },

        resetAutoFlip() {
            this.clearAutoFlip();
            this.startAutoFlip();
        }
    }

};
</script>

<style scoped>
.rides-today-container {
    padding: 20px;
}

.table {
    margin-top: 20px;
    font-size: 1.5rem;
}

.pagination {
    margin-top: 20px;
}

.table th {
    text-align: left;
}
</style>

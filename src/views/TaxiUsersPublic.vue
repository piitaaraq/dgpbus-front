<template>
    <div class="taxi-users-container container is-fluid">
        <h2 class="title is-1">{{ $t("taxi.headingPublic") }}</h2>

        <!-- Table for today's appointments -->
        <table v-if="paginatedPatients.length > 0" class="table is-fullwidth is-striped">
            <thead>
                <tr>
                    <th class="is-size-2"> {{ $t("taxi.name") }}</th>
                    <th class="is-size-2"> {{ $t("taxi.accommodation") }}</th>
                    <th class="is-size-2"> {{ $t("taxi.appTime") }}</th>
                    <th class="is-size-2"> {{ $t("taxi.hospital") }}</th>
                    <th class="is-size-2"> {{ $t("taxi.department") }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="patient in paginatedPatients" :key="patient.id" :class="{ 'has-taxi': patient.has_taxi }">
                    <td class="is-size-4">{{ patient.name }}</td>
                    <td class="is-size-4">{{ patient.accommodation.name }} </td>
                    <td class="is-size-4">{{ formatTime(patient.appointment_time) }}</td>
                    <td class="is-size-4">{{ patient.hospital_name }}</td>
                    <td class="is-size-4">{{ patient.department }}</td>
                </tr>
            </tbody>
        </table>

        <p v-else class="is-size-4">{{ $t("taxi.noRides") }}</p>

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
            patients: [], // All patients
            currentPage: 1,
            rowsPerPage: 10,
            autoFlipInterval: null,
            flipIntervalTime: 30000
        };
    },
    computed: {
        todaysPatients() {
            if (!this.patients || !Array.isArray(this.patients)) return [];
            const today = new Date().toISOString().slice(0, 10);
            return this.patients.filter(patient => patient.appointment_date === today);
        },
        paginatedPatients() {
            if (!this.todaysPatients.length) return [];
            const start = (this.currentPage - 1) * this.rowsPerPage;
            const end = start + this.rowsPerPage;
            return this.todaysPatients.slice(start, end);
        },
        totalPages() {
            if (!this.todaysPatients.length) return 1;
            return Math.ceil(this.todaysPatients.length / this.rowsPerPage);
        }
    },
    mounted() {
        this.fetchPatients();
        this.startAutoFlip();
    },
    beforeUnmount() {
        this.clearAutoFlip();
    },
    methods: {
        async fetchPatients() {
            try {
                const response = await api.get('patients/public-taxi-users/');
                this.patients = response.data;
            } catch (error) {
                console.error('Error fetching patients:', error);
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
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
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
            if (this.autoFlipInterval) {
                clearInterval(this.autoFlipInterval);
            }
        },
        resetAutoFlip() {
            this.clearAutoFlip();
            this.startAutoFlip();
        }
    }
};
</script>

<style scoped>
.taxi-users-container {
    padding: 20px;
}

.table {
    margin-top: 20px;
}

.has-taxi {
    background-color: lightgray;
}

.pagination {
    margin-top: 20px;
}
</style>

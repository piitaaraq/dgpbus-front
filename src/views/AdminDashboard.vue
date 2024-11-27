<template>
    <div class="admin-dashboard container">
        <h1 class="title is-3 is-size-4-mobile">Personaleadgang</h1>

        <div class="dashboard-cards">
            <div class="columns is-multiline">
                <div class="column is-one-third">
                    <div class="card is-info" @click="goToTodayRides">
                        <div class="card-content">
                            <p class="title is-5">Dagens kørsler</p>
                            <p>Patienter der skal til Rigshospitalet, Bispebjerg Hospital eller Gentofte Hospital med
                                bussen i dag</p>
                        </div>
                    </div>
                </div>

                <div class="column is-one-third">
                    <div class="card is-info" @click="goToRidesLong">
                        <div class="card-content">
                            <p class="title is-5">Alle aftaler</p>
                            <p>Vis alle lægeaftaler; uanset om patienten skal med bus eller taxa</p>
                        </div>
                    </div>
                </div>

                <div class="column is-one-third">
                    <div class="card is-primary" @click="goToBusSchedules">
                        <div class="card-content">
                            <p class="title is-5">Køreplaner for bussen</p>
                            <p>Vis køreplaner fra patienthjemmet og Rigshospitalet</p>
                        </div>
                    </div>
                </div>

                <div class="column is-one-third">
                    <div class="card" @click="goToTaxiUsers">
                        <div class="card-content">
                            <p class="title is-5">Patienter med behov for en taxa</p>
                            <p>Vis de patienter der har behov for en taxa fra Patienthjemmet eller hotellerne</p>
                        </div>
                    </div>
                </div>

                <div class="column is-one-third">
                    <div class="card" @click="goToDriverView">
                        <div class="card-content">
                            <p class="title is-5">For buschaufføren</p>
                            <p>Vis og bekræft passagerer</p>
                        </div>
                    </div>
                </div>

                <div class="column is-one-third">
                    <div class="card" @click="goTranslatorView">
                        <div class="card-content">
                            <p class="title is-5">For tolke</p>
                            <p>Vis patienter der har brug for tolk</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
export default {
    methods: {
        goToTodayRides() {
            this.$router.push({ name: 'RidesToday' });
        },
        goToRidesLong() {
            this.$router.push({ name: 'AllAppointments' });
        },
        goToBusSchedules() {
            this.$router.push({ name: 'BusSchedule' });
        },
        goToTaxiUsers() {
            this.$router.push({ name: 'TaxiUsers' });
        },
        goTranslatorView() {
            this.$router.push({ name: 'TranslatorView' });
        },
        goToRegisteredRides() {
            this.$router.push({ name: 'RegisteredRides' });
        },
        goToDriverView() {
            this.$router.push({ name: 'DriverView' });
        }
    }
};
</script>

<style scoped>
.admin-dashboard {
    padding: 20px;
}

.dashboard-cards {
    gap: 20px;
}

.card {
    flex: 1;
    min-width: 250px;
    height: 170px;
    cursor: pointer;
    background-color: #f4f4f4;
    border-radius: 8px;
    transition: background-color 0.2s;
}

.card:hover {
    background-color: #e0e0e0;
}

.card-content {
    padding: 20px;
}
</style>

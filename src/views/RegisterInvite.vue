<template>
    <div class="container">
        <h1 class="title is-4">Opret adgangskode</h1>

        <form v-if="tokenValid" @submit.prevent="submitPassword">
            <div class="field">
                <label class="label">Ny adgangskode</label>
                <div class="control">
                    <input type="password" v-model="password" class="input" required minlength="8" />
                </div>
            </div>

            <div class="field">
                <label class="label">Bekræft adgangskode</label>
                <div class="control">
                    <input type="password" v-model="confirmPassword" class="input" required minlength="8" />
                </div>
            </div>

            <div class="field">
                <button class="button is-primary" type="submit" :disabled="loading">
                    Opret konto
                </button>
            </div>

            <p v-if="successMessage" class="has-text-success">{{ successMessage }}</p>
            <p v-if="errorMessage" class="has-text-danger">{{ errorMessage }}</p>
        </form>

        <p v-else class="has-text-danger">{{ errorMessage }}</p>
    </div>
</template>

<script>
import axios from 'axios';
const apiUrl = process.env.VUE_APP_BACKEND_URL;

export default {
    data() {
        return {
            password: '',
            confirmPassword: '',
            loading: false,
            successMessage: '',
            errorMessage: '',
            tokenValid: true,
        };
    },
    computed: {
        signed() {
            return this.$route.query.signed;
        }
    },
    created() {
        if (!this.signed) {
            this.tokenValid = false;
            this.errorMessage = 'Invitationslink mangler eller er ugyldigt.';
        }
    },
    methods: {
        async submitPassword() {
            this.loading = true;
            this.successMessage = '';
            this.errorMessage = '';

            if (this.password !== this.confirmPassword) {
                this.errorMessage = 'Adgangskoderne matcher ikke.';
                this.loading = false;
                return;
            }

            try {
                await axios.post(`${apiUrl}/api/siteuser/invite/confirm/`, {
                    signed: this.signed,
                    password: this.password
                });

                this.successMessage = 'Din konto er nu oprettet.';
            } catch (error) {
                console.error(error);
                if (error.response?.data?.non_field_errors) {
                    this.errorMessage = error.response.data.non_field_errors[0];
                } else {
                    this.errorMessage = 'Kunne ikke oprette konto. Linket kan være udløbet.';
                }
            } finally {
                this.loading = false;
            }
        }
    }
};
</script>

<style scoped>
.container {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
}
</style>

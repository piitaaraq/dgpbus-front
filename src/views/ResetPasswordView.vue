<template>
    <div class="container">
        <h1 class="title is-4">Nulstil din adgangskode</h1>
        <form v-if="tokenValid" @submit.prevent="submitNewPassword">
            <div class="field">
                <label class="label">Ny adgangskode</label>
                <div class="control">
                    <input type="password" v-model="newPassword" class="input" required minlength="8" />
                </div>
            </div>

            <div class="field">
                <button class="button is-primary" type="submit" :disabled="loading">
                    Gem ny adgangskode
                </button>
            </div>

            <p v-if="successMessage" class="has-text-success">{{ successMessage }}</p>
            <p v-if="errorMessage" class="has-text-danger">{{ errorMessage }}</p>
        </form>
        <p v-else class="has-text-danger">{{ errorMessage }}</p>
    </div>
</template>

<script>
import api from '@/api';

export default {
    data() {
        return {
            newPassword: '',
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
    methods: {
        async submitNewPassword() {
            this.loading = true;
            this.successMessage = '';
            this.errorMessage = '';

            try {
                await api.post('siteusers/password-reset-confirm/', {
                    signed: this.signed,
                    new_password: this.newPassword,
                });

                this.successMessage = 'Din adgangskode er blevet opdateret.';
            } catch (error) {
                console.error(error);
                this.errorMessage = 'Kunne ikke nulstille adgangskoden. Linket kan være udløbet.';
            } finally {
                this.loading = false;
            }
        }
    }
};
</script>

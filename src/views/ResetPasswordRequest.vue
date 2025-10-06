<template>
    <div class="container">
        <div class="columns">
            <div class="column is-half">
                <h1 class="title is-4">Nulstil adgangskode</h1>
                <form @submit.prevent="requestReset">
                    <div class="field">
                        <label class="label">Indtast din e-mail adresse</label>
                        <div class="control">
                            <input type="email" v-model="email" class="input" required />
                        </div>
                    </div>
                    <div class="field">
                        <button class="button is-primary" type="submit" :disabled="loading">
                            Send nulstillingslink
                        </button>
                    </div>
                    <p v-if="successMessage" class="has-text-success">{{ successMessage }}</p>
                    <p v-if="errorMessage" class="has-text-danger">{{ errorMessage }}</p>
                </form>

            </div>
        </div>
    </div>
</template>

<script>
import api from '@/api';

export default {
    data() {
        return {
            email: '',
            successMessage: '',
            errorMessage: '',
            loading: false,
        };
    },
    methods: {
        async requestReset() {
            this.loading = true;
            this.successMessage = '';
            this.errorMessage = '';

            try {
                await api.post('siteusers/password-reset-request/', { email: this.email });
                this.successMessage = 'Hvis din e-mail findes, er der sendt et nulstillingslink.';
            } catch (error) {
                this.errorMessage = 'Der opstod en fejl. Prøv igen.';
                console.error(error);
            } finally {
                this.loading = false;
            }
        }
    }
};
</script>

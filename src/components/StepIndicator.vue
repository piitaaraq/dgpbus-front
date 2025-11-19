<template>
    <nav class="steps-nav">
        <ul class="steps">
            <li v-for="step in steps" :key="step.number" class="step-item" :class="{
                'is-active': currentStep === step.number,
                'is-completed': currentStep > step.number
            }">
                <div class="step-marker">
                    <span v-if="currentStep > step.number" class="icon">
                        <i class="fas fa-check"></i>
                    </span>
                    <span v-else>{{ step.number }}</span>
                </div>
                <div class="step-label">
                    {{ $t(step.label) }}
                </div>
            </li>
        </ul>
    </nav>
</template>

<script>
export default {
    props: {
        currentStep: {
            type: Number,
            required: true,
        },
        steps: {
            type: Array,
            required: true,
        },
    },
};
</script>

<style scoped>
.steps-nav {
    margin-bottom: 2rem;
}

.steps {
    display: flex;
    justify-content: space-between;
    list-style: none;
    padding: 0;
    margin: 0;
    position: relative;
}

.steps::before {
    content: '';
    position: absolute;
    top: 20px;
    left: 0;
    right: 0;
    height: 2px;
    background: #dbdbdb;
    z-index: 0;
}

.step-item {
    flex: 1;
    text-align: center;
    position: relative;
    z-index: 1;
}

.step-marker {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #dbdbdb;
    color: #7a7a7a;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    margin: 0 auto 0.5rem;
    transition: all 0.3s ease;
}

.step-item.is-active .step-marker {
    background: #3273dc;
    color: white;
    transform: scale(1.1);
}

.step-item.is-completed .step-marker {
    background: #48c774;
    color: white;
}

.step-label {
    font-size: 0.875rem;
    color: #4a4a4a;
    font-weight: 500;
    margin-top: 0.5rem;
}

.step-item.is-active .step-label {
    color: #3273dc;
    font-weight: 600;
}

.step-item.is-completed .step-label {
    color: #48c774;
}

@media screen and (max-width: 768px) {
    .step-label {
        font-size: 0.75rem;
    }

    .step-marker {
        width: 32px;
        height: 32px;
        font-size: 0.875rem;
    }

    .steps::before {
        top: 16px;
    }
}
</style>
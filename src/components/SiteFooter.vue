<template>
    <div class="page-wrapper">
        <footer class="footer">
            <div class="container">
                <div class="columns">
                    <!-- First Column: Company Info -->
                    <div class="column">
                        <p class="is-size-7">
                            <strong>Patientkørsel</strong> by <strong>Det grønlandske Patienthjem</strong>.
                        </p>
                        <p class="is-size-7">
                            Address: Omøgade 3, 2100 København Ø <br />
                            Phone: +45 3826 4600 <br />
                            Email: <a :href="'mailto:dgpshv@peqqik.gl'">dgpshv@peqqik.gl</a>
                        </p>
                    </div>
                    <!-- Second Column: Links -->
                    <div class="column">
                        <p class="is-size-7">
                            <a @click="goToPrivacy">Privacy Policy</a> |
                            <a @click="goToAbout">About</a> |
                            License: <a href="https://opensource.org/licenses/MIT">MIT</a> <br>
                            <font-awesome-icon :icon="['fas', 'copyright']" /> {{ startYear }}{{ startYear !==
                                currentYear ?
                                ' - ' + currentYear : '' }} Det grønlandske Patienthjem
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    </div>
</template>

<style scoped>
.page-wrapper {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.footer {
    margin-top: auto;
    padding: 20px;
    background-color: #ECF0F1;
    border-top: 1px solid #ddd;
}

.footer a {
    color: #3273dc;
    text-decoration: none;
}

.footer a:hover {
    text-decoration: underline;
}
</style>
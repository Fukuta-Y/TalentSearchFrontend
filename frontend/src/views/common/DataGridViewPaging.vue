<template>
    <div v-if="totalPages > 1" class="pagination-container">
        <div v-if="totalPages > 1" class="pagination-container">
        <a @click="changePage(1)" :disabled="currentPage === 1" class="pagination-link">最初</a>
        <a v-for="pageNumber in totalPageLinks" :key="pageNumber"
            @click="pageNumber !== '...' ? changePage(pageNumber) : null" class="pagination-link">
            <span v-if="pageNumber !== '...'">
                <span class="underlined">{{ pageNumber }}</span>
            </span>
            <span v-else>...</span>
        </a>
        <a @click="changePage(totalPages)" :disabled="currentPage === totalPages" class="pagination-link">最後</a>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        currentPage: {
            type: Number,
            required: true,
        },
        totalPages: {
            type: Number,
            required: true,
        },
        totalPageLinks: {
            type: Array,
            required: true,
        },
        changePage: {
            type: Function,
            required: true,
        },
    },
};
</script>
<style scoped>
</style>

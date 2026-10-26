<script setup>
import { computed } from 'vue'

const props = defineProps({
    pagination: {
        type: Object,
        required: true,
        default: () => ({
            total: 0,
            page: 1,
            limit: 20,
            totalPage: 0,
        }),
    },
    isLoading: {
        type: Boolean,
        default: false,
    },
})

const emit = defineEmits(['change-page'])

const currentPage = computed(() => props.pagination?.page || 1)
const totalPages = computed(() => props.pagination?.totalPage || 1)
const totalItems = computed(() => props.pagination?.total || 0)

const goToPage = (newPage) => {
    const page = newPage && typeof newPage !== 'number' ? Number(newPage) : newPage

    console.log('page: ', page)
    console.log('newPage: ', newPage)
    if (page < 1 || page > totalPages.value || page === currentPage.value || props.isLoading) {
        return
    }
    emit('change-page', page)
}

const visiblePages = computed(() => {
    const total = totalPages.value

    const current = currentPage.value

    if (total <= 7) {
        return Array.from({ length: total }, (_, i) => i + 1)
    }

    const pages = []

    pages.push(1)

    if (current > 3) {
        pages.push('...')
    }

    const start = Math.max(2, current - 1)

    const end = Math.min(total - 1, current + 1)

    for (let i = start; i <= end; i++) {
        pages.push(i)
    }

    if (current < total - 2) {
        pages.push('...')
    }

    pages.push(total)

    return pages
})
</script>

<template>
    <div
        v-if="totalPages > 0"
        class="flex flex-col-reverse sm:flex-row items-center justify-between gap-fluid-gap p-fluid-p bg-card-bg border-t border-custom-border text-fluid-xs">

        <!-- تفاصيل عدد البيانات والصفحات -->
        <div class="text-sub font-medium">
            Showing page
            <span class="font-semibold text-title">{{ currentPage }}</span>
            of
            <span class="font-semibold text-title">{{ totalPages }}</span>
            (total
            <span class="font-semibold text-accent">{{ totalItems }}</span>
            items)
        </div>

        <!-- أزرار التنقل -->
        <div class="flex items-center gap-2">
            <!-- زر السابق -->
            <button
                type="button"
                @click="goToPage(currentPage - 1)"
                :disabled="currentPage === 1 || isLoading"
                class="px-2.5 py-1.5 rounded-lg border border-custom-border font-semibold text-sub hover:bg-background disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer">
                Previous
            </button>

            <!-- أرقام الصفحات والنقاط -->
            <template v-for="(p, index) in visiblePages">
                <span
                    v-if="p === '...'"
                    :key="`dots-${index}`"
                    class="px-1.5 text-sub select-none font-semibold">

                    ...
                </span>
                <button
                    v-else
                    :key="p"
                    type="button"
                    @click="goToPage(p)"
                    :disabled="isLoading"
                    :class="[
                        'px-2.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer',
                        currentPage === p
                            ? 'bg-accent text-white shadow-sm shadow-accent/20'
                            : 'border border-custom-border text-sub hover:bg-background',
                    ]">

                    {{ p }}
                </button>
            </template>

            <!-- زر التالي -->
            <button
                type="button"
                @click="goToPage(currentPage + 1)"
                :disabled="currentPage === totalPages || isLoading"
                class="px-2.5 py-1.5 rounded-lg border border-custom-border font-semibold text-sub hover:bg-background disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer">
                Next
            </button>
        </div>
    </div>
</template>

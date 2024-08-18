<script setup lang="ts">
import IconChevron from '@/assets/IconChevron.vue';
import { daysOfWeek, months } from '@/utils/calendar';
import MainButton from './MainButton.vue';
import CalendarDay from './CalendarDay.vue';
import { reactive, ref, watchEffect } from 'vue';
import { type User } from '@/api';
import type { ComponentExposed } from 'vue-component-type-helpers';
import ModalWrapper from './ModalWrapper.vue';
import DayModal from './modals/DayModal.vue';
import { useCalendarStore } from '@/stores/calendar';

const calendarStore = useCalendarStore();

const birthdays = reactive<{ days: Map<number, User[]> }>({
    days: new Map(),
});

const selectedDate = reactive<{
    users: User[];
    day: number;
    month: number;
}>({
    users: [],
    day: -1,
    month: -1,
});

watchEffect(async () => {
    if (!calendarStore.usersData.data) return;

    const users = calendarStore.usersData.data;

    birthdays.days = new Map();
    for (const user of users) {
        const { birthday } = user;
        if (!birthday) continue;

        const day = parseInt(birthday.split('.')[0]);
        if (Number.isNaN(day)) continue;

        const bdUsers = birthdays.days.get(day);

        if (bdUsers) {
            bdUsers.push(user);
        } else {
            birthdays.days.set(day, [user]);
        }
    }
});

const modalRef = ref<ComponentExposed<typeof ModalWrapper> | null>(null);
function onClick(day: number) {
    const users = birthdays.days.get(day);
    if (!users) return;

    selectedDate.users = users;
    selectedDate.day = day;
    selectedDate.month = calendarStore.currentDate.getUTCMonth();
    modalRef.value?.show();
}
</script>

<template>
    <ModalWrapper ref="modalRef">
        <DayModal v-if="modalRef" :close="modalRef.hide" :selected-date="selectedDate" />
    </ModalWrapper>

    <article
        class="flex h-[472px] flex-col items-center gap-5 self-center bg-indigo-900 p-5 text-gray-50"
    >
        <section class="flex w-[100%] items-center justify-around">
            <MainButton @click="calendarStore.incementMonth(-1)">
                <IconChevron class="rotate-180" />
            </MainButton>
            <h2 class="w-[10ch] text-center text-slate-50">
                {{ months[calendarStore.currentDate.getMonth()] }}
            </h2>
            <MainButton @click="calendarStore.incementMonth(1)">
                <IconChevron />
            </MainButton>
        </section>

        <section class="grid w-[100%] grid-cols-7">
            <span class="w-14 text-center" :key="day" v-for="day in daysOfWeek">{{ day }}</span>
        </section>

        <section class="grid w-[100%] grid-cols-7">
            <CalendarDay
                @click="onClick(day)"
                :has-birthday="
                    calendarStore.usersData.isSuccess &&
                    calendarStore.calendarState.arrayOfMonths[index] === 0 &&
                    birthdays.days.has(day)
                "
                :is-current-month="calendarStore.calendarState.arrayOfMonths[index] === 0"
                :key="index"
                v-for="(day, index) in calendarStore.calendarState.arrayOfDays"
            >
                {{ day }}
            </CalendarDay>
        </section>
    </article>
</template>

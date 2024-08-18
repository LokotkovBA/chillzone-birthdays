import { ref, reactive } from 'vue';
import { defineStore } from 'pinia';
import { getCalendarDates } from '@/utils/calendar';
import { useQuery, useQueryClient } from '@tanstack/vue-query';
import { getUsersByMonth } from '@/api';

export const useCalendarStore = defineStore('calendar', () => {
    const currentDate = ref(new Date());
    const calendarState = reactive(getCalendarDates(currentDate.value));

    const queryClient = useQueryClient();

    const usersData = useQuery({
        queryKey: ['getUsersByMonth', currentDate],
        queryFn: () => getUsersByMonth(currentDate.value.getUTCMonth()),
    });

    function $reset() {
        currentDate.value = new Date();
        incementMonth(0);
    }

    function invalidateCurrent() {
        queryClient.invalidateQueries({ queryKey: ['getUsersByMonth', currentDate] });
    }

    function incementMonth(value: number) {
        currentDate.value.setUTCDate(1);
        currentDate.value.setUTCMonth(currentDate.value.getUTCMonth() + value);
        currentDate.value = new Date(currentDate.value);

        const { arrayOfDays, arrayOfMonths, todayIndex, userSelectedDay } = getCalendarDates(
            currentDate.value,
        );
        calendarState.arrayOfDays = arrayOfDays;
        calendarState.arrayOfMonths = arrayOfMonths;
        calendarState.todayIndex = todayIndex;
        calendarState.userSelectedDay = userSelectedDay;
    }

    return {
        invalidateCurrent,
        usersData,
        calendarState,
        currentDate,
        incementMonth,
        $reset,
    };
});

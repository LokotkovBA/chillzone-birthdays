<script setup lang="ts">
import { addUser } from '@/api';
import FormField from '@/components/FormField.vue';
import MainButton from '@/components/MainButton.vue';
import { monthShort } from '@/utils/calendar';
import { reactive, watchEffect } from 'vue';
import LoadingSpinner from '../LoadingSpinner.vue';
import { useUser } from 'vue-clerk';
import { useCalendarStore } from '@/stores/calendar';

const props = defineProps<{ close: () => void }>();

const calendarStore = useCalendarStore();

const user = useUser();

const formData = reactive({
    name: '',
    nickname: '',
    discord: '',
    dateDay: '',
    dateMonth: '',
    isLoading: false,
});

watchEffect(() => {
    if (user.isSignedIn && user.user.value?.username) {
        formData.discord = user.user.value.username;
    }
});

async function onSubmit() {
    const month = parseInt(formData.dateMonth) - 1;
    if (
        Number.isNaN(month) ||
        month < 0 ||
        month > 11 ||
        Number.isNaN(new Date(`2000-${formData.dateMonth}-${formData.dateDay}`).valueOf())
    ) {
        return;
    }

    const newUser = {
        name: formData.name.trim(),
        nickname: formData.nickname.trim(),
        discord: formData.discord.trim(),
        birthday: `${formData.dateDay}.${monthShort[month]}`,
    };

    formData.isLoading = true;
    await addUser(newUser);
    formData.isLoading = false;
    props.close();

    if (month === calendarStore.currentDate.getUTCMonth()) {
        calendarStore.invalidateCurrent();
    }
}
</script>

<template>
    <form @submit.prevent="onSubmit" class="grid w-[500px] grid-cols-2 gap-5 bg-zinc-900 p-10">
        <FormField v-model="formData.name" type="text" id="name">Имя</FormField>
        <FormField v-model="formData.nickname" type="text" id="name"> Имя персонажа </FormField>
        <FormField v-model="formData.discord" required type="text" id="nick">
            Ник в дискорде
        </FormField>
        <FormField v-model="formData.dateDay" required type="number" id="date-day">
            День др
        </FormField>
        <FormField v-model="formData.dateMonth" required type="number" id="date-month">
            Месяц др
        </FormField>
        <MainButton :disabled="formData.isLoading" class="col-span-2 text-xl" type="submit">
            <LoadingSpinner v-if="formData.isLoading" />
            <span v-else> Добавить </span>
        </MainButton>
    </form>
</template>

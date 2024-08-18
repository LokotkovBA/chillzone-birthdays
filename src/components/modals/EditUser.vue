<script setup lang="ts">
import { editUser, type User } from '@/api';
import { onMounted, reactive } from 'vue';
import FormField from '../FormField.vue';
import MainButton from '../MainButton.vue';
import LoadingSpinner from '../LoadingSpinner.vue';
import { monthShort } from '@/utils/calendar';
import { useCalendarStore } from '@/stores/calendar';

const props = defineProps<{ user?: User; day: number; month: number; close: () => void }>();

const { invalidateCurrent } = useCalendarStore();

const formData = reactive({
    name: '',
    nickname: '',
    discord: '',
    dateDay: '',
    dateMonth: '',
    isLoading: false,
});

onMounted(() => {
    formData.name = props.user?.name ?? '';
    formData.nickname = props.user?.nickname ?? '';
    formData.discord = props.user?.discord ?? '';
    formData.dateDay = props.day.toString();
    formData.dateMonth = (props.month + 1).toString();
});

async function onSubmit() {
    const month = parseInt(formData.dateMonth);
    const id = props.user?.id;
    if (
        !id ||
        Number.isNaN(month) ||
        month < 1 ||
        month > 12 ||
        Number.isNaN(new Date(`2000-${formData.dateMonth}-${formData.dateDay}`).valueOf())
    ) {
        return;
    }

    const editedUser = {
        id,
        name: formData.name.trim(),
        nickname: formData.nickname.trim(),
        discord: formData.discord.trim(),
        birthday: `${formData.dateDay}.${monthShort[month - 1]}`,
    };

    formData.isLoading = true;
    await editUser(editedUser);
    formData.isLoading = false;
    props.close();
    invalidateCurrent();
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
            <span v-else>Редактировать</span>
        </MainButton>
    </form>
</template>

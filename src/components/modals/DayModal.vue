<script setup lang="ts">
import { deleteUser, type User } from '@/api';
import { monthsForDate } from '@/utils/calendar';
import MainButton from '../MainButton.vue';
import ModalWrapper from '../ModalWrapper.vue';
import EditUser from './EditUser.vue';
import { ref } from 'vue';
import { refModal } from '@/utils/helpers';
import { useMutation } from '@tanstack/vue-query';
import LoadingSpinner from '../LoadingSpinner.vue';
import { useCalendarStore } from '@/stores/calendar';

const { invalidateCurrent } = useCalendarStore();

const props = defineProps<{
    selectedDate: { users: User[]; day: number; month: number };
    close: () => void;
}>();

const deleteIsPending = ref<number[]>([]);

const { mutate } = useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onMutate(id) {
        console.log('mut', id);
        deleteIsPending.value.push(id);
    },
    onSuccess(_, id) {
        console.log('suc', id);
        deleteIsPending.value = deleteIsPending.value.filter((item) => item === id);
        props.close();
        invalidateCurrent();
    },
});

const modalRef = refModal(null);

const user = ref<User>();

function onClickEdit(curUser: User) {
    user.value = curUser;
    modalRef.value?.show();
}
</script>

<template>
    <div class="flex h-fit flex-col gap-5 rounded-xl bg-violet-800 p-10">
        <h2 class="self-center text-3xl">
            {{ props.selectedDate.day }} {{ monthsForDate[props.selectedDate.month] }}
        </h2>

        <h3 v-if="props.selectedDate.users.length > 1">
            В этот день родились эти замечательные люди:
        </h3>
        <h3 v-else>В этот день родился этот замечательный человек:</h3>
        <article
            class="flex flex-col gap-2"
            :key="user.id"
            v-for="user in props.selectedDate.users"
        >
            <p>{{ user.name }}</p>
            <p>{{ user.nickname }}</p>
            <p>{{ user.discord }}</p>
            <MainButton
                :disabled="deleteIsPending.includes(user.id)"
                v-if="user.id"
                class="mt-5"
                @click="mutate(user.id)"
            >
                <LoadingSpinner v-if="deleteIsPending.includes(user.id)" />
                <span v-else> Удалить </span>
            </MainButton>
            <MainButton @click="onClickEdit(user)">Редактировать</MainButton>
        </article>
    </div>
    <ModalWrapper ref="modalRef" layer="1">
        <EditUser
            v-if="modalRef"
            :close="modalRef.hide"
            :day="props.selectedDate.day"
            :month="props.selectedDate.month"
            :user="user"
        />
    </ModalWrapper>
</template>

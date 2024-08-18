<script setup lang="ts">
import CalendarBlock from '@/components/CalendarBlock.vue';
import MainButton from '@/components/MainButton.vue';
import AddUser from '@/components/modals/AddUser.vue';
import ModalWrapper from '@/components/ModalWrapper.vue';
import { refModal } from '@/utils/helpers';

const modalRef = refModal(null);

function showModal() {
    modalRef.value?.show();
}
</script>

<template>
    <CalendarBlock />
    <MainButton @click="showModal" class="self-center">Добавить себя</MainButton>
    <ModalWrapper ref="modalRef"><AddUser v-if="modalRef" :close="modalRef.hide" /></ModalWrapper>
</template>

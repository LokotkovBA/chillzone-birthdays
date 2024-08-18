import type ModalWrapper from '@/components/ModalWrapper.vue';
import { ref } from 'vue';
import type { ComponentExposed } from 'vue-component-type-helpers';

export const refModal = ref<ComponentExposed<typeof ModalWrapper> | null>;

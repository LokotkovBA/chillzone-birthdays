<script setup lang="ts">
const props = defineProps<{
    id: string;
    required?: boolean;
    type: 'text' | 'number';
}>();

const model = defineModel();
</script>

<template>
    <label class="col-start-1 col-end-1 flex gap-2 text-xl text-gray-300" :for="props.id">
        <slot></slot> <span v-if="props.required" class="text-red-700">*</span>
    </label>
    <input
        v-model="model"
        :required="props.required"
        class="bg-zinc-800 text-xl text-gray-300"
        :type="props.type"
        :id="props.id"
    />
</template>

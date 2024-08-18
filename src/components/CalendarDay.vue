<script setup lang="ts">
import clsx from 'clsx';

const props = defineProps<{ isCurrentMonth: boolean; hasBirthday: boolean }>();
</script>

<template>
    <button
        :class="
            clsx('h-14 w-14 rounded-xl p-2 text-gray-50', {
                'bg-indigo-900 hover:bg-indigo-800': props.isCurrentMonth && !props.hasBirthday,
                'bg-slate-800 opacity-0 hover:cursor-default hover:bg-slate-700':
                    !props.isCurrentMonth,
                'bg-yellow-700 hover:bg-yellow-600': props.hasBirthday && props.isCurrentMonth,
            })
        "
    >
        <slot></slot>
    </button>
</template>

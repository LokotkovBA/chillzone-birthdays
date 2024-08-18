<script setup lang="ts">
import { ref } from 'vue';

const props = withDefaults(
    defineProps<{
        layer?: '0' | '1';
    }>(),
    {
        layer: '0',
    },
);

const visible = ref(false);

function hide(event?: PointerEvent) {
    if (event && event.pointerType === 'mouse' && event.button !== 0) return;

    visible.value = false;
}

defineExpose({
    show() {
        visible.value = true;
    },
    hide,
});
</script>

<template>
    <Teleport :to="`#modal-${props.layer}`">
        <Transition>
            <article
                @pointerdown="hide"
                class="absolute inset-0 flex h-screen w-screen justify-center bg-slate-900 bg-opacity-50 p-10"
                v-if="visible"
            >
                <div @pointerdown.stop class="h-fit">
                    <slot />
                </div>
            </article>
        </Transition>
    </Teleport>
</template>

<style lang="css" scoped>
.v-enter-active,
.v-leave-active {
    transition: opacity 0.1s ease-in-out;
}

.v-enter-from,
.v-inter-to {
    opacity: 0;
}
</style>

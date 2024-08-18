<script setup lang="ts">
import { SignedOut, SignInButton } from 'vue-clerk';
</script>

<template>
    <header>
        <SignedOut>
            <SignInButton />
        </SignedOut>
    </header>

    <main class="flex flex-col gap-5 px-10 py-5">
        <RouterView />
    </main>
</template>

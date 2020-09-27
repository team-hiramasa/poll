<template>
  <v-layout>
    <v-flex class="text-center">
      <img src="/v.png" alt="Vuetify.js" class="mb-5" />
      <blockquote class="blockquote">
        <footer>
          <small>
            <em>This ID is "{{ $route.params.id }}"</em>
          </small>
        </footer>
      </blockquote>
    </v-flex>
  </v-layout>
</template>

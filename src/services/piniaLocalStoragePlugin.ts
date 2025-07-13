export function localStoragePiniaPlugin(context) {
  context.pinia; // the pinia created with `createPinia()`
  context.app; // the current app created with `createApp()`
  context.store; // the store the plugin is augmenting
  context.options; // the options object defining the store passed to `defineStore()`
  // ...
}

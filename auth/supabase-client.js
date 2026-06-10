(function () {
  "use strict";

  function createSupertoolClient() {
    const config = window.SUPERTOOL_SUPABASE;
    if (!config || !config.url || !config.anonKey) {
      throw new Error("Supabase config ontbreekt. Maak supabase-config.js op basis van supabase-config.example.js.");
    }
    if (!window.supabase || !window.supabase.createClient) {
      throw new Error("Supabase library ontbreekt. Laad eerst @supabase/supabase-js.");
    }
    return window.supabase.createClient(config.url, config.anonKey);
  }

  window.createSupertoolClient = createSupertoolClient;
})();


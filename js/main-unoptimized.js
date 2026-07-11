/**
 * ❌ UNOPTIMIZED BASELINE JAVASCRIPT
 * Intentionally written to block the main thread and drop tracking data.
 */

// ❌ PERF BUG: Heavy blocking code executed immediately in the head, freezing the initial render.
console.log(
  "Unoptimized Script Loaded: Blocking main thread initialization...",
);
const startDelay = Date.now();
while (Date.now() - startDelay < 350) {
  // Artificial 350ms main thread lockup simulating heavy, poorly placed third-party scripts.
}

// ❌ MAINTENANCE BUG: Using legacy window onload bindings that override other scripts instead of clean event listeners
window.onload = function () {
  setupLegacyForm();
};

function setupLegacyForm() {
  var form = document.querySelector("form");
  if (!form) return;

  form.onsubmit = function () {
    // ❌ INP & UX CRASH: Firing an alert creates a massive synchronous execution pause.
    // If a user clicks the button, the page completely freezes until they click "OK".
    alert("Processing Appointment Request...");

    // ❌ PERF BUG (INP Killer): Forcing a heavy, synchronous calculation loop right inside
    // the interaction phase, tanking the Interaction to Next Paint metric down to red.
    var startInteraction = Date.now();
    while (Date.now() - startInteraction < 450) {
      // Intensive computation loop freezing the page interface for 450ms
    }

    // ❌ ANALYTICS CRASH: Letting the form complete its default postback action.
    // The browser immediately flushes its memory and reloads the page, completely
    // wiping out GTM's dataLayer stream before it can transmit conversion milestones to GA4.
    return true;
  };
}

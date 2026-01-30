// Newsletter dialog handler
(function () {
  "use strict";

  function initNewsletterDialog() {
    const dialog = document.getElementById("newsletter-dialog");
    if (!dialog) {
      console.warn("Newsletter dialog not found");
      return;
    }

    const closeButton = dialog.querySelector(".dialog-close");

    // Find all newsletter links and add click handlers
    const newsletterLinks = document.querySelectorAll(
      'a[href="#newsletter-dialog"], a[href*="#newsletter-dialog"]'
    );

    newsletterLinks.forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        dialog.showModal();
      });
    });

    // Also handle direct navigation to #newsletter-dialog
    if (window.location.hash === "#newsletter-dialog") {
      dialog.showModal();
      // Clean up URL
      history.replaceState(null, null, window.location.pathname);
    }

    // Listen for hash changes
    window.addEventListener("hashchange", function () {
      if (window.location.hash === "#newsletter-dialog") {
        dialog.showModal();
        // Clean up URL
        history.replaceState(null, null, window.location.pathname);
      }
    });

    // Close dialog when close button is clicked
    if (closeButton) {
      closeButton.addEventListener("click", function () {
        dialog.close();
      });
    }

    // Close dialog when clicking outside (on backdrop)
    dialog.addEventListener("click", function (e) {
      if (e.target === dialog) {
        dialog.close();
      }
    });

    // Close dialog with Escape key (native behavior, but we can enhance)
    dialog.addEventListener("close", function () {
      // Reset form when dialog closes
      const form = dialog.querySelector(".email-signup-form");
      if (form) {
        const message = form.querySelector(".email-signup-message");
        if (message) {
          message.textContent = "";
          message.className = "email-signup-message";
        }
      }
    });
  }

  // Initialize on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initNewsletterDialog);
  } else {
    initNewsletterDialog();
  }
})();

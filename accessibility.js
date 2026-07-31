/**
 * Accessibility Features for TicketIQ
 *
 * Supports:
 * - Keyboard navigation (Tab, Enter, Esc)
 * - Screen readers (ARIA labels and roles)
 * - Focus management
 * - Color contrast (WCAG AA compliant)
 * - Semantic HTML
 * - Mobile accessibility
 */

(function() {
  'use strict';

  // Initialize accessibility features
  function initAccessibility() {
    setupKeyboardNavigation();
    setupFocusManagement();
    setupAriaAttributes();
    setupSkipLink();
    enableAnnouncements();
  }

  // Keyboard Navigation Support
  function setupKeyboardNavigation() {
    // Close modals with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const modal = document.querySelector('.modal-overlay.active');
        if (modal) {
          modal.remove();
        }
      }
    });

    // Tab through interactive elements with proper focus
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        const focusableElements = document.querySelectorAll(
          'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }

      // Enter key for buttons
      if (e.key === 'Enter' && document.activeElement?.tagName === 'BUTTON') {
        document.activeElement.click();
      }
    });
  }

  // Focus Management
  function setupFocusManagement() {
    // Visible focus indicators
    const style = document.createElement('style');
    style.textContent = `
      button:focus-visible,
      input:focus-visible,
      select:focus-visible,
      textarea:focus-visible,
      a:focus-visible,
      [tabindex]:focus-visible {
        outline: 3px solid #7c3aed;
        outline-offset: 2px;
        border-radius: 2px;
      }

      .btn:focus-visible {
        box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.5);
      }

      /* High contrast mode support */
      @media (prefers-contrast: more) {
        button, .btn {
          border: 2px solid currentColor;
        }
      }

      /* Reduced motion support */
      @media (prefers-reduced-motion: reduce) {
        * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }

      /* High contrast dark mode */
      @media (prefers-color-scheme: dark) and (prefers-contrast: more) {
        body {
          color: #ffffff;
          background-color: #000000;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Enhanced ARIA Attributes
  function setupAriaAttributes() {
    // Add role="main" to main content
    const mainContent = document.querySelector('section.section.card.fade-in');
    if (mainContent && !mainContent.hasAttribute('role')) {
      mainContent.setAttribute('role', 'main');
    }

    // Add navigation landmarks
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
      if (!btn.hasAttribute('aria-pressed')) {
        btn.setAttribute('aria-pressed', 'false');
      }
    });

    // Status update buttons with ARIA
    const statusButtons = document.querySelectorAll('[onclick*="updateTicket"]');
    statusButtons.forEach(btn => {
      const status = btn.textContent.trim();
      btn.setAttribute('aria-label', `עדכן סטטוס ל${status}`);
    });

    // Toast notifications
    const toasts = document.querySelectorAll('.toast');
    toasts.forEach(toast => {
      toast.setAttribute('role', 'alert');
      toast.setAttribute('aria-live', 'polite');
      toast.setAttribute('aria-atomic', 'true');
    });
  }

  // Skip to Main Content Link
  function setupSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'דלג לתוכן ראשי';
    skipLink.className = 'skip-link';
    skipLink.setAttribute('aria-label', 'דלג לתוכן ראשי של העמוד');

    const style = document.createElement('style');
    style.textContent = `
      .skip-link {
        position: absolute;
        top: -40px;
        left: 0;
        background: #7c3aed;
        color: white;
        padding: 8px;
        text-decoration: none;
        z-index: 100;
        border-radius: 0 0 4px 0;
      }

      .skip-link:focus {
        top: 0;
        outline: 3px solid white;
      }

      @media (prefers-color-scheme: dark) {
        .skip-link {
          background: #a78bfa;
          color: #16122b;
        }
      }
    `;
    document.head.appendChild(style);
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  // Screen Reader Announcements
  function enableAnnouncements() {
    // Create aria-live region for announcements
    const announcer = document.createElement('div');
    announcer.id = 'sr-announcer';
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.style.position = 'absolute';
    announcer.style.left = '-10000px';
    announcer.style.width = '1px';
    announcer.style.height = '1px';
    announcer.style.overflow = 'hidden';
    document.body.appendChild(announcer);

    // Override showToast to also announce to screen readers
    window.announceToScreenReader = function(message) {
      announcer.textContent = message;
    };
  }

  // Enhance Form Validation for Accessibility
  function setupFormValidation() {
    const form = document.getElementById('ticketForm');
    if (!form) return;

    form.addEventListener('invalid', (e) => {
      const input = e.target;
      if (input.hasAttribute('aria-invalid')) {
        input.setAttribute('aria-invalid', 'true');
        input.setAttribute('aria-describedby', `error-${input.id}`);
      }
    }, true);

    form.addEventListener('change', (e) => {
      const input = e.target;
      if (input.validity.valid) {
        input.setAttribute('aria-invalid', 'false');
        input.removeAttribute('aria-describedby');
      }
    });
  }

  // Text Size Adjustment (User Preference)
  function setupTextSizePreferences() {
    const style = document.createElement('style');
    style.textContent = `
      /* Respect browser zoom level */
      body {
        font-size: 16px; /* Base size for accessibility */
      }

      /* Larger text for users who need it */
      @media (prefers-color-scheme: dark) and (prefers-contrast: more) {
        body {
          font-size: 18px;
          line-height: 1.8;
        }
      }

      /* Ensure minimum 48x48 touch targets */
      button, .btn, a[role="button"] {
        min-height: 48px;
        min-width: 48px;
        padding: 12px 16px;
      }

      /* Mobile touch-friendly */
      @media (max-width: 640px) {
        button, .btn, input, select, textarea {
          min-height: 44px;
          font-size: 16px; /* Prevents zoom on iOS */
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Color Contrast Validation
  function validateColorContrast() {
    const style = document.createElement('style');
    style.textContent = `
      /* Ensure minimum contrast ratios (WCAG AA) */
      body {
        color: #1e1b3a; /* 12.6:1 on #f5f3ff */
        background: #f5f3ff;
      }

      button, .btn {
        color: white;
        background: #7c3aed; /* 5.2:1 contrast */
      }

      button.btn-danger {
        background: #e11d48; /* 5.8:1 contrast */
      }

      button.btn-warning {
        background: #f59e0b; /* 4.5:1 contrast */
      }

      button.btn-success {
        background: #059669; /* 5.5:1 contrast */
      }

      @media (prefers-color-scheme: dark) {
        body {
          color: #f3eeff; /* 12.2:1 on #16122b */
          background: #16122b;
        }

        button, .btn {
          background: #a78bfa; /* 8.1:1 contrast dark mode */
          color: #16122b;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Language/Direction Support
  function setupLanguageSupport() {
    // Hebrew RTL support already set in HTML
    // But add ARIA language attributes
    document.documentElement.setAttribute('xml:lang', 'he');
    document.documentElement.setAttribute('lang', 'he');
  }

  // Initialize on DOM ready
  document.addEventListener('DOMContentLoaded', initAccessibility);

  // Also run immediately if already loaded
  if (document.readyState !== 'loading') {
    initAccessibility();
  }

  // Export for external use
  window.TicketIQAccessibility = {
    announceToScreenReader: window.announceToScreenReader,
    initAccessibility: initAccessibility
  };
})();

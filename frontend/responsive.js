/**
 * ==============================================================================
 * JQUERY RESPONSIVENESS CONTROLLER (WEB-7)
 * ==============================================================================
 * Manages responsive behavior and viewport adaptivity using jQuery:
 *
 * 1. Mobile hamburger navigation menu with smooth animation (slideToggle).
 * 2. Auto-close mobile menu on link clicks or clicking outside the navbar.
 * 3. Mobile collapsible filter panel (slideToggle).
 * 4. Real-time viewport detection and layout adaptivity ($(window).on('resize load')).
 * 5. Dynamic placeholder and state class management (modo-movil / modo-escritorio).
 * 6. Floating scroll-to-top button with smooth animated scrolling (animate scrollTop).
 * ==============================================================================
 */

$(function () {
    'use strict';

    // Breakpoint for mobile viewport in pixels (matches CSS media queries)
    const MOBILE_BREAKPOINT = 768;

    // Cached jQuery selectors for optimal performance
    const $window = $(window);
    const $body = $('body');
    const $btnMobileMenu = $('#btn-menu-movil');
    const $navLinks = $('#nav-enlaces');
    const $btnToggleFilters = $('#btn-toggle-filtros');
    const $filtersBar = $('.barra-filtros');
    const $searchInput = $('#input-busqueda');
    const $btnScrollTop = $('#btn-scroll-top');

    // Placeholders for dynamic viewport adaptation
    const desktopPlaceholder = 'Escribe para buscar por nombre, curso o correo...';
    const mobilePlaceholder = 'Buscar estudiantes...';

    /**
     * Primary resolution adaptation handler.
     * Invoked on initial load and whenever the viewport is resized.
     */
    function adaptResolution() {
        const windowWidth = $window.width();

        if (windowWidth <= MOBILE_BREAKPOINT) {
            // Activate mobile mode classes
            $body.addClass('modo-movil').removeClass('modo-escritorio');

            // Set compact search placeholder for narrow screens
            if ($searchInput.attr('placeholder') !== mobilePlaceholder) {
                $searchInput.attr('placeholder', mobilePlaceholder);
            }

            // Ensure mobile menu remains hidden if not previously toggled open
            if (!$btnMobileMenu.hasClass('abierto')) {
                $navLinks.hide();
            }

            // In mobile mode, collapse filters initially if not already open
            if (!$btnToggleFilters.hasClass('abierto')) {
                $filtersBar.hide();
                updateFilterToggleUI(false);
            }
        } else {
            // Activate desktop mode classes
            $body.addClass('modo-escritorio').removeClass('modo-movil');

            // Restore full desktop search placeholder
            if ($searchInput.attr('placeholder') !== desktopPlaceholder) {
                $searchInput.attr('placeholder', desktopPlaceholder);
            }

            // In desktop mode, clear inline styles applied by jQuery slideToggle
            $navLinks.removeAttr('style');
            $filtersBar.removeAttr('style');
            $btnMobileMenu.removeClass('abierto');
            $btnToggleFilters.removeClass('abierto');
        }
    }

    /**
     * Updates label and chevron state for the mobile filter toggle button.
     */
    function updateFilterToggleUI(isOpen) {
        const $label = $btnToggleFilters.find('.texto-btn-filtro');
        const $arrow = $btnToggleFilters.find('.flecha-toggle');

        if (isOpen) {
            $label.text('Hide Filters');
            $arrow.text('▲');
            $btnToggleFilters.addClass('abierto').attr('aria-expanded', 'true');
        } else {
            $label.text('Show Filters');
            $arrow.text('▼');
            $btnToggleFilters.removeClass('abierto').attr('aria-expanded', 'false');
        }
    }

    // ==========================================================================
    // 1. MOBILE HAMBURGER MENU (jQuery slideToggle)
    // ==========================================================================
    $btnMobileMenu.on('click', function (event) {
        event.stopPropagation();
        const isOpen = $(this).hasClass('abierto');

        if (isOpen) {
            $(this).removeClass('abierto').attr('aria-expanded', 'false');
            $navLinks.slideUp(250);
        } else {
            $(this).addClass('abierto').attr('aria-expanded', 'true');
            $navLinks.slideDown(250);
        }
    });

    // Auto-close menu when a navigation link is clicked
    $navLinks.on('click', 'a', function () {
        if ($window.width() <= MOBILE_BREAKPOINT) {
            $btnMobileMenu.removeClass('abierto').attr('aria-expanded', 'false');
            $navLinks.slideUp(200);
        }
    });

    // Close mobile menu when clicking anywhere outside the navbar
    $(document).on('click', function (event) {
        if ($window.width() <= MOBILE_BREAKPOINT && $btnMobileMenu.hasClass('abierto')) {
            if (!$(event.target).closest('.barra-navegacion').length) {
                $btnMobileMenu.removeClass('abierto').attr('aria-expanded', 'false');
                $navLinks.slideUp(200);
            }
        }
    });

    // ==========================================================================
    // 2. MOBILE COLLAPSIBLE FILTER CONTROLS (jQuery slideToggle)
    // ==========================================================================
    $btnToggleFilters.on('click', function () {
        const isOpen = $(this).hasClass('abierto');

        if (isOpen) {
            $filtersBar.slideUp(250, function () {
                updateFilterToggleUI(false);
            });
        } else {
            $filtersBar.slideDown(250, function () {
                updateFilterToggleUI(true);
            });
        }
    });

    // ==========================================================================
    // UTILITY: THROTTLE CONTROLLER (RATE LIMITING FOR HIGH-FREQUENCY EVENTS)
    // ==========================================================================
    /**
     * Ensures a callback function executes at most once every `limit` milliseconds,
     * maintaining high 60fps rendering performance while preventing CPU lag.
     *
     * @param {Function} func - Function to throttle.
     * @param {number} limit - Minimum interval in milliseconds between executions.
     * @returns {Function} Throttled function.
     */
    function throttle(func, limit = 150) {
        let inThrottle = false;
        let lastArgs = null;
        let lastContext = null;

        return function (...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => {
                    inThrottle = false;
                    if (lastArgs) {
                        func.apply(lastContext, lastArgs);
                        lastArgs = null;
                        lastContext = null;
                    }
                }, limit);
            } else {
                lastArgs = args;
                lastContext = this;
            }
        };
    }

    // ==========================================================================
    // 3. FLOATING SCROLL-TO-TOP BUTTON (jQuery fadeIn / fadeOut & animate)
    // ==========================================================================
    // Throttled scroll listener (evaluates every 150ms instead of 100+ times/sec)
    const handleScrollThrottled = throttle(function () {
        if ($window.scrollTop() > 280) {
            $btnScrollTop.stop(true, true).fadeIn(250);
        } else {
            $btnScrollTop.stop(true, true).fadeOut(250);
        }
    }, 150);

    $window.on('scroll', handleScrollThrottled);

    $btnScrollTop.on('click', function () {
        // Smooth animated scroll to top using jQuery animate
        $('html, body').animate({
            scrollTop: 0
        }, 400);
    });

    // ==========================================================================
    // 4. LOAD & RESIZE EVENT LISTENERS (THROTTLED VIEWPORT ADAPTIVITY)
    // ==========================================================================
    // Initial run on document ready
    adaptResolution();

    // Throttled resize event listener (smooth 100ms viewport cadence)
    $window.on('resize', throttle(adaptResolution, 100));
});

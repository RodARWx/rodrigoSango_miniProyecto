/**
 * ==============================================================================
 * JQUERY RESPONSIVENESS CONTROLLER - RICK AND MORTY PROJECT (WEB-8)
 * ==============================================================================
 * Manages responsive behavior and viewport adaptivity using jQuery:
 *
 * 1. Mobile hamburger navigation menu with smooth animation (slideToggle).
 * 2. Auto-close mobile menu on link/button clicks or clicking outside the navbar.
 * 3. Mobile collapsible filter panel for character search filters (slideToggle).
 * 4. Real-time viewport detection and layout adaptivity ($(window).on('resize load')).
 * 5. Dynamic search input placeholder and layout state classes (modo-movil / modo-escritorio).
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
    const desktopPlaceholder = 'Buscar por nombre (ej. Rick Sanchez, Morty Smith, Summer, Beth)...';
    const mobilePlaceholder = 'Buscar personajes...';

    /**
     * Primary resolution adaptation handler.
     * Invoked on initial load and whenever the viewport is resized.
     */
    function adaptResolution() {
        const windowWidth = $window.width();

        if (windowWidth <= MOBILE_BREAKPOINT) {
            // Activate mobile mode classes
            $body.addClass('modo-movil').removeClass('modo-escritorio');

            // Set compact search placeholder for narrow screens if element exists
            if ($searchInput.length && $searchInput.attr('placeholder') !== mobilePlaceholder) {
                $searchInput.attr('placeholder', mobilePlaceholder);
            }

            // Ensure mobile menu remains hidden if not previously toggled open
            if (!$btnMobileMenu.hasClass('abierto')) {
                $navLinks.hide();
            }

            // In mobile mode, collapse filters initially if not already open
            if ($btnToggleFilters.length && !$btnToggleFilters.hasClass('abierto')) {
                $filtersBar.hide();
                updateFilterToggleUI(false);
            }
        } else {
            // Activate desktop mode classes
            $body.addClass('modo-escritorio').removeClass('modo-movil');

            // Restore full desktop search placeholder
            if ($searchInput.length && $searchInput.attr('placeholder') !== desktopPlaceholder) {
                $searchInput.attr('placeholder', desktopPlaceholder);
            }

            // In desktop mode, clear inline styles applied by jQuery slideToggle
            $navLinks.removeAttr('style');
            if ($filtersBar.length) {
                $filtersBar.removeAttr('style');
            }
            $btnMobileMenu.removeClass('abierto');
            if ($btnToggleFilters.length) {
                $btnToggleFilters.removeClass('abierto');
            }
        }
    }

    /**
     * Updates label and chevron state for the mobile filter toggle button.
     */
    function updateFilterToggleUI(isOpen) {
        if (!$btnToggleFilters.length) return;
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

    // Auto-close menu when navigation items are clicked
    $navLinks.on('click', 'a, button', function () {
        if ($window.width() <= MOBILE_BREAKPOINT) {
            $btnMobileMenu.removeClass('abierto').attr('aria-expanded', 'false');
            $navLinks.slideUp(200);
        }
    });

    // Close mobile menu when clicking outside the navbar
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
    if ($btnToggleFilters.length) {
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
    }

    // ==========================================================================
    // 3. FLOATING SCROLL-TO-TOP BUTTON (jQuery fadeIn / fadeOut & animate)
    // ==========================================================================
    $window.on('scroll', function () {
        // Show button on scroll threshold (> 280px)
        if ($window.scrollTop() > 280) {
            $btnScrollTop.stop(true, true).fadeIn(250);
        } else {
            $btnScrollTop.stop(true, true).fadeOut(250);
        }
    });

    $btnScrollTop.on('click', function () {
        // Smooth animated scroll to top using jQuery animate
        $('html, body').animate({
            scrollTop: 0
        }, 400);
    });

    // ==========================================================================
    // 4. LOAD & RESIZE EVENT LISTENERS
    // ==========================================================================
    // Initial run on document ready
    adaptResolution();

    // Debounced resize event listener
    let resizeTimer = null;
    $window.on('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(adaptResolution, 60);
    });
});

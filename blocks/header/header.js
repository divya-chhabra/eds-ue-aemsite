import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
const DESKTOP_BREAKPOINT = 1200;
let rafId=0;

// media query match that indicates mobile/tablet width

// const isDesktop = window.matchMedia('(min-width: 1200px)');


function closeOnEscape(e) {
  // if (e.code === 'Escape') {
  //   const nav = document.getElementById('nav');
  //   const navSections = nav.querySelector('.nav-sections');
  //   const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
  //   if (navSectionExpanded && isDesktop.matches) {
  //     // eslint-disable-next-line no-use-before-define
  //     toggleAllNavSections(navSections);
  //     navSectionExpanded.focus();
  //   } else if (!isDesktop.matches) {
  //     // eslint-disable-next-line no-use-before-define
  //     toggleMenu(nav, navSections);
  //     nav.querySelector('button').focus();
  //   }
  // }
}

function closeOnFocusLost(e) {
  // const nav = e.currentTarget;
  // if (!nav.contains(e.relatedTarget)) {
  //   const navSections = nav.querySelector('.nav-sections');
  //   const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
  //   if (navSectionExpanded && isDesktop.matches) {
  //     // eslint-disable-next-line no-use-before-define
  //     toggleAllNavSections(navSections, false);
  //   } else if (!isDesktop.matches) {
  //     // eslint-disable-next-line no-use-before-define
  //     toggleMenu(nav, navSections, false);
  //   }
  // }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  sections.querySelectorAll('.nav-sections .default-content-wrapper > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
// function toggleMenu(nav, navSections, forceExpanded = null) {
//   const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
//   const button = nav.querySelector('.nav-hamburger button');
//   document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
//   nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
//   toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
//   button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
//   // enable nav dropdown keyboard accessibility
//   const navDrops = navSections.querySelectorAll('.nav-drop');
//   if (isDesktop.matches) {
//     navDrops.forEach((drop) => {
//       if (!drop.hasAttribute('tabindex')) {
//         drop.setAttribute('tabindex', 0);
//         drop.addEventListener('focus', focusNavSection);
//       }
//     });
//   } else {
//     navDrops.forEach((drop) => {
//       drop.removeAttribute('tabindex');
//       drop.removeEventListener('focus', focusNavSection);
//     });
//   }

//   // enable menu collapse on escape keypress
//   if (!expanded || isDesktop.matches) {
//     // collapse menu on escape press
//     window.addEventListener('keydown', closeOnEscape);
//     // collapse menu on focus lost
//     nav.addEventListener('focusout', closeOnFocusLost);
//   } else {
//     window.removeEventListener('keydown', closeOnEscape);
//     nav.removeEventListener('focusout', closeOnFocusLost);
//   }
// }

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */

function applyHeaderMode( mode) {
  const header = document.querySelector('header');
  if (header)
  header.setAttribute("data-nav-mode", mode);
}

function evaluateNavMode() {
  while (document.getElementById('nav') === null) {
    // eslint-disable-next-line no-console
    console.warn("Nav not found, retrying...");
    return requestAnimationFrame(evaluateNavMode);
  }
  const nav = document.getElementById('nav');
  console.log("Evaluating nav mode", nav);
  if(!nav) return;
  const navMain = nav.querySelector('.nav-main');
  const navBrand = nav.querySelector('.nav-brand');
  const navSections = nav.querySelector('.nav-sections');
  if(!navMain || !navBrand || !navSections) return;

  if(window.innerWidth < DESKTOP_BREAKPOINT){
    applyHeaderMode("mobile");
    return true;
  }
  applyHeaderMode("desktop");
  const mainStyles = getComputedStyle(navMain);
  const mainPaddingX = parseFloat(mainStyles.paddingLeft) + parseFloat(mainStyles.paddingRight);
  const available = navMain.clientWidth - mainPaddingX;
  const needed =
    Math.ceil(navBrand.getBoundingClientRect().width) +
    Math.ceil(navSections.getBoundingClientRect().width);
  applyHeaderMode(needed <= available ? 'desktop' : 'mobile');
}
function onResize() {
  cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(evaluateNavMode);
}

window.addEventListener('load', onResize);
window.addEventListener('resize', onResize);
window.addEventListener('orientationchange', onResize);

// Optional but recommended: detect non-window width changes too
if ('ResizeObserver' in window) {
  const nav = document.getElementById('nav');
  if (nav) new ResizeObserver(onResize).observe(nav);
}
// Optional: re-check after fonts load (text width can change)
if (document.fonts?.ready) document.fonts.ready.then(onResize);

export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // decorate nav DOM
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  // creating nav-main 
  const navMain = document.createElement('div');
  navMain.classList.add('nav-main');
  [...nav.children].forEach((child) => navMain.append(child));
  nav.append(navMain);

  const navBrand = nav.querySelector('.nav-brand');
  const brandLink = navBrand?.querySelector('a');
  if (brandLink) {
    brandLink.href = '/';
    brandLink.className = '';
    const buttonContainer = brandLink.closest('.button-container');
    if (buttonContainer) buttonContainer.className = '';
  } else if (navBrand) {
    const brandPicture = navBrand.querySelector('picture');
    const brandImage = navBrand.querySelector('img');
    const brandMedia = brandPicture || brandImage;
    if (brandMedia) {
      const homeLink = document.createElement('a');
      homeLink.href = '/';
      homeLink.setAttribute('aria-label', 'Homepage');
      brandMedia.parentNode.insertBefore(homeLink, brandMedia);
      homeLink.appendChild(brandMedia);
    }

  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    const delElement = navSections.querySelector('del');
    if (delElement) {
      const span = document.createElement('span');
      span.textContent = "Have Questions?";
      span.classList.add("question-text");
      delElement.replaceWith(span);
    }
    navSections.querySelectorAll('p').forEach((p) => p.classList.add('contact-info'));
    // navSections.querySelectorAll(':scope .default-content-wrapper > ul > li').forEach((navSection) => {
    //   if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
    //   navSection.addEventListener('click', () => {
    //     if (isDesktop.matches) {
    //       const expanded = navSection.getAttribute('aria-expanded') === 'true';
    //       toggleAllNavSections(navSections);
    //       navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    //     }
    //   });
    // });
  }

  // hamburger for mobile
  // const hamburger = document.createElement('div');
  // hamburger.classList.add('nav-hamburger');
  // hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
  //     <span class="nav-hamburger-icon"></span>
  //   </button>`;
  // hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  // nav.prepend(hamburger);
  // nav.setAttribute('aria-expanded', 'false');
  // prevent mobile nav behavior on window resize
  // toggleMenu(nav, navSections, isDesktop.matches);
  // isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));
    const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
}

import { loadFragment } from '../fragment/fragment.js';

/**
 * Decorates the modal block.
 * Reads the authored fragment path, preloads the modal, and stores it
 * on window.leavingSiteModal for the external-link click handler.
 * @param {Element} block The modal block element
 */
export default async function decorate(block) {
  const link = block.querySelector('a');
  const fragmentPath = link?.getAttribute('href');
  

  // Hide the block — it's only used as a data holder
    block.style.display = 'none';

  if (!fragmentPath) return;

  const path = fragmentPath.startsWith('http')
    ? new URL(fragmentPath, window.location).pathname
    : fragmentPath;
  
  try {
    const fragment = await loadFragment(path);

    // Build dialog
    const dialog = document.createElement('dialog');
    const dialogContent = document.createElement('div');
    dialogContent.classList.add('modal-content');
    dialogContent.append(...fragment.childNodes);

    const closeButton = document.createElement('button');
    closeButton.classList.add('close-button');
    closeButton.setAttribute('aria-label', 'Close');
    closeButton.type = 'button';
    closeButton.innerHTML = '<svg class="close-bg" xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44" fill="none"><path d="M23.8462 1.04235e-06C34.8919 1.52517e-06 43.8462 8.9543 43.8462 20L43.8462 43.8462L9.99999 43.8462C4.47715 43.8462 1.95702e-07 39.369 4.37114e-07 33.8462L1.91658e-06 0L23.8462 1.04235e-06Z" fill="#0086D1"/></svg><svg class="close-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M2.4 24L0 21.6L9.6 12L0 2.4L2.4 0L12 9.6L21.6 0L24 2.4L14.4 12L24 21.6L21.6 24L12 14.4L2.4 24Z" fill="white"/></svg>';
    closeButton.addEventListener('click', () => dialog.close());

    dialog.append(closeButton, dialogContent);

    // Close on click outside
    dialog.addEventListener('click', (e) => {
      const { left, right, top, bottom } = dialog.getBoundingClientRect();
      const { clientX, clientY } = e;
      if (clientX < left || clientX > right || clientY < top || clientY > bottom) {
        dialog.close();
      }
    });

    dialog.addEventListener('close', () => {
      document.body.classList.remove('modal-open');
    });

    // Disable hover effects on modal buttons
    dialog.querySelectorAll('a.button').forEach((btn) => btn.classList.add('no-hover'));

    // Wire up Continue (first link) and Stay Here (last link)
    const anchors = dialog.querySelectorAll('a');
    const [continueAnchor] = anchors;
    const stayHereAnchor = anchors[anchors.length - 1];

    if (continueAnchor && !continueAnchor.querySelector('.modal-continue-label')) {
      const continueLabel = document.createElement('span');
      continueLabel.classList.add('modal-continue-label', 'primary-button-horizontal');
      while (continueAnchor.firstChild) {
        continueLabel.appendChild(continueAnchor.firstChild);
      }
      continueAnchor.appendChild(continueLabel);
    }

    if (stayHereAnchor) {
      stayHereAnchor.classList.add('modal-stay-here-button');
      stayHereAnchor.addEventListener('click', (e) => {
        e.preventDefault();
        dialog.close();
      });
    }

    // Append dialog into the block
    block.textContent = '';
    block.append(dialog);

    // Expose on window for the external-link click handler
    window.leavingSiteModal = {
      continueAnchor,
      showModal: () => {
        block.style.display = '';
        dialog.showModal();
        dialogContent.scrollTop = 0;
        document.body.classList.add('modal-open');
      },
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to load leaving-site modal fragment:', error);
  }
}

/**
 * Shows the preloaded leaving-site modal, updating the Continue button href.
 * @param {string} href The external URL to navigate to on Continue button click
 */
export function showLeavingSiteModal(href) {
  const { leavingSiteModal } = window;
  if (!leavingSiteModal) return;

  const { showModal, continueAnchor } = leavingSiteModal;
  if (href && continueAnchor) {
    continueAnchor.href = href;
    continueAnchor.target = '_blank';
    continueAnchor.rel = 'noopener noreferrer';
  }
  showModal();
}
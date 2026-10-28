const homepage = document.querySelector('.homepage');
const viewer = document.querySelector('#hero-model');
const modelStatus = document.querySelector('#model-status');
const researchPanel = document.querySelector('#artistic-research');
const researchToggle = document.querySelector('#research-toggle');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let modelLoaded = viewer.loaded === true;
let panelAnimation;

viewer.addEventListener('load', () => {
  modelLoaded = true;
  modelStatus.hidden = true;
});
viewer.addEventListener('error', () => {
  modelStatus.textContent = 'The 3D artwork could not load. Open this site through a local web server.';
});
if (modelLoaded) modelStatus.hidden = true;
if (prefersReducedMotion.matches) viewer.removeAttribute('auto-rotate');

function setResearchOpen(opening) {
  const currentHeight = researchPanel.hidden ? 0 : researchPanel.getBoundingClientRect().height;
  panelAnimation?.cancel();

  if (opening) {
    researchPanel.hidden = false;
    if (!prefersReducedMotion.matches) {
      const animation = researchPanel.animate(
        [{ height: `${currentHeight}px` }, { height: `${researchPanel.scrollHeight}px` }],
        { duration: 450, easing: 'ease-out', fill: 'forwards' },
      );
      panelAnimation = animation;
      animation.addEventListener('finish', () => {
        if (panelAnimation !== animation) return;
        animation.cancel();
        panelAnimation = undefined;
      }, { once: true });
    }
  } else if (!researchPanel.hidden && !prefersReducedMotion.matches) {
    const animation = researchPanel.animate(
      [{ height: `${currentHeight}px` }, { height: '0px' }],
      { duration: 300, easing: 'ease-in', fill: 'forwards' },
    );
    panelAnimation = animation;
    animation.addEventListener('finish', () => {
      if (panelAnimation !== animation) return;
      researchPanel.hidden = true;
      animation.cancel();
      panelAnimation = undefined;
    }, { once: true });
  } else {
    researchPanel.hidden = true;
  }

  homepage.classList.toggle('homepage--research', opening);
  researchToggle.setAttribute('aria-expanded', String(opening));
  const pageUrl = new URL(window.location.href);
  pageUrl.hash = opening ? 'artistic-research' : '';
  window.history.replaceState(null, '', pageUrl);
}

researchToggle.addEventListener('click', (event) => {
  event.preventDefault();
  setResearchOpen(!homepage.classList.contains('homepage--research'));
});

if (window.location.hash === '#artistic-research') setResearchOpen(true);

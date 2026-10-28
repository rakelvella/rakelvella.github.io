import { projects } from './design-data.js?v=tbo-description-1';

const container = document.querySelector('#design-projects');
const tableHeader = document.querySelector('.table-head');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const lightbox = document.querySelector('#design-lightbox');
let lightboxImage = lightbox.querySelector('img');
const lightboxPrevious = lightbox.querySelector('.design-lightbox-prev');
const lightboxNext = lightbox.querySelector('.design-lightbox-next');
let openingImageButton = null;
let lightboxImages = [];
let lightboxIndex = 0;
let lightboxRenderId = 0;

async function imageReady(img) {
  if (img.complete && img.naturalWidth > 0) return true;
  if (img.decode) {
    try {
      await img.decode();
      if (img.naturalWidth > 0) return true;
    } catch {}
  }
  if (img.complete) return img.naturalWidth > 0;
  return new Promise((resolve) => {
    img.addEventListener('load', () => resolve(true), { once: true });
    img.addEventListener('error', () => resolve(false), { once: true });
  });
}

function showLightboxImage() {
  const image = lightboxImages[lightboxIndex];
  const renderId = ++lightboxRenderId;
  const nextImage = new Image();
  nextImage.alt = image.alt || '';
  nextImage.decoding = 'async';
  nextImage.src = image.src;
  if (!lightbox.open) lightboxImage.style.visibility = 'hidden';
  imageReady(nextImage).then((ready) => {
    if (!ready || renderId !== lightboxRenderId) return;
    lightboxImage.replaceWith(nextImage);
    lightboxImage = nextImage;
  });
  lightboxPrevious.hidden = lightboxImages.length < 2;
  lightboxNext.hidden = lightboxImages.length < 2;
}

function moveLightbox(direction) {
  if (lightboxImages.length < 2) return;
  lightboxIndex = (lightboxIndex + direction + lightboxImages.length) % lightboxImages.length;
  showLightboxImage();
}

function openLightbox(images, index, button) {
  openingImageButton = button;
  lightboxImages = images;
  lightboxIndex = index;
  showLightboxImage();
  lightbox.showModal();
}

lightbox.querySelector('.design-lightbox-close').addEventListener('click', () => lightbox.close());
lightboxPrevious.addEventListener('click', () => moveLightbox(-1));
lightboxNext.addEventListener('click', () => moveLightbox(1));
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) lightbox.close();
});
lightbox.addEventListener('close', () => {
  lightboxRenderId += 1;
  openingImageButton?.focus();
});

document.addEventListener('keydown', (event) => {
  if (!lightbox.open || (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')) return;
  const direction = event.key === 'ArrowLeft' ? -1 : 1;
  event.preventDefault();
  moveLightbox(direction);
});

function imageBlock(image, className = '', onOpen = null, loading = 'lazy') {
  const figure = document.createElement('figure');
  figure.className = `project-image project-image--${image.shape || 'landscape'} ${className}`.trim();
  if (image.gradientMap === 'reversed') figure.classList.add('project-image--reversed-gradient');

  if (image.src) {
    figure.classList.add('project-image--loaded');
    if (image.width && image.height) figure.style.aspectRatio = `${image.width} / ${image.height}`;
    const img = document.createElement('img');
    img.src = image.src;
    img.alt = image.alt || '';
    img.loading = loading;
    img.decoding = 'async';
    if (onOpen) {
      const button = document.createElement('button');
      button.className = 'project-image-button';
      button.type = 'button';
      button.setAttribute('aria-label', `Enlarge image: ${image.alt || 'Project image'}`);
      button.append(img);
      button.addEventListener('click', () => onOpen(button));
      figure.append(button);
    } else {
      figure.append(img);
    }
  } else {
    figure.setAttribute('role', 'img');
    figure.setAttribute('aria-label', image.alt || 'Project image placeholder');
  }

  return figure;
}

projects.filter((project) => !project.hidden).forEach((project, index) => {
  const article = document.createElement('article');
  article.className = 'project';
  article.setAttribute('aria-label', project.title);
  if (project.theme) {
    article.classList.add('project--themed');
    article.style.setProperty('--project-background', project.theme.background);
    article.style.setProperty('--project-text', project.theme.text);
  }

  const top = document.createElement('div');
  top.className = 'project-top';
  top.tabIndex = 0;
  top.setAttribute('role', 'button');
  top.setAttribute('aria-label', `Show details for ${project.title}`);
  top.setAttribute('aria-expanded', 'false');
  for (const [key, className] of [
    ['title', 'project-title'],
    ['type', 'project-type'],
    ['medium', 'project-medium'],
    ['year', 'project-year'],
  ]) {
    const cell = document.createElement('div');
    cell.className = `project-cell ${className}`;
    if (key === 'title') {
      const titleText = document.createElement('span');
      titleText.className = 'project-title-text';
      titleText.textContent = project[key] || '';
      cell.append(titleText);
    } else {
      cell.textContent = project[key] || '';
    }
    top.append(cell);
  }

  const featured = document.createElement('div');
  featured.className = 'project-featured';
  featured.append(imageBlock(project.hero, 'project-hero'));
  top.append(featured);

  const toggle = document.createElement('span');
  toggle.className = 'project-toggle';
  toggle.innerHTML = '<svg viewBox="0 0 26 26" aria-hidden="true" focusable="false"><path d="M13 2v22M2 13h22" fill="none" stroke="currentColor" stroke-width="2.5" /></svg>';
  toggle.setAttribute('aria-hidden', 'true');
  top.append(toggle);

  const detailsShell = document.createElement('div');
  detailsShell.className = 'project-details-shell';
  detailsShell.id = `project-details-${index}`;
  detailsShell.hidden = true;
  top.setAttribute('aria-controls', detailsShell.id);
  const detailsRules = document.createElement('div');
  detailsRules.className = 'project-details-rules';
  detailsRules.setAttribute('aria-hidden', 'true');
  for (let column = 0; column < 6; column += 1) detailsRules.append(document.createElement('span'));
  const details = document.createElement('div');
  details.className = 'project-details';
  if (project.description || project.link) {
    const description = document.createElement('p');
    description.className = 'project-description';
    description.textContent = project.description || '';
    if (project.link) {
      const linkLine = document.createElement('span');
      linkLine.className = 'project-description-link';
      const link = document.createElement('a');
      link.href = project.link.href;
      link.textContent = project.link.label;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      linkLine.append(link);
      description.append(linkLine);
    }
    details.append(description);
  }
  const gallery = document.createElement('div');
  gallery.className = 'project-gallery';
  gallery.setAttribute('role', 'group');
  gallery.setAttribute('aria-label', `Images for ${project.title}`);
  const galleryImages = [project.hero, project.featured, ...(project.gallery || [])].filter((image) => image?.src);
  if (galleryImages.length) {
    galleryImages.forEach((image, imageIndex) => {
      gallery.append(imageBlock(image, 'project-gallery-image', (button) => openLightbox(galleryImages, imageIndex, button)));
    });
  } else {
    gallery.append(imageBlock(project.hero, 'project-gallery-image'));
  }
  details.append(gallery);
  detailsShell.append(detailsRules, details);

  let detailsAnimation = null;

  function setDetailsOpen(open, onFinish) {
    const startHeight = detailsShell.hidden ? 0 : detailsShell.getBoundingClientRect().height;
    const startOpacity = detailsShell.hidden ? 0 : Number.parseFloat(getComputedStyle(detailsShell).opacity);
    detailsAnimation?.cancel();

    detailsShell.hidden = false;
    detailsShell.inert = !open;

    if (prefersReducedMotion.matches || !detailsShell.animate) {
      detailsShell.hidden = !open;
      detailsShell.style.removeProperty('height');
      detailsShell.style.removeProperty('overflow');
      onFinish?.();
      return;
    }

    detailsShell.style.height = 'auto';
    const endHeight = open ? detailsShell.scrollHeight : 0;
    detailsShell.style.height = `${startHeight}px`;
    detailsShell.style.overflow = 'hidden';

    const animation = detailsShell.animate(
      [
        { height: `${startHeight}px`, opacity: startOpacity },
        { height: `${endHeight}px`, opacity: open ? 1 : 0 },
      ],
      { duration: 460, easing: 'cubic-bezier(0.65, 0, 0.35, 1)' },
    );
    detailsAnimation = animation;
    animation.onfinish = () => {
      if (detailsAnimation !== animation) return;
      detailsAnimation = null;
      detailsShell.hidden = !open;
      detailsShell.style.removeProperty('height');
      detailsShell.style.removeProperty('overflow');
      onFinish?.();
    };
  }

  function scrollRowUnderHeader() {
    if (top.getAttribute('aria-expanded') !== 'true') return;
    const headerHeight = tableHeader.getBoundingClientRect().height;
    const targetY = window.scrollY + top.getBoundingClientRect().top - headerHeight;
    const currentPadding = Number.parseFloat(getComputedStyle(container).paddingBottom) || 0;
    const maxScrollWithoutPadding = document.documentElement.scrollHeight - window.innerHeight - currentPadding;
    container.style.paddingBottom = `${Math.max(0, Math.ceil(targetY - maxScrollWithoutPadding))}px`;

    if (Math.abs(top.getBoundingClientRect().top - headerHeight) > 1) {
      window.scrollTo({ top: targetY, behavior: prefersReducedMotion.matches ? 'auto' : 'smooth' });
    }
  }

  function toggleDetails() {
    const open = top.getAttribute('aria-expanded') !== 'true';
    top.setAttribute('aria-expanded', String(open));
    top.setAttribute('aria-label', `${open ? 'Hide' : 'Show'} details for ${project.title}`);
    setDetailsOpen(open, open ? scrollRowUnderHeader : undefined);
    article.classList.toggle('project--open', open);
    if (open) scrollRowUnderHeader();
    else if (!container.querySelector('.project-top[aria-expanded="true"]')) container.style.removeProperty('padding-bottom');
  }

  top.addEventListener('click', toggleDetails);
  top.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    toggleDetails();
  });

  article.append(top, detailsShell);
  container.append(article);
});

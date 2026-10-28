import { entries } from './photography-data.js';

const journal = document.querySelector('#journal');
const lightbox = document.querySelector('#photo-lightbox');
const lightboxContent = lightbox.querySelector('.lightbox-content');
const lightboxCaption = lightbox.querySelector('.lightbox-caption');
const previousButton = lightbox.querySelector('.lightbox-previous');
const nextButton = lightbox.querySelector('.lightbox-next');
let activeEntry = 0;
let activePhoto = 0;
let openingButton;

function mediaFor(photo) {
  if (photo.src) {
    const image = document.createElement('img');
    image.src = photo.src;
    image.alt = photo.alt || '';
    image.loading = 'lazy';
    image.decoding = 'async';
    return image;
  }

  const placeholder = document.createElement('span');
  placeholder.className = 'photo-placeholder';
  placeholder.setAttribute('aria-hidden', 'true');
  return placeholder;
}

function renderLightbox() {
  const photo = entries[activeEntry].photos[activePhoto];
  const media = mediaFor(photo);
  if (media.tagName === 'IMG') media.loading = 'eager';
  lightboxContent.replaceChildren(media);
  lightboxContent.dataset.shape = photo.shape || 'square';
  lightboxCaption.textContent = photo.caption || photo.alt || '';
  previousButton.disabled = activePhoto === 0;
  nextButton.disabled = activePhoto === entries[activeEntry].photos.length - 1;
}

function openPhoto(entryIndex, photoIndex, button) {
  activeEntry = entryIndex;
  activePhoto = photoIndex;
  openingButton = button;
  renderLightbox();
  lightbox.showModal();
}

entries.forEach((entry, entryIndex) => {
  const article = document.createElement('article');
  article.className = 'journal-entry';
  article.setAttribute('aria-label', `${entry.date}, ${entry.coordinates}`);

  const details = document.createElement('div');
  details.className = 'entry-details';
  const date = document.createElement('p');
  date.textContent = entry.date;
  const coordinates = document.createElement('p');
  coordinates.textContent = entry.coordinates;
  const journalLabel = document.createElement('p');
  journalLabel.className = 'entry-journal-label';
  journalLabel.textContent = 'Journal entry';
  details.append(date, coordinates, journalLabel);
  if (entry.journal) {
    const journalText = document.createElement('p');
    journalText.className = 'entry-journal-text';
    journalText.textContent = entry.journal;
    details.append(journalText);
  }

  const strip = document.createElement('div');
  strip.className = 'photo-strip';
  strip.setAttribute('aria-label', `Photographs from ${entry.date}`);

  entry.photos.forEach((photo, photoIndex) => {
    const figure = document.createElement('figure');
    figure.className = `photo-card photo-card--${photo.shape || 'square'}`;
    const button = document.createElement('button');
    button.className = 'photo-open';
    button.type = 'button';
    button.setAttribute('aria-label', `Enlarge photograph ${photoIndex + 1}: ${photo.alt || photo.caption || entry.date}`);
    button.append(mediaFor(photo));
    button.addEventListener('click', () => openPhoto(entryIndex, photoIndex, button));
    const caption = document.createElement('figcaption');
    caption.textContent = photo.caption || photo.alt || '';
    figure.append(button, caption);
    strip.append(figure);
  });

  article.append(details, strip);
  journal.append(article);
});

lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', (event) => {
  if (!event.target.closest('button, .lightbox-content img, .lightbox-content .photo-placeholder')) {
    lightbox.close();
  }
});
lightbox.addEventListener('close', () => openingButton?.focus());
previousButton.addEventListener('click', () => {
  if (activePhoto > 0) { activePhoto -= 1; renderLightbox(); }
});
nextButton.addEventListener('click', () => {
  if (activePhoto < entries[activeEntry].photos.length - 1) { activePhoto += 1; renderLightbox(); }
});
lightbox.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft' && activePhoto > 0) { activePhoto -= 1; renderLightbox(); }
  if (event.key === 'ArrowRight' && activePhoto < entries[activeEntry].photos.length - 1) { activePhoto += 1; renderLightbox(); }
});

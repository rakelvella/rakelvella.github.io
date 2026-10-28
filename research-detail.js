const projectCopy = document.querySelector('.project-copy');

if (projectCopy) {
  const syncCopyHeight = () => {
    projectCopy.style.setProperty('--copy-height', `${projectCopy.offsetHeight}px`);
  };
  if ('ResizeObserver' in window) new ResizeObserver(syncCopyHeight).observe(projectCopy);
  syncCopyHeight();
}

document.querySelectorAll('[data-vimeo-id]').forEach((embed) => {
  embed.querySelector('button')?.addEventListener('click', () => {
    const player = document.createElement('iframe');
    player.src = `https://player.vimeo.com/video/${embed.dataset.vimeoId}?autoplay=1`;
    player.title = embed.dataset.videoTitle || 'Project video';
    player.allow = 'autoplay; fullscreen; picture-in-picture';
    player.allowFullscreen = true;
    embed.replaceChildren(player);
  });
});

document.querySelectorAll('[data-youtube-id]').forEach((embed) => {
  embed.querySelector('.video-poster')?.addEventListener('click', (event) => {
    if (window.location.protocol === 'file:') return;
    event.preventDefault();
    const player = document.createElement('iframe');
    player.src = `https://www.youtube-nocookie.com/embed/${embed.dataset.youtubeId}?autoplay=1`;
    player.title = embed.dataset.videoTitle || 'Project video';
    player.allow = 'autoplay; encrypted-media; picture-in-picture; web-share';
    player.allowFullscreen = true;
    player.referrerPolicy = 'strict-origin-when-cross-origin';
    embed.replaceChildren(player);
  });
});

const c4veGallery = document.querySelector('.c4ve-dweller .project-gallery');
const c4veLightbox = document.querySelector('.c4ve-lightbox');

if (c4veGallery && c4veLightbox) {
  const galleryImages = [...c4veGallery.querySelectorAll('.project-media > img')];
  const previousButton = c4veLightbox.querySelector('.c4ve-lightbox-prev');
  const nextButton = c4veLightbox.querySelector('.c4ve-lightbox-next');
  let enlargedImage = c4veLightbox.querySelector('img');
  let currentIndex = 0;
  let openingButton = null;
  let renderId = 0;

  const showImage = async () => {
    const source = galleryImages[currentIndex];
    const nextImage = new Image();
    const thisRender = ++renderId;
    nextImage.alt = source.alt;
    nextImage.src = source.currentSrc || source.src;

    try {
      await nextImage.decode();
    } catch {
      if (!nextImage.complete || !nextImage.naturalWidth) return;
    }

    if (thisRender !== renderId || !c4veLightbox.open) return;
    enlargedImage.replaceWith(nextImage);
    enlargedImage = nextImage;
  };

  const moveImage = (direction) => {
    currentIndex = (currentIndex + direction + galleryImages.length) % galleryImages.length;
    showImage();
  };

  galleryImages.forEach((image, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'project-media-button';
    button.setAttribute('aria-label', `Enlarge image ${index + 1} of ${galleryImages.length}: ${image.alt}`);
    image.replaceWith(button);
    button.append(image);
    button.addEventListener('click', () => {
      openingButton = button;
      currentIndex = index;
      c4veLightbox.showModal();
      showImage();
    });
  });

  c4veLightbox.querySelector('.c4ve-lightbox-close').addEventListener('click', () => c4veLightbox.close());
  previousButton.addEventListener('click', () => moveImage(-1));
  nextButton.addEventListener('click', () => moveImage(1));
  c4veLightbox.addEventListener('click', (event) => {
    if (event.target === c4veLightbox) c4veLightbox.close();
  });
  c4veLightbox.addEventListener('close', () => {
    renderId += 1;
    openingButton?.focus();
  });
  document.addEventListener('keydown', (event) => {
    if (!c4veLightbox.open || (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')) return;
    event.preventDefault();
    moveImage(event.key === 'ArrowLeft' ? -1 : 1);
  });
}

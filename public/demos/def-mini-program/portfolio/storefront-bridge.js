/* Isolated fixture transport for the real Taro H5 preview. No business API requests. */
(() => {
  const origin = location.origin;
  let content;
  let resolveContent;
  const firstContent = new Promise((resolve) => { resolveContent = resolve; });
  let layout = [];
  let draggingId = null;
  let editable = false;
  let pointerY = null;
  let frame = null;
  let marker;

  const send = (type, payload) => parent.postMessage({ source: 'def-portfolio-preview', type, payload }, origin);
  const modules = () => [...document.querySelectorAll('[data-module-id]')]
    .filter((element) => !element.classList.contains('preview-module-frame--floating'))
    .sort((left, right) => left.getBoundingClientRect().top - right.getBoundingClientRect().top);

  function insertion(clientY) {
    const elements = modules();
    const next = elements.find((element) => {
      const rect = element.getBoundingClientRect();
      return clientY < rect.top + rect.height / 2;
    });
    if (next) return layout.indexOf(next.dataset.moduleId);
    return layout.length;
  }

  function showMarker(y) {
    if (!marker) {
      marker = document.createElement('div');
      marker.dataset.portfolioDropIndicator = '';
      marker.style.cssText = 'position:fixed;left:12px;right:12px;z-index:999;pointer-events:none;border-top:3px solid var(--def-primary);font:11px sans-serif;color:var(--def-primary);background:var(--def-card);padding:4px 8px;';
      document.body.append(marker);
    }
    const index = insertion(y);
    const next = modules().find((element) => layout.indexOf(element.dataset.moduleId) >= index);
    const last = modules().at(-1);
    const top = next ? next.getBoundingClientRect().top : last ? last.getBoundingClientRect().bottom : 80;
    marker.style.top = `${Math.max(0, Math.min(innerHeight - 28, top))}px`;
    marker.textContent = 'Drop to insert module';
    marker.hidden = false;
  }

  function stopDrag() {
    pointerY = null;
    if (marker) marker.hidden = true;
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
  }

  function autoScroll() {
    if (pointerY === null || !draggingId) { frame = null; return; }
    const viewport = document.querySelector('.taro_page');
    const delta = pointerY < 48 ? -8 : pointerY > innerHeight - 48 ? 8 : 0;
    if (delta) {
      if (viewport && viewport.scrollHeight > viewport.clientHeight) viewport.scrollTop += delta;
      else window.scrollBy(0, delta);
      showMarker(pointerY);
    }
    frame = requestAnimationFrame(autoScroll);
  }

  window.portfolioStorefrontRequest = async (url, options = {}) => {
    await firstContent;
    if (options.method && options.method !== 'GET') throw new Error('Portfolio preview is read-only.');
    if (url.startsWith('/api/v1/storefront/home')) return content.home;
    if (url === '/api/v1/storefront/tab-bar') return { items: content.tabBar };
    if (url === '/api/v1/storefront/me') return null;
    throw new Error(`Unavailable in portfolio preview: ${url}`);
  };

  addEventListener('message', (event) => {
    if (event.source !== parent || event.origin !== origin) return;
    if (event.data?.source !== 'def-portfolio-storefront') return;
    if (event.data.type !== 'content') return;
    content = event.data.payload;
    layout = content.home.layout;
    draggingId = content.draggingId;
    editable = content.editable;
    resolveContent();
    if (!draggingId) stopDrag();
  });
  document.addEventListener('dragover', (event) => {
    if (!editable || !draggingId || !event.dataTransfer.types.includes('application/x-def-storefront-module')) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = layout.includes(draggingId) ? 'move' : 'copy';
    pointerY = event.clientY;
    showMarker(pointerY);
    if (frame === null) frame = requestAnimationFrame(autoScroll);
  });
  document.addEventListener('drop', (event) => {
    if (!editable || !draggingId || !event.dataTransfer.types.includes('application/x-def-storefront-module')) return;
    event.preventDefault();
    send('drop', { moduleId: draggingId, index: insertion(event.clientY) });
    stopDrag();
  });
  document.addEventListener('dragleave', (event) => { if (!event.relatedTarget) stopDrag(); });
  document.addEventListener('dragend', stopDrag);
  addEventListener('DOMContentLoaded', () => send('ready', {}));
})();

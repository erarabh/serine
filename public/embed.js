(function () {
  const scriptTag = document.currentScript;
  const userId = scriptTag?.dataset?.userId;
  const lang = scriptTag?.dataset?.lang || 'en';
  const agentId = scriptTag?.dataset?.agentId;

  if (!userId) return;

  // Widget container
  const container = document.createElement('div');
  container.style = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 9999;
  `;

  // Chat iframe — ✅ FIXED: Added agentId to URL
  const iframe = document.createElement('iframe');
  iframe.src = `http://localhost:3000/embed?uid=${userId}&lang=${lang}&aid=${agentId}`;
  iframe.allow = 'microphone; clipboard-write;';
  iframe.style = `
    width: 320px;
    height: 450px;
    border: none;
    border-radius: 16px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
    display: block;
  `;

  // Floating icon
  const toggleBtn = document.createElement('button');
  toggleBtn.textContent = '🤖';
  toggleBtn.title = 'Open chatbot';
  toggleBtn.style = `
    width: 56px;
    height: 56px;
    font-size: 24px;
    border-radius: 50%;
    background-color: #7e22ce;
    color: white;
    border: none;
    cursor: pointer;
    box-shadow: 0 0 10px rgba(0,0,0,0.3);
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 10000;
    display: none;
  `;

  let isOpen = true;

  function closeWidget() {
    iframe.style.display = 'none';
    toggleBtn.style.display = 'block';
    isOpen = false;
  }

  function openWidget() {
    iframe.style.display = 'block';
    toggleBtn.style.display = 'none';
    isOpen = true;
  }

  openWidget();

  // Message handlers
  window.addEventListener('message', (event) => {
    if (event.data === 'serine:close') {
      closeWidget();
    } else if (event.data === 'serine:open') {
      openWidget();
    }
  });

  toggleBtn.addEventListener('click', () => {
    openWidget();
    window.postMessage('serine:open', '*');
  });

  container.appendChild(iframe);
  container.appendChild(toggleBtn);
  document.body.appendChild(container);
})();

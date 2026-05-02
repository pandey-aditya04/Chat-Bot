(function() {
  // 1. Get configuration from the script tag
  const script = document.currentScript || Array.from(document.getElementsByTagName('script')).find(s => s.src.includes('widget.js'));
  const botId = script.getAttribute('data-bot-id');
  const position = script.getAttribute('data-position') || 'bottom-right';
  const host = new URL(script.src).origin;

  if (!botId) {
    console.error('ChatBot Builder: Missing data-bot-id attribute.');
    return;
  }

  // 2. Create the Styles
  const style = document.createElement('style');
  style.innerHTML = `
    .cbb-widget-container {
      position: fixed;
      bottom: 20px;
      z-index: 999999;
      font-family: sans-serif;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .cbb-widget-container.bottom-right { right: 20px; }
    .cbb-widget-container.bottom-left { left: 20px; }

    .cbb-launcher {
      width: 60px;
      height: 60px;
      border-radius: 30px;
      background: #6366f1;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s ease;
    }
    .cbb-launcher:hover { transform: scale(1.1); }
    .cbb-launcher svg { width: 28px; height: 28px; fill: white; }

    .cbb-window {
      position: absolute;
      bottom: 80px;
      width: 400px;
      height: 600px;
      max-height: calc(100vh - 120px);
      max-width: calc(100vw - 40px);
      background: white;
      border-radius: 16px;
      box-shadow: 0 12px 48px rgba(0,0,0,0.25);
      overflow: hidden;
      display: none;
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.3s ease;
    }
    .cbb-window.open {
      display: block;
      opacity: 1;
      transform: translateY(0);
    }
    .cbb-window.bottom-right { right: 0; transform-origin: bottom right; }
    .cbb-window.bottom-left { left: 0; transform-origin: bottom left; }

    .cbb-window iframe {
      width: 100%;
      height: 100%;
      border: none;
    }

    @media (max-width: 480px) {
      .cbb-window {
        width: 100vw;
        height: 100vh;
        max-height: 100vh;
        max-width: 100vw;
        bottom: 0;
        right: 0 !important;
        left: 0 !important;
        border-radius: 0;
      }
    }
  `;
  document.head.appendChild(style);

  // 3. Create the Container
  const container = document.createElement('div');
  container.className = `cbb-widget-container ${position}`;
  document.body.appendChild(container);

  // 4. Create the Launcher
  const launcher = document.createElement('div');
  launcher.className = 'cbb-launcher';
  launcher.innerHTML = `
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  `;
  container.appendChild(launcher);

  // 5. Create the Window
  const windowDiv = document.createElement('div');
  windowDiv.className = `cbb-window ${position}`;
  windowDiv.innerHTML = `<iframe src="${host}/embed/${botId}" allow="microphone"></iframe>`;
  container.appendChild(windowDiv);

  // 6. Toggle Logic
  let isOpen = false;
  launcher.onclick = () => {
    isOpen = !isOpen;
    if (isOpen) {
      windowDiv.style.display = 'block';
      setTimeout(() => windowDiv.classList.add('open'), 10);
      launcher.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      `;
    } else {
      windowDiv.classList.remove('open');
      setTimeout(() => { if (!isOpen) windowDiv.style.display = 'none'; }, 300);
      launcher.innerHTML = `
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      `;
    }
  };
})();

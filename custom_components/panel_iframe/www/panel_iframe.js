/**
 * 侧边栏面板 - iframe 嵌入组件
 * 兼容 Home Assistant 2025.x - 2026.x
 */
class HaPanelIframe extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._panel = null;
    this._hass = null;
    this._narrow = false;
  }

  set panel(panel) {
    this._panel = panel;
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    // 更新 Shadow DOM 内的 ha-menu-button
    const menuBtn = this.shadowRoot && this.shadowRoot.querySelector('ha-menu-button');
    if (menuBtn) {
      menuBtn.hass = hass;
    }
  }

  set narrow(narrow) {
    this._narrow = narrow;
    // 更新 Shadow DOM 内的 ha-menu-button
    const menuBtn = this.shadowRoot && this.shadowRoot.querySelector('ha-menu-button');
    if (menuBtn) {
      menuBtn.narrow = narrow;
    }
    this._render();
  }

  _fireEvent(type, data) {
    const event = new Event(type, {
      bubbles: true,
      cancelable: false,
      composed: true
    });
    event.detail = data;
    this.dispatchEvent(event);
  }

  _toggleMenu(event) {
    this._fireEvent('hass-toggle-menu');
    event.stopPropagation();
  }

  _render() {
    if (!this._panel) return;

    const { config, title } = this._panel;
    let { url, mode } = config;

    // 如果传入的是端口号
    if (/^\d+$/.test(url)) {
      url = 'http://' + location.hostname + ':' + url;
    }
    // 如果传入的双斜杠，则忽略默认端口
    if (url.indexOf('//') === 0) {
      url = location.protocol + '//' + location.hostname + url.substring(1);
    }
    // 如果传入端口路径
    if (url.indexOf(':') === 0) {
      url = location.protocol + '//' + location.hostname + url;
    }

    // 内置页面 - 在 HA 内部导航
    if (mode == 3) {
      history.replaceState(null, null, url);
      return this._fireEvent('location-changed', { replace: true });
    }

    // 如果 HTTPS 协议下嵌入 HTTP 页面，浏览器安全限制无法嵌入
    if (location.protocol === 'https:' && url.indexOf('http://') === 0) {
      this.shadowRoot.innerHTML = `
        <style>
          :host { display: block; height: 100%; background: var(--primary-background-color); }
          .container { display: flex; align-items: center; justify-content: center; height: calc(100% - var(--header-height)); flex-direction: column; }
          .toolbar { display: flex; align-items: center; font-size: 20px; height: var(--header-height); padding: 8px 12px;
            background-color: var(--app-header-background-color); color: var(--app-header-text-color, white);
            border-bottom: var(--app-header-border-bottom, none); box-sizing: border-box; width: 100%; }
          .main-title { margin: 0 0 0 24px; line-height: 20px; flex-grow: 1; }
          .warning { color: var(--error-color, #db4437); margin-bottom: 16px; }
          a { color: var(--primary-color); font-size: 18px; text-decoration: none; margin-top: 16px; padding: 8px 16px;
            border: 1px solid var(--primary-color); border-radius: 4px; }
          a:hover { background: var(--primary-color); color: white; }
        </style>
        <div class="toolbar">
          <ha-menu-button></ha-menu-button>
          <div class="main-title">${title}</div>
        </div>
        <div class="container">
          <p class="warning">由于浏览器安全限制，HTTPS 页面无法嵌入 HTTP 内容</p>
          <a href="${url}" target="_blank" rel="noreferrer">在新标签页打开</a>
        </div>
      `;
      this._setupMenuButton();
      return;
    }

    // 全屏显示
    if (mode == 1) {
      this.shadowRoot.innerHTML = `
        <style>
          :host { display: block; height: 100%; background: var(--primary-background-color); overflow: hidden; position: relative; }
          :host([narrow]) { width: 100%; position: fixed; }
          iframe { border: none; width: 100%; height: 100vh; }
          .nav-button { position: fixed; bottom: 16px; right: 16px; z-index: 1; }
        </style>
        <iframe allow="fullscreen" src="${url}"></iframe>
      `;
      if (this._narrow) {
        const btn = document.createElement('ha-icon-button');
        btn.className = 'nav-button';
        btn.addEventListener('click', this._toggleMenu.bind(this));
        const icon = document.createElement('ha-icon');
        icon.icon = 'mdi:menu';
        btn.appendChild(icon);
        this.shadowRoot.appendChild(btn);
      }
      return;
    }

    // 默认/新页面模式 - 带 HA 顶部工具栏的 iframe 嵌入
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; height: 100%; background: var(--primary-background-color); overflow: hidden; position: relative; }
        :host([narrow]) { width: 100%; position: fixed; }
        .toolbar { display: flex; align-items: center; font-size: 20px; height: var(--header-height); padding: 8px 12px;
          pointer-events: none; background-color: var(--app-header-background-color); font-weight: 400;
          color: var(--app-header-text-color, white); border-bottom: var(--app-header-border-bottom, none); box-sizing: border-box; }
        @media (max-width: 599px) { .toolbar { padding: 4px; } }
        ha-menu-button { pointer-events: auto; }
        .main-title { margin: 0 0 0 24px; line-height: 20px; flex-grow: 1; }
        .content { position: relative; width: 100%; height: calc(100% - 1px - var(--header-height)); }
        iframe { border: none; width: 100%; height: 100%; }
      </style>
      <div class="toolbar">
        <ha-menu-button></ha-menu-button>
        <div class="main-title">${title}</div>
      </div>
      <div class="content">
        <iframe allow="fullscreen" src="/panel_iframe_www/index.html?mode=${mode}&url=${encodeURIComponent(url)}"></iframe>
      </div>
    `;
    this._setupMenuButton();
  }

  /** 设置 ha-menu-button 的属性（Shadow DOM 内需要手动设置） */
  _setupMenuButton() {
    const menuBtn = this.shadowRoot && this.shadowRoot.querySelector('ha-menu-button');
    if (menuBtn) {
      if (this._hass) menuBtn.hass = this._hass;
      if (this._narrow) menuBtn.narrow = this._narrow;
    }
  }
}

// 注册自定义元素
customElements.define('ha-panel_iframe', HaPanelIframe);

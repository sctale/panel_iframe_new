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
  }

  set narrow(narrow) {
    this._narrow = narrow;
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

    // 内置页面
    if (mode == 3) {
      history.replaceState(null, null, url);
      return this._fireEvent('location-changed', { replace: true });
    }

    // 如果HTTPS协议，则打开新页面
    if (location.protocol === 'https:' && url.indexOf('http://') === 0) {
      // 不使用 iframe 嵌入，直接显示链接
      this.shadowRoot.innerHTML = `
        <style>
          :host { display: block; height: 100%; background: var(--primary-background-color); }
          .container { display: flex; align-items: center; justify-content: center; height: 100%; flex-direction: column; }
          .toolbar { display: flex; align-items: center; font-size: 20px; height: var(--header-height); padding: 8px 12px;
            background-color: var(--app-header-background-color); color: var(--app-header-text-color, white);
            border-bottom: var(--app-header-border-bottom, none); box-sizing: border-box; width: 100%; }
          .main-title { margin: 0 0 0 24px; line-height: 20px; flex-grow: 1; }
          a { color: var(--primary-color); font-size: 18px; text-decoration: none; margin-top: 24px; }
          a:hover { text-decoration: underline; }
        </style>
        <div class="toolbar">
          <ha-menu-button .hass="${this._hass}" .narrow="${this._narrow}"></ha-menu-button>
          <div class="main-title">${title}</div>
        </div>
        <div class="container">
          <p>由于安全限制，HTTPS 页面无法嵌入 HTTP 内容</p>
          <a href="${url}" target="_blank" rel="noreferrer">在新标签页打开</a>
        </div>
      `;
      return;
    }

    // 全屏显示
    if (mode == 1) {
      this.shadowRoot.innerHTML = `
        <style>
          :host { display: block; height: 100%; background: var(--primary-background-color); overflow: hidden; position: relative; }
          :host([narrow]) { width: 100%; position: fixed; }
          iframe { border: none; width: 100%; height: 100vh; }
          .nav-button { position: fixed; bottom: 5px; right: 5px; }
        </style>
        <iframe allow="fullscreen" src="${url}"></iframe>
        ${this._narrow ? `
          <ha-icon-button class="nav-button" @click="${this._toggleMenu.bind(this)}">
            <ha-icon icon="mdi:home-assistant"></ha-icon>
          </ha-icon-button>
        ` : ''}
      `;
      return;
    }

    // 默认/新页面模式 - 内置显示
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; height: 100%; background: var(--primary-background-color); overflow: hidden; position: relative; }
        :host([narrow]) { width: 100%; position: fixed; }
        .toolbar { display: flex; align-items: center; font-size: 20px; height: var(--header-height); padding: 8px 12px;
          pointer-events: none; background-color: var(--app-header-background-color); font-weight: 400;
          color: var(--app-header-text-color, white); border-bottom: var(--app-header-border-bottom, none); box-sizing: border-box; }
        @media (max-width: 599px) { .toolbar { padding: 4px; } }
        ha-menu-button, ha-icon-button-arrow-prev, ::slotted([slot="toolbar-icon"]) { pointer-events: auto; }
        .main-title { margin: 0 0 0 24px; line-height: 20px; flex-grow: 1; }
        .content { position: relative; width: 100%; height: calc(100% - 1px - var(--header-height)); }
        iframe { border: none; width: 100%; height: 100%; }
      </style>
      <div class="toolbar">
        <ha-menu-button .hass="${this._hass}" .narrow="${this._narrow}"></ha-menu-button>
        <div class="main-title"><slot name="header">${title}</slot></div>
        <slot name="toolbar-icon"></slot>
      </div>
      <div class="content ha-scrollbar">
        <iframe allow="fullscreen" src="/panel_iframe_www/index.html?mode=${mode}&url=${encodeURIComponent(url)}"></iframe>
      </div>
    `;
  }
}

// 注册自定义元素
customElements.define('ha-panel_iframe', HaPanelIframe);

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { setPassiveTouchGestures, setRootPath } from '@polymer/polymer/lib/utils/settings.js';
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-header-layout/app-header-layout.js';
import '@polymer/app-layout/app-scroll-effects/app-scroll-effects.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/iron-selector/iron-selector.js';
import '@polymer/paper-icon-button/paper-icon-button.js';

setPassiveTouchGestures(true);

setRootPath(MyAppGlobals.rootPath);

class MyApp extends PolymerElement {
  static get template() {
    return html`
      <style is="custom-style">
        :host {
          --app-primary-color: #708C84;
          --app-secondary-color: #9BA685;
          --app-txt-color: #0D0D0D;
          display: block;
        }

        app-drawer-layout:not([narrow]) [drawer-toggle] {
          display: none;
        }

        app-header {
          color: var(--app-txt-color);
          background-color: var(--app-secondary-color);
        }

        app-drawer {
          --app-drawer-content-container: {
          background-color: #B0BEC5;
        }
        }

        .menu {
          color: var(--app-txt-color);
          background-color: var(--app-primary-color);
        }

        .drawer-list {
          margin: 0 20px;
        }

        .drawer-list a {
          display: block;
          padding: 0 16px;
          text-decoration: none;
          color: var(--app-txt-color);
          line-height: 40px;
        }

        .drawer-list a.iron-selected {
          color: var(---app-primary-color);
          font-weight: bold;
        }
        
      </style>

      <app-location route="{{route}}" url-space-regex="^[[rootPath]]"></app-location>
      <app-route route="{{route}}" pattern="[[rootPath]]:page" data="{{routeData}}" tail="{{subroute}}"></app-route>

      <app-drawer-layout fullbleed="" narrow="{{narrow}}">
        <app-drawer id="drawer" slot="drawer" swipe-open="[[narrow]]">
          <app-toolbar class="menu">Menu</app-toolbar>
          <iron-selector selected="[[page]]" attr-for-selected="name" class="drawer-list" role="navigation">
            <a name="el-register" href="[[rootPath]]el-register">Zaloguj się</a>
            <a name="el-look" href="[[rootPath]]el-look">Przejrzyj użytkowników</a>
          </iron-selector>
        </app-drawer>

        <app-header-layout has-scrolling-region="">

          <app-header slot="header" condenses="" reveals="" effects="waterfall">
            <app-toolbar>
              <div main-title="">Aplikacja umożliwiająca rejestrowanie i przeglądanie zarejestrowanych użytkowników</div>
            </app-toolbar>
          </app-header>

          <iron-pages selected="[[page]]" attr-for-selected="name" role="main">
            <el-register name="el-register"></el-register>
            <el-look name="el-look"></el-look>
            <not-found name="not-found"></not-found>
          </iron-pages>
        </app-header-layout>
      </app-drawer-layout>
    `;
  }

  static get properties() {
    return {
      page: {
        type: String,
        reflectToAttribute: true,
        observer: '_pageChanged'
      },
      routeData: Object,
      subroute: Object
    };
  }

  static get observers() {
    return [
      '_routePageChanged(routeData.page)'
    ];
  }

  _routePageChanged(page) {
    if (!page || page == "components") {
      this.page = 'el-register';
    } else if (['el-register', 'el-look'].indexOf(page) !== -1) {
      this.page = page;
    } else {
      this.page = 'not-found';
    }

    if (!this.$.drawer.persistent) {
      this.$.drawer.close();
    }
  }

  _pageChanged(page) {
    switch (page) {
      case 'el-register':
        import('./el-register.js');
        break;
      case 'el-look':
        import('./el-look.js');
        break;
      case 'not-found':
        import('./not-found.js');
        break;
    }
  }
}

window.customElements.define('my-app', MyApp);

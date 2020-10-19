import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';
import '@vaadin/vaadin-grid/vaadin-grid.js';

class Look extends PolymerElement {
  static get template() {
    return html`
      <style include="shared-styles">
        :host {
          display: block;

          padding: 10px;
        }
      </style>

      <div class="card">

      <vaadin-grid id="table" aria-label="Array Data Example" items$="[[items]]" hidden="true">

        <vaadin-grid-column width="50px" flex-grow="0">
          <template class="header">#</template>
          <template>[[index]]</template>
        </vaadin-grid-column>

        <vaadin-grid-column>
          <template class="header">Login</template>
          <template>[[item.login]]</template>
        </vaadin-grid-column>

        <vaadin-grid-column>
          <template class="header">Email</template>
          <template>[[item.email]]</template>
        </vaadin-grid-column>

      </vaadin-grid>

      <div id="unauthenticated" hidden="true">
        <h3>Zaloguj się lub zarejestruj, aby przejrzeć użytkowników :)</h3>
      </div>

      </div>
    `;
  }

  static get properties() {
    return {
      items: {
        type: Array,
      }
    }
  }

  ready(){
    var view = this;
    firebase.auth().onAuthStateChanged(function(user) {
      if(user) {
        view.$.table.hidden = false;
        view.$.unauthenticated.hidden = true;
        var items = [];
        var ref = firebase.database().ref().child("users");
        ref.once("value").then(function(snapshot){
          snapshot.forEach(function(userdataSnapshot){
            var dblogin = userdataSnapshot.child('dblogin').val();
            var dbemail = userdataSnapshot.child('dbemail').val();
            items.push({login: dblogin, email: dbemail});
          });
          view.items = items.sort(view.compareValues("login"));
        });
      }
      else {
        view.$.unauthenticated.hidden = false;
        view.$.table.hidden = true;
      }
    });
    super.ready();
  }

  compareValues(key, order = 'asc') {
    return function innerSort(a, b) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        // property doesn't exist on either object
        return 0;
      }
  
      const varA = (typeof a[key] === 'string')
        ? a[key].toUpperCase() : a[key];
      const varB = (typeof b[key] === 'string')
        ? b[key].toUpperCase() : b[key];
  
      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return (
        (order === 'desc') ? (comparison * -1) : comparison
      );
    };
  }

}

window.customElements.define('el-look', Look);

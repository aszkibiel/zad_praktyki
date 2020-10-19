import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-localstorage/iron-localstorage.js'

class Register extends PolymerElement {
  static get template() {

    return html`
      <style include="shared-styles">
        :host {
          display: block;
          padding: 10px;
        }

        .primary {
          color: #0D0D0D;
          background-color: #B0BEC5;
        }
      </style>

      <div class="card">
        <div id="register" hidden="true">
          <h1>Zarejestruj się</h1>
          <paper-input id="reg_email" type="email" label="Wpisz email"></paper-input>
          <paper-input id="reg_login" label="Wpisz login"></paper-input>
          <paper-input id="reg_password" label="Wpisz hasło" type="password"></paper-input>
          <div class="reg-log-buttons">
            <paper-button raised class="primary" on-tap="postRegister">Zarejestruj się</paper-button>
            <paper-button class="secondary" on-tap="switchMethod">Masz konto? Zaloguj się</paper-button>
          </div>
        </div>
        <div id="login" hidden = "true">
          <h1>Zaloguj się</h1>
          <paper-input id="log_email" type="email" label="Wpisz email"></paper-input>
          <paper-input id="log_password" label="Wpisz hasło" type="password"></paper-input>
          <div class="log-reg-buttons">
            <paper-button raised class="primary" on-tap="postLogin">Zaloguj się</paper-button>
            <paper-button class="secondary" on-tap="switchMethod">Nie masz konta? zarejestruj się</paper-button>
          </div>
        </div>
        <div id="authenticated" hidden="true">
          <h3>Jesteś zalogowany :) Możesz przejrzeć użytkowników</h3>
          <paper-button raised class="primary" on-tap="logout">Wyloguj się</paper-button>
        </div>
      </div>
    `;
  }

  ready(){
    super.ready();
    var view = this;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        view.$.register.hidden = true;
        view.$.login.hidden = true;
        view.$.authenticated.hidden = false;
      }
      else{
        view.$.register.hidden = true;
        view.$.login.hidden = false;
        view.$.authenticated.hidden = true;
      }
    });
  }

  postToFirebase(uid, login, email) {
    var ref = firebase.database().ref();
    var usersData = ref.child('users');
    var userdata = usersData.child(uid);
		userdata.set({
			dblogin: login,
			dbemail: email
		  });
  }

  postRegister() {
    if (this.$.reg_login.value.length < 6) {
      alert('Login powinien zawierać co najmniej 6 znaków!');
    }
    else if (/\s/.test(this.$.reg_login.value)) {
      alert('Login nie powinien zawierać spacji!');
    }
    else if (this.$.reg_password.value.indexOf(' ') >= 0) {
      alert('Hasło nie powinno zawierać spacji!');
    }
    else {
      firebase.auth().createUserWithEmailAndPassword(this.$.reg_email.value, this.$.reg_password.value).catch(function(error) {
        var errorCode = error.code;
        if (errorCode === 'auth/email-already-in-use') {
          alert('Email już istnieje!');
        } else if (errorCode === 'auth/invalid-email') {
          alert("Email jest nieprawidłowy!");
        } else if (errorCode === 'auth/weak-password') {
          alert("Hasło musi składać się z co najmniej 6 znaków!");
        }
      });
      
      var login = this.$.reg_login.value;
      var email = this.$.reg_email.value;
      var view = this;

      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          user.updateProfile({
            displayName: login,
          });
          view.postToFirebase(user.uid, login, email);
        }
      });
    }

  }

  postLogin() {
    firebase.auth().signInWithEmailAndPassword(this.$.log_email.value, this.$.log_password.value).catch(function(error) {
      if(firebase.auth().user){
        this.set('route.path', '/el-look');
      }
      var errorCode = error.code;
      if (errorCode === 'auth/wrong-password') {
        alert('Złe hasło!');
      } else {
        alert("Email jest nieprawidłowy!");
      }
    });
  }

  switchMethod() {
    this.$.login.hidden = !this.$.login.hidden;
    this.$.register.hidden = !this.$.register.hidden;
  }

  logout() {
    firebase.auth().signOut();
  }

}

window.customElements.define('el-register', Register);

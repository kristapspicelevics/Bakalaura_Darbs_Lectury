import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VideoCall from './pages/VideoCall';
import AddLecture from './pages/AddLecture';
import EditLecture from './pages/EditLecture';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import { initializeApp } from 'firebase/app';
import { FCM } from "cordova-plugin-fcm-with-dependecy-updated/ionic";
import { Localization } from './models/Localization';

setupIonicReact();

export const firebaseApp = initializeApp({  
  apiKey: "AIzaSyAS7yJm8tGk_-6gGkf_E3zOo12aPuFlBN4",
  authDomain: "lectury-e7f12.firebaseapp.com",
  projectId: "lectury-e7f12",
  storageBucket: "lectury-e7f12.appspot.com",
  messagingSenderId: "522777359209",
  appId: "1:522777359209:web:a9c5dd5fdec9a05d0c03f8",
  measurementId: "G-45P7XJBWBX"
});

export const languages: Localization[] = [
  {
    locale: "en",
    languageName: "English"
  },
  {
    locale: "lv",
    languageName: "Latviešu"
  },
  {
    locale: "ru",
    languageName: "Русский"
  }
]

// FCM.createNotificationChannel({
//   id: "lectury", // required
//   name: "Lectury Push Message", // required
//   importance: "high", // https://developer.android.com/guide/topics/ui/notifiers/notifications#importance
//   visibility: "public", // https://developer.android.com/training/notify-user/build-notification#lockscreenNotification
//   sound: "alert_sound", // In the "alert_sound" example, the file should located as resources/raw/alert_sound.mp3
//   lights: true, // enable lights for notifications
//   vibration: true // enable vibration for notifications
// });

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/login" component={Login}>
        </Route>
        <Route exact path="/">
          <Redirect to="/login" />
        </Route>
        <Route exact path="/register" component={Register}>
        </Route>
        <Route exact path="/">
          <Redirect to="/register" />
        </Route>
        <Route exact path="/videocall" component={VideoCall}>
        </Route>
        <Route exact path="/">
          <Redirect to="/videocall" />
        </Route>
        <Route exact path="/addlecture" component={AddLecture}>
        </Route>
        <Route exact path="/">
          <Redirect to="/addlecture" />
        </Route>
        <Route exact path="/editlecture" component={EditLecture}>
        </Route>
        <Route exact path="/">
          <Redirect to="/editlecture" />
        </Route>
        <Route exact path="/home" component={Home}>
        </Route>
        <Route exact path="/">
          <Redirect to="/home" />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;

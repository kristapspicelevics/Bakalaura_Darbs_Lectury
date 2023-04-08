import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { Redirect, Route } from 'react-router-dom';
import { IonReactRouter } from '@ionic/react-router';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';

const Home: React.FC = (history) => {

  return (
    <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle size="large">Lectury</IonTitle>
          </IonToolbar>
        </IonHeader>
      <IonContent fullscreen>
        <IonButton routerLink="/register" expand="block">
          Register
        </IonButton>
        <IonButton routerLink="/login" expand="block">
          Login
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Home;

import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonRouterOutlet, setupIonicReact, IonRow, IonGrid, IonCol } from '@ionic/react';
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
      <IonContent fullscreen className='vertical-align-content'>
        <div className="flex-container">
          <IonGrid >
            <IonRow class="ion-justify-content-center">
              <IonCol size="12">
                <IonButton routerLink="/register" expand="block">
                  Register
                </IonButton>
              </IonCol>
            </IonRow>
            <IonRow class="ion-justify-content-center">
              <IonCol size="12">
                <IonButton routerLink="/login" expand="block" color="danger">
                  Login
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>
      </IonContent>
      
    </IonPage>
  );
};

export default Home;

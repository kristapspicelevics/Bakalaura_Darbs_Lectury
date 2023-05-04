import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonRouterOutlet, setupIonicReact, IonRow, IonGrid, IonCol } from '@ionic/react';
import { Redirect, Route } from 'react-router-dom';
import { IonReactRouter } from '@ionic/react-router';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';
import { useTranslation } from 'react-i18next';
import LanguageChoooser from '../components/LanguageChooser';

const Home: React.FC = (history) => {
  const { t, i18n } = useTranslation();

  return (
    
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonRow>
            <IonCol size="8">
              <IonTitle size="large">Lectury</IonTitle>
            </IonCol>
            <IonCol size="4"><LanguageChoooser></LanguageChoooser></IonCol>
          </IonRow>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="container">
          <IonGrid >
            <IonButton routerLink="/register" expand="block" className="ion-margin-top">
              {t("register")}
            </IonButton>

            <IonButton routerLink="/login" expand="block" color="danger" className="ion-margin-top">
              {t("login")}
            </IonButton>
          </IonGrid>
        </div>
      </IonContent>
      
    </IonPage>
  );
};

export default Home;

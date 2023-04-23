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
            <IonCol size="4">
              <IonTitle size="large">Lectury</IonTitle>
            </IonCol>
            <IonCol size="4"></IonCol>
            <IonCol size="4"><LanguageChoooser></LanguageChoooser></IonCol>
          </IonRow>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="container">
          <IonGrid >
            <IonRow class="ion-justify-content-center">
              <IonCol size="12">
                <IonButton routerLink="/register" expand="block">
                  {t("register")}
                </IonButton>
              </IonCol>
            </IonRow>
            <IonRow class="ion-justify-content-center">
              <IonCol size="12">
                <IonButton routerLink="/login" expand="block" color="danger">
                {t("login")} <span className="flag-icon flag-icon-gr flag-icon-squared"></span>
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

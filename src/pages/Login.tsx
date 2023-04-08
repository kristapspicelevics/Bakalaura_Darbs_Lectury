import { FirebaseAuthentication } from '@awesome-cordova-plugins/firebase-authentication';
import { IonButton, IonButtons, IonCheckbox, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonModal, IonPage, IonTitle, IonToolbar, useIonViewDidEnter, useIonViewWillEnter } from '@ionic/react';
import { browserLocalPersistence, getAuth, indexedDBLocalPersistence, inMemoryPersistence, setPersistence } from 'firebase/auth';
import { useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { RouteComponentProps } from 'react-router';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';

const Login: React.FC<RouteComponentProps> = ({ history }) => {
  const auth = getAuth();
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false)
  const [user, loading, error] = useAuthState(auth);
  if (user) {
    history.push('/videocall');
  }

  useIonViewWillEnter(() => {
    setEmail('');
    setPass('');
    setEmailReset('');

  });

  useIonViewDidEnter(() => {
    setEmail('');
    setPass('');
    setEmailReset('');
  });

  const [email, setEmail] = useState<string>('');
  const [emailReset, setEmailReset] = useState<string>('');
  const [pass, setPass] = useState<string>('');

  const emailInputRef = useRef<HTMLIonInputElement>(null);
  const emailResetInputRef = useRef<HTMLIonInputElement>(null);
  const passInputRef = useRef<HTMLIonInputElement>(null);

  let focusedInput : HTMLIonInputElement | null = null;

  // focus input
  const setInputFocus = (reference: HTMLIonInputElement) => {
    console.log(reference);
    reference.setFocus();
    reference.getInputElement()
      .then((input: HTMLInputElement) => {
        input.select();
        focusedInput = reference;
      })
    ;
  }

  const setEmailInput = (e: CustomEvent) => {
    e.preventDefault();
    let element = e.target as HTMLInputElement;
    
    if ( element.value === '' )
    {
      setEmail('');
    }
    else
    {
      setEmail( ( element.value ).toString() ); 
    }
  }

  const setPassInput = (e: CustomEvent) => {
    e.preventDefault();
    let element = e.target as HTMLInputElement;

    if ( element.value === '' )
    {
      setPass('');
    }
    else
    {
      setPass( ( element.value ).toString() );     
    }
  }

  const setEmailResetInput = (e: CustomEvent) => {
    e.preventDefault();
    let element = e.target as HTMLInputElement;
    
    if ( element.value === '' )
    {
      setEmail('');
    }
    else
    {
      setEmail( ( element.value ).toString() ); 
    }
  }

  const login = async() => {
    //const auth = getAuth();
    setPersistence(auth, indexedDBLocalPersistence)
    .then(() => {
      const res = FirebaseAuthentication.signInWithEmailAndPassword(email, pass)

      if (res) {
        console.log("User: " +res);
        history.push('/videocall');
      }
      else {
        console.log(`login failed`);
      };
    })
  }

  const passwordReset = async() => {
    const res = await FirebaseAuthentication.sendPasswordResetEmail(email)

    if (res) {
      console.log("User: " +res);
    }
    else {
      console.log(`reset failed`);
    };
  }
 
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonItem>
          <IonLabel position="floating">Email</IonLabel>
          <IonInput 
            type="email" 
            ref={emailInputRef}
            onIonInput={(ev) => setEmailInput(ev)} 
            value={email}
            ></IonInput>
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Password</IonLabel>
          <IonInput 
            type="password" 
            ref={passInputRef}
            onIonInput={(ev) => setPassInput(ev)} 
            value={pass}
          />
        </IonItem>
        <IonItem lines="none">
          <IonLabel>Remember me</IonLabel>
          <IonCheckbox defaultChecked={true} slot="start" />
        </IonItem>
        <IonButton onClick={() => login()} className="ion-margin-top" type="submit" expand="block">
          Login
        </IonButton>
        <IonButton onClick={() => setIsForgotPasswordModalOpen(true)} className="ion-margin-top" type="submit" expand="block">
          Forgot Password?
        </IonButton>
        <IonButton routerLink="/home" expand="block" className="ion-margin-top">
          Back
        </IonButton>
        <IonModal
          isOpen={
            isForgotPasswordModalOpen
            }
          onDidDismiss={() => setIsForgotPasswordModalOpen(false)}
          >
          <IonHeader>
            <IonToolbar>
              <IonTitle>Forgot Password?</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setIsForgotPasswordModalOpen(false)}><IonIcon icon="closeOutline"></IonIcon></IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonItem>
            <IonLabel position="floating">Username</IonLabel>
            <IonInput 
              type="email" 
              ref={emailResetInputRef}
              onIonInput={(ev) => setEmailResetInput(ev)} 
              value={emailReset}
            ></IonInput>
            </IonItem>
            <IonButton onClick={() => passwordReset()} expand="block" type="submit" className="ion-margin-top">
              Change password
            </IonButton>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Login;


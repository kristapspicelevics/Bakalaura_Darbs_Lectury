import { IonButton, IonCheckbox, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonNote, IonPage, IonSelect, IonSelectOption, IonText, IonTitle, IonToolbar, SelectChangeEventDetail, useIonViewDidEnter, useIonViewWillEnter } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import { FirebaseAuthentication } from '@awesome-cordova-plugins/firebase-authentication';
import {  } from '@awesome-cordova-plugins/core';
import { getFirestore, Firestore, collection, query, getDocs, where, addDoc} from '@firebase/firestore';
import { initializeApp } from "firebase/app"
import {useCollection} from "react-firebase-hooks/firestore";
import { RouteComponentProps, withRouter } from 'react-router';
import './Home.css';
import { useRef, useState } from 'react';
import { Studies } from '../models/Studies';
import { User } from '../models/User';
import { firebaseApp } from '../App';

export let types = ["Student","Teacher"]
export let years = [1,2,3,4,5]

const Register: React.FC<RouteComponentProps> = ({ history }) => {

  const [users, setUsers] = useState<User[]>([]);

  useIonViewWillEnter(() => {
    setName('');
    setEmail('');
    setPass('');
    setPassConfirm('');
    setStudies([]);
    getStudies() 
    setUsers([]);
    getUsers();
    setStudy('');
    setCourse('');
    setType('');
  })

  

  const getStudies = async () => {
    const db = getFirestore(firebaseApp);
    
    const q = query(collection(db, "Studies"));
    studies.length = 0;
    const querySnapshot = await getDocs(q);
    (querySnapshot).forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      
      console.log("Start")
      console.log(studies)
      let data = JSON.stringify(doc.data())
      let jsonData = JSON.parse(data)
      console.log(doc.id, " => ", doc.data());
      console.log(jsonData);
      studies.push({
        id: jsonData.id,
        name: jsonData.name,
        yearCount: jsonData.year_count,
      });

    });

    setStudies(studies.filter((obj, index) => {
      return index === studies.findIndex(o => obj.id === o.id && obj.name === o.name);
    }))
  };
  

  useIonViewDidEnter(() => {
    setName('');
    setEmail('');
    setPass('');
    setPassConfirm('');
    setStudies([]);
  });

  const [isTouched, setIsTouched] = useState(false);
  const [isValid, setIsValid] = useState<boolean>();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [pass, setPass] = useState<string>('');
  const [passConfirm, setPassConfirm] = useState<string>('');
  const [study, setStudy] = useState<string>('');
  const [course, setCourse] = useState<string>('');
  const [type, setType] = useState<string>('');

  const [studies, setStudies] = useState<Studies[]>([]);
  const [curYears, setCurYears] = useState<number[]>([]);

  const [user, setUser] = useState<User>();

  // minute input component reference
  const nameInputRef = useRef<HTMLIonInputElement>(null);
  const emailInputRef = useRef<HTMLIonInputElement>(null);
  const passInputRef = useRef<HTMLIonInputElement>(null);
  const passConfirmInputRef = useRef<HTMLIonInputElement>(null);
  const studyRef = useRef<HTMLIonSelectElement>(null);
  const yearRef = useRef<HTMLIonSelectElement>(null);
  const typeRef = useRef<HTMLIonSelectElement>(null);

  //let curYears: number[] = []
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

 

  const setNameInput = (e: CustomEvent) => {
    console.log(studies)
    e.preventDefault();
    
    let element = e.target as HTMLInputElement;
    
    if ( element.value === '' )
    {
      setName('');
    }
    else
    {
      setName( ( element.value ).toString() ); 
    }
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


  const setPassConfirmInput = (e: CustomEvent) => {
    e.preventDefault();
    let element = e.target as HTMLInputElement;

    if ( element.value === '' )
    {
      setPassConfirm('');
    }
    else
    {
      setPassConfirm( ( element.value ).toString() );     
    }
  }

  const getUsers = async () => {
    const db = getFirestore(firebaseApp);
    users.length = 0
    const q = query(collection(db, "Users"));
    
    const querySnapshot = await getDocs(q);
    (querySnapshot).forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log("User")
      
      let data = JSON.stringify(doc.data())
      let jsonData = JSON.parse(data)
      console.log(doc.id, " => ", doc.data());
      console.log(jsonData);
      console.log(email);
      console.log(jsonData.email);
      console.log(jsonData.type === types[0]);
      //if (email === jsonData.email.toString()){
      users.push({
        id: jsonData.id,
        name: jsonData.name,
        email: jsonData.email,
        study: jsonData.study,
        year: jsonData.year, 
        type: jsonData.type,
      });
        
      //}
    });
    console.log("User courses")
    // courses.studies.forEach({

    // })
    //setCourses(courses.filter(obj => obj.year === users[0].year && obj.studies.filter(s => s === users[0].study)));
    
    
    
    setUsers(users)
  };

  const register = () => {
    if ((pass === passConfirm) && email.match(/^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/))
    {
      let lastId = users.sort((n1,n2) => {
        if (n1.id > n2.id) {
            return 1;
        }
    
        if (n1.id < n2.id) {
            return -1;
        }
    
        return 0;
    }).at(-1)!
      //let users : User
      // const db = getFirestore(firebaseApp);
      // course = {
      //   id: lastId.id + 1,
      //   name: name, 
      //   studies: study, 
      //   year: parseInt(year),
      //   dates: pickedDates,
      //   teacher: users[0].id,
      // }
      // console.log(course)
      let user: User 
      FirebaseAuthentication.createUserWithEmailAndPassword(email, pass)
      const db = getFirestore(firebaseApp);
      if (type === types[0]){
        user = {
          id: lastId.id + 1,
          name: name, 
          email: email,
          study: study, 
          year: parseInt(course), 
          type: type,
        }
      } else {
        user = {
          id: lastId.id + 1,
          name: name, 
          email: email,
          type: type,
        }
      }

 
      addDoc(collection(db, "Users"), user)

      history.push('/login');
    }
  }
  


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Create Account</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="ion-padding">

          <IonItem>
            <IonLabel position="floating">Full name</IonLabel>
            <IonInput 
              type="text" 
              ref={nameInputRef}
              onIonInput={(ev) => setNameInput(ev)} 
              value={name}
              ></IonInput>
          </IonItem>
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
          <IonItem>
            <IonLabel position="floating">Confirm password</IonLabel>
            <IonInput 
              type="password"
              ref={passConfirmInputRef}
              onIonInput={(ev) => setPassConfirmInput(ev)} 
              value={passConfirm}
            />
          </IonItem>
          <IonItem>
            <IonSelect        
              multiple={false}
              interface="action-sheet"
              cancelText={"Cancel"}
              id="course-input"
              name="course-input"
              ref={typeRef}
              placeholder="Type"
              value={type}
              onIonChange={
              (ev:CustomEvent<SelectChangeEventDetail>) => {
                setType(ev.detail.value)
              }

            }
            >
            {types.map((m: string) => (
              <IonSelectOption key={m} value={m}>{m}</IonSelectOption>
            ))}
            </IonSelect>
          </IonItem>
          <IonItem>
          <IonSelect 
            multiple={false}
            interface="action-sheet"
            cancelText={"Cancel"}
            id="study-input"
            name="study-input"
            ref={studyRef}
            placeholder="Study"
            value={study}
            disabled={type !== types[0]}
            onIonChange={
              (ev) => {
                //console.log(ev.detail.value)
                if (ev.detail.value !== null && ev.detail.value !== undefined){
                  console.log(ev.detail.value)
                  let studyName = ev.detail.value
                  setStudy(studyName)
                  console.log(studies)
                  let filtered = studies.filter((s: Studies) => studyName === s.name)
                  console.log(filtered)
                  if (filtered.length > 0) {
                    let yearCount = filtered[0].yearCount
                    console.log(yearCount)
                    console.log(studyName)
                    years = [1,2,3,4,5];
                    years.length = yearCount;
                    setCurYears(years);
                  }
                }
              }

            }
          >
            {studies.map((m: Studies) => (
              <IonSelectOption key={m.id} value={m.name}>{m.name}</IonSelectOption>
            ))}
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonSelect        
              multiple={false}
              interface="action-sheet"
              cancelText={"Cancel"}
              id="course-input"
              name="course-input"
              ref={yearRef}
              placeholder="Course"
              value={course}
              disabled={type !== types[0]}
              onIonChange={
              (ev:CustomEvent<SelectChangeEventDetail>) => {
                setCourse(ev.detail.value)
              }

            }
            >
            {curYears.map((m: number) => (
              <IonSelectOption key={m} value={m}>{m}</IonSelectOption>
            ))}
            </IonSelect>
          </IonItem>
          <IonButton expand="block" type="submit" className="ion-margin-top" onClick={() => register()}>
            Register
          </IonButton>
          <IonButton routerLink="/home" expand="block" className="ion-margin-top" color="danger">
            Back
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Register;

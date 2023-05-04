import { DatetimeChangeEventDetail, IonAlert, IonButton, IonButtons, IonCol, IonContent, IonDatetime, IonFooter, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonMenu, IonMenuButton, IonMenuToggle, IonModal, IonPage, IonRefresher, IonRefresherContent, IonRow, IonSelect, IonSelectOption, IonTitle, IonToolbar, SelectChangeEventDetail, useIonViewWillEnter } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';
import { Jitsi } from 'capacitor-jitsi-meet';
import { FirebaseAuthentication } from '@awesome-cordova-plugins/firebase-authentication';
import { RouteComponentProps } from 'react-router';
import { useRef, useState } from 'react';
import { firebaseApp, languages } from '../App';
import { getFirestore, query, collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { User } from '../models/User';
import { Course } from '../models/Course';
import { add, calendar, closeOutline, documentOutline, exitOutline, timeOutline, trash } from 'ionicons/icons';
import { Studies } from '../models/Studies';
import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic';
import i18next from '../i18n';
import { useTranslation } from 'react-i18next';
import { Localization } from '../models/Localization';

const VideoCall: React.FC<RouteComponentProps> = ({ history }) => {

  const date = useRef<null | HTMLIonDatetimeElement>(null);
  const time = useRef<null | HTMLIonDatetimeElement>(null);
  const endTime = useRef<null | HTMLIonDatetimeElement>(null);

  //let user
  const [user, setUser] = useState<string>('');
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [studies, setStudies] = useState<Studies[]>([]);

  const [currCourse, setCurrCourse] = useState<Course>();

  const [notificationReceived, setNotificationReceived] = useState(false)
  const [showAlert1, setShowAlert1] = useState(false);
  const [textAlert1, settextAlert1] = useState("");
  let nowDate = Date.now()
  
  let years = [1,2,3,4,5]
  const [name, setName] = useState<string>('');
  const [study, setStudy] = useState<string[]>([]);
  const [year, setYear] = useState<string>('');
  const [curYears, setCurYears] = useState<number[]>([]);

  const nameInputRef = useRef<HTMLIonInputElement>(null);
  const studyRef = useRef<HTMLIonSelectElement>(null);
  const yearRef = useRef<HTMLIonSelectElement>(null);

  const [isEditLectureModalOpen, setIsEditLectureModalOpen] = useState(false)
  const [isDateTimeModalOpen, setIsDateTimeModalOpen] = useState(false)

  const [pickedStartDate, setPickedStartDate] = useState<string>('');
  const [pickedEndDate, setPickedEndDate] = useState<string>('');
  const [courseDate, setCourseDate] = useState<string[]>([]);
  const [dateTimes, setDateTimes] = useState<string[]>([]);
  const [pickedDates, setPickedDates] = useState<string[]>([]);

  const [language, setLanguage] = useState(i18next.language);
  const [isLangListModalOpen, setIsLangListModalOpen] = useState(false)
  const [currLanguage, setcurrLanguage] = useState<Localization>();
  const { t, i18n } = useTranslation();
  let types = [t("student"), t("teacher")]
  function changeLang(lng: string){
    i18n.changeLanguage(lng);
    setLanguage(lng)
    setIsLangListModalOpen(false)
  };

  function setCurrLang(lng: string){
    i18n.changeLanguage(lng);
    setLanguage(lng)
  };

  useIonViewWillEnter(() => {
    nowDate = Date.now()
    setUsers([]);
    setCourses([]);
    setStudies([]);
    getCourses()
    getStudies()
    FirebaseAuthentication.getCurrentUser().then((res) => {
      console.log(res.email)
      setUser(res.email)
      getUsers(res.email)
      
      //setCurrUsers(users.filter((u: User) => user === u.email))
    });
    //console.log(user.email)
  });

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

  const reset = () => {
    courseDate.length = 0
    setPickedStartDate("")
    setPickedEndDate("")
    setPickedDates([])

  }
  // const cancel = () => {
  //   datetime.current?.cancel();
  // }
  const addDate = () => {
    setCourseDate(courseDate.sort((n1,n2) => {
      if (n1 > n2) {
          return 1;
      }
  
      if (n1 < n2) {
          return -1;
      }
  
      return 0;
    }))
    console.log(courseDate)
    const timeStart = pickedStartDate.split("T")[1].split("+")[0]
    const timeEnd = pickedEndDate.split("T")[1].split("+")[0]
    //console.log(time)
    courseDate.forEach(element => {
      console.log(element + " " + timeStart)
      console.log(element + " " + timeEnd)
      dateTimes.push(element.split("T")[0] + ";" + timeStart+";" + timeEnd)
      //console.log(Date.parse(pickedDate))
    })
    console.log("Date:")
    console.log(dateTimes)
    setPickedDates(dateTimes)
    setIsDateTimeModalOpen(false)
  }

  const onRefresh = () => {
    getCourses()
    getUsers(user)
  }

  const getUsers = async (email: string) => {
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
      console.log(jsonData.type === 0);
      if (email === jsonData.email.toString()){
        if (jsonData.type === 0){
          users.push({
            id: jsonData.id,
            name: jsonData.name,
            email: jsonData.email,
            study: jsonData.study,
            year: jsonData.year, 
            type: jsonData.type,
          });
        } else {
          users.push({
            id: jsonData.id,
            name: jsonData.name,
            email: jsonData.email,
            type: jsonData.type,
          });
        }
      } 
    });
    console.log("User courses")
    console.log(users[0].type === 1)
    if (users[0].type === 0) {
      setCourses(courses.filter(obj => obj.year === users[0].year));
      console.log("Student")
    } else {
      console.log("Teacher")
      setCourses(courses.filter(obj => obj.teacher === users[0].id));
    }
    console.log(courses.filter(obj => obj.teacher === users[0].id))
    // courses.studies.forEach({

    // })
    //setCourses(courses.filter(obj => obj.year === users[0].year && obj.studies.filter(s => s === users[0].study)));
    
    
    
    setUsers(users.filter((obj, index) => {
      return index === users.findIndex(o => obj.email === o.email);
    }))
  };

  const getCourses = async () => {
    const db = getFirestore(firebaseApp);
    const q = query(collection(db, "Courses"));
    courses.length = 0
    const querySnapshot = await getDocs(q);
    (querySnapshot).forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log("Course")
      
      let data = JSON.stringify(doc.data())
      let jsonData = JSON.parse(data)
      console.log(doc.id, " => ", doc.data());
      console.log(jsonData);
      courses.push({
        id: jsonData.id,
        name: jsonData.name,
        studies: jsonData.studies,
        year: jsonData.year,
        dates: jsonData.dates ? jsonData.dates : [],
        teacher: jsonData.teacher,
        nearestDate: jsonData.dates ? jsonData.dates.find(d => Date.parse(d.split(";")[0] + " " + d.split(";")[2]) > nowDate) : "",
      });
      
    });
    setCourses(courses.sort((a, b) => {
      const nameA = a.nearestDate!;
      const nameB = b.nearestDate!;
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
    
      // names must be equal
      return 0;
    }))
    console.log(courses.filter(obj => obj.dates.find(d => Date.parse(d.split(";")[0] + " " + d.split(";")[2]) > nowDate)))
  };

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

  console.log(users)
  console.log(courses)

  const joinMeeting = async (subject: string) => {
    console.log("test")
    const result = await Jitsi.joinConference({
        // required parameters
        roomName: subject, // room identifier for the conference
        url: 'https://meet.jit.si', // endpoint of the Jitsi Meet video bridge
    
        // recommended settings for production build. see full list of featureFlags in the official Jitsi Meet SDK documentation
        featureFlags: {
            'prejoinpage.enabled': false, // go straight to the meeting and do not show the pre-join page
            'recording.enabled': false, // disable as it requires Dropbox integration
            'live-streaming.enabled': false, // 'sign in on Google' button not yet functional
            'android.screensharing.enabled': false, // experimental feature, not fully production ready
        },
    
        // optional parameters
        subject: subject, // name of the video room
        displayName: users[0].email, // user's display name
        email: users[0].email, // user's email
        startWithAudioMuted: true, // start with audio muted, default: false
        startWithVideoMuted: true, // start with video muted, default: false
        chatEnabled: false, // enable Chat feature, default: true
        inviteEnabled: false, // enable Invitation feature, default: true
        
        // advanced parameters (optional)
        configOverrides: { 'p2p.enabled': false }, // see list of config overrides in the official Jitsi Meet SDK documentation
    });
    console.log(result) //
  }

  const logOut = () => {
    FirebaseAuthentication.signOut()
    history.push('/login');
  }

  if (!notificationReceived){
    setNotificationReceived(true)
    FCM.onNotification().subscribe(data => {

      console.log('onNotification received event with: ', data);
      if(data.wasTapped){
        console.log("Received in background");
      } else {
        console.log("Received in foreground");
        settextAlert1("Paziņojums "+ "<br>"+ data)
        setShowAlert1(true)
      };
    });

    FCM.getInitialPushPayload().then((data) => {
      if (data){
        if(data.wasTapped) {
          console.log("Received FCM when app is closed -> ", JSON.stringify(data));
          // call your function to handle the data
        }  
      }
      

    })
  }

  const dismissAlert = () => {
    setShowAlert1(false)
    setNotificationReceived(false)
  }

  const addLecture = () => {
    history.push('/addlecture');
  }

  const openModal = (m: Course) => {
    console.log(m)
    setCurrCourse(m)
    setIsEditLectureModalOpen(true)
  }

  const openDateModal = (m: Course) =>{
    // console.log(m)
    // setCurrCourse(m)
    setIsDateTimeModalOpen(true)
    courseDate.length = 0
    setCourseDate([])
    setPickedStartDate("")
    setPickedEndDate("")
  }

  const updateLecture = async (m: Course) => {
    console.log("Current course")
    console.log(m.id)
    const db = getFirestore(firebaseApp);
    const q = query(collection(db, "Courses"));
    //courses.length = 0
    let docId = ""
    let newCourse: Course
    const querySnapshot = await getDocs(q);
    (querySnapshot).forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log("Course")
      
      let data = JSON.stringify(doc.data())
      let jsonData = JSON.parse(data)
      console.log(doc.id, " => ", doc.data());
      console.log(jsonData);
      if (jsonData.id === m.id){
        docId = doc.id
        console.log(docId)

      }
      // courses.push({
      //   id: jsonData.id,
      //   name: jsonData.name,
      //   studies: jsonData.studies,
      //   year: jsonData.year,
      //   dates: jsonData.dates ? jsonData.dates : [],
      //   teacher: jsonData.teacher,
      //   nearestDate: jsonData.dates ? jsonData.dates.find(d => Date.parse(d.split(";")[0] + " " + d.split(";")[2]) > nowDate) : "",
      // });
      
    });
    console.log(pickedDates)
    newCourse = {
      id: m.id,
      name: name,
      studies: study,
      year: parseInt(year),
      dates: pickedDates,
      teacher: m.teacher,
    }
    console.log(newCourse)
    const docRef = doc( db, "Courses", docId);
    await updateDoc(docRef, {
      id: m.id,
      name: name,
      studies: study,
      year: parseInt(year),
      dates: pickedDates,
      teacher: m.teacher,
    })
    setUsers([]);
    setCourses([]);
    getCourses()
    getUsers(user)
    setIsEditLectureModalOpen(false)
  }

  const removeDate = (d: string) => {
    console.log(d)
    // let index = dateTimes.indexOf(d);
    // console.log(index)
    // if (index !== -1) {
    //   dateTimes.splice(index, 1);
    //   setDateTimes(dateTimes.filter(f => f !== d))
    // }
    setDateTimes(dateTimes.filter(f => f !== d))
    console.log(dateTimes)
  }

  const editLecture = (m: Course) => {
    history.push('/editlecture');
  }

  return (
    <>
      <IonMenu contentId="main-content">
        <IonHeader>
          <IonToolbar>
            <IonGrid>
            <IonRow>
              <IonCol size="8">
              <IonTitle>{t("profile")}</IonTitle>
              </IonCol>
              <IonCol size="4">
                <IonMenuButton onClick={() => logOut()}>
                  <IonIcon icon={exitOutline}></IonIcon>
                </IonMenuButton>
              </IonCol>
            </IonRow>
            </IonGrid>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonLabel>{t("email")}: {users[0]?.email}<br/></IonLabel>
          <IonLabel>{t("fullname")}: {users[0]?.name}<br/></IonLabel>
          <IonLabel>{t("role")}: {types[users[0]?.type]}<br/></IonLabel>
          { users[0]?.type === 0 &&
            <>
              <IonLabel>{t("study")}: {users[0]?.study}<br/></IonLabel>
              <IonLabel>{t("year")}: {users[0]?.year}<br/></IonLabel>
            </>
          }
          <IonItem                     
            id="languages"                    
            button={true} 
            onClick={() => setIsLangListModalOpen(true)}
          >
            <IonLabel>
              {t("language")}
            </IonLabel>
            
          </IonItem>
        </IonContent>
      </IonMenu>
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>{t("lecture")}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonList>
            {courses?.map((m: Course) => (
              <IonGrid>
                                        
              {(m.nearestDate !== undefined) &&
                <>
                <IonRow>
                  <IonCol size="10">
                    <IonItem
                      button
                      disabled={Date.parse(m.nearestDate?.split(";")[0] + " " + m.nearestDate?.split(";")[1]) > nowDate}
                      onClick={() => joinMeeting(m.name)}
                    >
                      <IonGrid>
                        <IonRow>
                          <IonCol size="12">
                            <IonLabel>{m.name}<br/></IonLabel>
                          </IonCol>
                          
                        </IonRow>

                            <IonRow>
                              <IonCol size="12">
                                
                                <IonLabel><IonIcon icon={calendar}></IonIcon> {m.nearestDate.split(";")[0]}<br/></IonLabel>
                              </IonCol>
                              <IonCol size="12">
                                
                                <IonLabel><IonIcon icon={timeOutline}></IonIcon> {m.nearestDate.split(";")[1]} - {m.nearestDate.split(";")[2]}<br/></IonLabel>
                              </IonCol>
                            </IonRow>                
                      </IonGrid>
                    </IonItem>
                  </IonCol>
                  <IonCol size="2">
                    <IonButton
                      expand="block"
                      onClick={() => openModal(m)}
                    >
                      <IonIcon icon={documentOutline}></IonIcon>
                    </IonButton>
                  </IonCol>
                  
                </IonRow>
                </>
                }
                <IonModal
                  isOpen={
                    isEditLectureModalOpen
                    }
                  onDidDismiss={() => setIsEditLectureModalOpen(false)}
                >
                <IonHeader>
                  <IonToolbar>
                    <IonTitle>{currCourse?.name}</IonTitle>
                    <IonButtons slot="end">
                      <IonButton onClick={() => setIsEditLectureModalOpen(false)}><IonIcon icon={closeOutline}></IonIcon></IonButton>
                    </IonButtons>
                  </IonToolbar>
                </IonHeader>
                <IonContent>
                  <div className="container">
                  <IonItem>
                    <IonLabel position="floating">{t("lecture_name")}</IonLabel>
                    <IonInput 
                      type="text" 
                      ref={nameInputRef}
                      onIonInput={(ev) => setNameInput(ev)} 
                      value={name}
                      ></IonInput>
                  </IonItem>
                  <IonItem>    
                    <IonSelect 
                      multiple={true}
                      interface="action-sheet"
                      cancelText={"Cancel"}
                      id="study-input"
                      name="study-input"
                      ref={studyRef}
                      placeholder={t("study") as string}
                      disabled={name === ''}
                      value={study}
                      onIonChange={
                        (ev) => {
                          //console.log(ev.detail.value)
                          if (ev.detail.value !== null && ev.detail.value !== undefined){
                            console.log(ev.detail.value)
                            let studyName = ev.detail.value
                            setStudy(studyName)
                            console.log(studies)
                            let filtered = studies.filter((s: Studies) => studyName.includes(s.name))
                            console.log(filtered)
                            let min = Math.min(...filtered.map(item => item.yearCount))
                            let minYear = filtered.filter(item => item.yearCount === min)
                            years = [1,2,3,4,5];
                            years.length = minYear[0].yearCount;
                            // if (filtered.length > 0) {
                            //   let yearCount = filtered[0].yearCount
                            //   console.log(yearCount)
                            //   console.log(studyName)
                            //   years = [1,2,3,4,5];
                            //   years.length = yearCount;
                            setCurYears(years);
                            // }
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
                      placeholder={t("year") as string}
                      disabled={study.length === 0}
                      value={year}
                      onIonChange={
                        (ev:CustomEvent<SelectChangeEventDetail>) => {
                          setYear(ev.detail.value)
                        }
                      }
                    >
                    {curYears.map((m: number) => (
                      <IonSelectOption key={m} value={m}>{m}</IonSelectOption>
                    ))}
                    </IonSelect>
                  </IonItem>
                  <IonItem button onClick={() => openDateModal(m)} className="ion-margin-top" type="submit">
                    <IonLabel>{t("pick_dates")}</IonLabel>
                  </IonItem>
                  <IonItem button onClick={() => reset()} className="ion-margin-top" type="submit">
                    <IonLabel>{t("clear")}</IonLabel>
                  </IonItem>
                  <IonItem>
                    <IonList>
                      {dateTimes?.map((m: string) => (
                        <IonGrid>
                          <IonRow>
                            <IonCol size="9">
                              <IonItem>
                                <IonRow>
                                  <IonCol size="12">
                                    
                                    <IonLabel><IonIcon icon={calendar}></IonIcon> {m.split(";")[0]}<br/></IonLabel>
                                  </IonCol>
                                  <IonCol size="12">
                                    
                                    <IonLabel><IonIcon icon={timeOutline}></IonIcon> {m.split(";")[1]} - {m.split(";")[2]}<br/></IonLabel>
                                  </IonCol>
                                </IonRow>
                              </IonItem>
                            </IonCol>
                            <IonCol size="3">
                              <IonButton 
                                expand="block"
                                onClick={() => removeDate(m)}
                                color="danger"
                              >
                                <IonIcon icon={trash}></IonIcon>
                              </IonButton>
                            </IonCol>
                          </IonRow>
                        </IonGrid>
                      ))}
                    </IonList> 
                  </IonItem> 
                </div>
                </IonContent>
                  <IonFooter>
                    <IonGrid>
                      <IonRow>
                        <IonCol size="9">
                        </IonCol>
                        <IonCol size="3">
                          <IonButton
                            expand="block"
                            disabled={study.length === 0 || name === '' || year === ''}
                            onClick={() => updateLecture(currCourse!)}
                          >
                            <IonIcon icon={add}></IonIcon>
                          </IonButton>
                        </IonCol>
                      </IonRow>
                    </IonGrid>
                  </IonFooter>

                </IonModal>
                <IonModal
                  isOpen={
                    isDateTimeModalOpen
                    }
                  onDidDismiss={() => setIsDateTimeModalOpen(false)}
                  >
                  <IonHeader>
                    <IonToolbar>
                      <IonTitle>Pick Date</IonTitle>
                      <IonButtons slot="end">
                        <IonButton onClick={() => setIsDateTimeModalOpen(false)}><IonIcon icon={closeOutline}></IonIcon></IonButton>
                      </IonButtons>
                    </IonToolbar>
                  </IonHeader>
                  <IonContent fullscreen>
                    <IonRow>
                      <IonCol size="1">
                      </IonCol>
                      <IonCol size="10" className='ion-justify-content-center'>
                        <IonDatetime
                          className='ion-justify-content-center'
                          multiple={true}
                          ref={date}
                          inputMode='none'
                          firstDayOfWeek={1}
                          presentation="date"
                          onIonChange={(ev:CustomEvent<DatetimeChangeEventDetail>) => {
                            if (ev.detail.value !== undefined && ev.detail.value !== null){
                              console.log(ev.detail.value)
                              //setCourseDate(ev.detail.value.toString().split(","))
                              setCourseDate(ev.detail.value as string[])
                            }
                            //setCourseDate(ev.detail.value)
                          }}
                          value={courseDate}
                        >
                        </IonDatetime>

                      </IonCol>
                      <IonCol size="1">
                      </IonCol>
                    </IonRow>
                    <IonItem>
                      <IonCol size="6">
                        <IonLabel>{t("start_time")}:</IonLabel>
                        <IonDatetime
                          className='ion-justify-content-center'
                          //multiple={true}
                          inputMode='none'
                          ref={time}
                          presentation="time"
                          onIonChange={(ev:CustomEvent<DatetimeChangeEventDetail>) => {
                            if (ev.detail.value !== undefined && ev.detail.value !== null){
                              console.log(ev.detail.value)
                              //const date = ev.detail.value?.toString().split("T")[0];
                              //formattedString = formattedString.replaceAll(',', ':')
                              //console.log(new Date(date).getHours()+":"+new Date(date).getMinutes().toString()+":00");
                              setPickedStartDate(ev.detail.value?.toString())
                            }

                            //setCourseDate(ev.detail.value)
                          }}
                          value={pickedStartDate}
                        >
                        </IonDatetime>
                      
                      </IonCol>
                      <IonCol size="6">
                        <IonLabel>{t("end_time")}:</IonLabel>
                        <IonDatetime
                          className='ion-justify-content-center'
                          //multiple={true}
                          inputMode='none'
                          ref={endTime}
                          presentation="time"
                          onIonChange={(ev:CustomEvent<DatetimeChangeEventDetail>) => {
                            if (ev.detail.value !== undefined && ev.detail.value !== null){
                              console.log(ev.detail.value)
                              //const date = ev.detail.value?.toString().split("T")[0];
                              //formattedString = formattedString.replaceAll(',', ':')
                              //console.log(new Date(date).getHours()+":"+new Date(date).getMinutes().toString()+":00");
                              setPickedEndDate(ev.detail.value?.toString())
                            }

                            //setCourseDate(ev.detail.value)
                          }}
                          value={pickedEndDate}
                        >
                        </IonDatetime>
                      
                      </IonCol>
                    </IonItem>
                  </IonContent>
                  <IonFooter>
                    <IonGrid>
                      <IonRow>
                        <IonCol size="9">
                        </IonCol>
                        <IonCol size="3">
                          <IonButton
                            expand="block"
                            disabled={courseDate.length === 0}
                            onClick={addDate}
                            color="success"
                          >
                            <IonIcon icon={add}></IonIcon>
                          </IonButton>
                        </IonCol>
                      </IonRow>
                    </IonGrid>
                  </IonFooter>
                </IonModal>
              </IonGrid>
              
            ))}
          </IonList>  
        </IonContent>
        { users[0]?.type === 1 &&
          <IonFooter>
            <IonRow>
              <IonCol size="9">
              </IonCol>
              <IonCol size="3">
                <IonButton
                  expand="block"
                  onClick={addLecture}
                >
                  <IonIcon icon={add}></IonIcon>
                </IonButton>
              </IonCol>
            </IonRow>
          </IonFooter>
        }
          <IonModal
            id="lang-modal"
            isOpen={
              isLangListModalOpen
            }
            onWillPresent={() => setCurrLang(i18n.language)}
          >
            <IonHeader>
              <IonToolbar>
                <IonTitle>{t("language")}</IonTitle>
                <IonButtons slot="end">
                  <IonButton id="modal-lang-close" onClick={() => setIsLangListModalOpen(false)}><IonIcon icon={ closeOutline }></IonIcon></IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent>
            { (languages !== null
            && 

                <IonList id="lang-list">
                  {
                    (currLanguage
                      &&
                      <IonItem                     
                        key={currLanguage?.locale} 
                        button={false} 
                        color='dark'
                        className='opacity'
                      >
                        <IonLabel>
                          <h5>{currLanguage?.languageName} ({currLanguage?.locale})</h5>
                        </IonLabel>
                      </IonItem>
                    )
                  }

                  {languages?.map(
                    lng => (
                      lng !== currLanguage &&
                      <IonItem
                        id={lng.locale}                     
                        key={lng.locale} 
                        button={true} 
                        onClick={() => changeLang(lng.locale)}
                      >
                        <IonLabel>
                          <h5>{lng.languageName} ({lng.locale})</h5>
                        </IonLabel>
                      </IonItem>
                    )
                  )
                }
                </IonList>
              )
            }
          </IonContent>
        </IonModal>
        <IonAlert        
          isOpen={showAlert1}
          onDidDismiss={() => dismissAlert()}
          message={textAlert1}
          buttons={[
            {
              text: 'Labi',
              handler: () => {
                dismissAlert()
              }
            }
          ]}
        />
      </IonPage>
    </>
  );
};

export default VideoCall;

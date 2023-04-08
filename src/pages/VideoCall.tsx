import { DatetimeChangeEventDetail, IonAlert, IonButton, IonButtons, IonCol, IonContent, IonDatetime, IonFooter, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonMenu, IonMenuButton, IonMenuToggle, IonModal, IonPage, IonRefresher, IonRefresherContent, IonRow, IonSelect, IonSelectOption, IonTitle, IonToolbar, SelectChangeEventDetail, useIonViewWillEnter } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';
import { Jitsi } from 'capacitor-jitsi-meet';
import { FirebaseAuthentication } from '@awesome-cordova-plugins/firebase-authentication';
import { RouteComponentProps } from 'react-router';
import { useRef, useState } from 'react';
import { firebaseApp } from '../App';
import { getFirestore, query, collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { User } from '../models/User';
import { Course } from '../models/Course';
import { add, calendar, closeOutline, documentOutline, exitOutline, timeOutline } from 'ionicons/icons';
import { types } from './Register';
import { Studies } from '../models/Studies';
import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic';

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
  let dateTimes : string[] = [];
  const [pickedDates, setPickedDates] = useState<string[]>([]);

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
      dateTimes.push(element + ";" + timeStart+";" + timeEnd)
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
      console.log(jsonData.type === types[0]);
      if (email === jsonData.email.toString()){
        if (jsonData.type === types[0]){
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
    console.log(users[0].type === types[1])
    if (users[0].type === types[0]) {
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
    setCourses(courses.filter((obj, index) => {
      return index === courses.findIndex(o => obj.id === o.id);
    }))
    console.log(courses.filter(obj => obj.dates.find(d => Date.parse(d.split(";")[0] + " " + d.split(";")[2]) > nowDate)))
    console.log(courses.filter(obj => obj.teacher === 5))
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
              <IonTitle>Profile</IonTitle>
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
          <IonLabel>Email: {users[0]?.email}<br/></IonLabel>
          <IonLabel>Name: {users[0]?.name}<br/></IonLabel>
          { users[0]?.type === types[0] &&
            <>
              <IonLabel>Study: {users[0]?.study}<br/></IonLabel>
              <IonLabel>Year: {users[0]?.year}<br/></IonLabel>
            </>
          }
        </IonContent>
      </IonMenu>
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>Videocall</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList>
            {courses?.map((m: Course) => (
              <IonGrid>
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
                        
                          {(m.nearestDate !== "" && m.nearestDate !== undefined) &&
                            <>
                            <IonRow>
                              <IonCol size="12">
                                
                                <IonLabel><IonIcon icon={calendar}></IonIcon> {m.nearestDate.split(";")[0]}<br/></IonLabel>
                              </IonCol>
                              <IonCol size="12">
                                
                                <IonLabel><IonIcon icon={timeOutline}></IonIcon> {m.nearestDate.split(";")[1]} - {m.nearestDate.split(";")[2]}<br/></IonLabel>
                              </IonCol>
                            </IonRow>
                           </>
                          }
                       
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
                <IonModal
                  isOpen={
                    isEditLectureModalOpen
                    }
                  onDidDismiss={() => setIsEditLectureModalOpen(false)}
                >
                <IonHeader>
                  <IonToolbar>
                      <IonButtons slot="end">
                        <IonButton onClick={() => setIsEditLectureModalOpen(false)}><IonIcon icon={closeOutline}></IonIcon></IonButton>
                      </IonButtons>
                  </IonToolbar>
                </IonHeader>
                <IonContent>
                  <IonItem>
                    <IonLabel position="floating">Lecture name</IonLabel>
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
                      placeholder="Study"
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
                      placeholder="Year"
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
                    <IonLabel>Pick date</IonLabel>
                  </IonItem>
                  <IonItem button onClick={() => reset()} className="ion-margin-top" type="submit">
                    <IonLabel>Clear</IonLabel>
                  </IonItem>
                  <IonItem>
                    <IonList>
                      {pickedDates?.map((m: string) => (
                        <IonLabel>{m}</IonLabel>
                      ))}
                    </IonList> 
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
                            disabled={study.length === 0 || name === '' || year === ''}
                            onClick={() => updateLecture(currCourse!)}
                          >
                            {currCourse?.id}
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
                    <IonItem>
                      <IonCol size="12">
                      <IonDatetime
                        className='ion-justify-content-center'
                        multiple={true}
                        ref={date}
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
                      <IonLabel>{courseDate}</IonLabel>
                      </IonCol>
                    </IonItem>
                    <IonItem>
                      <IonCol size="6">
                        <IonLabel>Start time:</IonLabel>
                        <IonDatetime
                          className='ion-justify-content-center'
                          //multiple={true}
                          
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
                        <IonLabel>End time:</IonLabel>
                        <IonDatetime
                          className='ion-justify-content-center'
                          //multiple={true}
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
        { users[0]?.type === types[1] &&
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
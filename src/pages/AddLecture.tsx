import { DatetimeChangeEventDetail, IonAlert, IonButton, IonButtons, IonCol, IonContent, IonDatetime, IonFooter, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonMenu, IonMenuButton, IonMenuToggle, IonModal, IonPage, IonRefresher, IonRefresherContent, IonRow, IonSelect, IonSelectOption, IonTitle, IonToolbar, SelectChangeEventDetail, useIonViewWillEnter } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';
import { RouteComponentProps } from 'react-router';
import { useRef, useState } from 'react';
import { firebaseApp } from '../App';
import { getFirestore, query, collection, getDocs, addDoc } from 'firebase/firestore';
import { User } from '../models/User';
import { Course } from '../models/Course';
import { add, arrowBack, calendar, closeOutline, exitOutline, timeOutline, timer, trash } from 'ionicons/icons';
import { types } from './Register';
import { Studies } from '../models/Studies';
import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic';
import { format, parseISO } from 'date-fns';
import { FirebaseAuthentication } from '@awesome-cordova-plugins/firebase-authentication';

const AddLecture: React.FC<RouteComponentProps> = ({ history }) => {

  interface DateTime {
    date: string;
    time: string;
}

  const date = useRef<null | HTMLIonDatetimeElement>(null);
  const time = useRef<null | HTMLIonDatetimeElement>(null);
  const endTime = useRef<null | HTMLIonDatetimeElement>(null);

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

  //let user
  const [name, setName] = useState<string>('');
  const [study, setStudy] = useState<string[]>([]);
  const [year, setYear] = useState<string>('');
  const [pickedStartDate, setPickedStartDate] = useState<string>('');
  const [pickedEndDate, setPickedEndDate] = useState<string>('');
  const [courseDate, setCourseDate] = useState<string[]>([]);
  //let dateTimes : string[] = [];
  const [dateTimes, setDateTimes] = useState<string[]>([]);
  const [pickedDates, setPickedDates] = useState<string[]>([]);


  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [studies, setStudies] = useState<Studies[]>([]);
  const [curYears, setCurYears] = useState<number[]>([]);

  let years = [1,2,3,4,5]

  const [showAlert1, setShowAlert1] = useState(false);
  const [textAlert1, settextAlert1] = useState("");

  const nameInputRef = useRef<HTMLIonInputElement>(null);
  const studyRef = useRef<HTMLIonSelectElement>(null);
  const yearRef = useRef<HTMLIonSelectElement>(null);

  const [isDateTimeModalOpen, setIsDateTimeModalOpen] = useState(false)

  useIonViewWillEnter(() => {
    setUsers([]);
    setCourses([]);
    setStudies([]);
    getCourses()
    getStudies()
    FirebaseAuthentication.getCurrentUser().then((res) => {
      // console.log(res.email)
      // setUser(res.email)
      getUsers(res.email)
      
      //setCurrUsers(users.filter((u: User) => user === u.email))
    });
    //console.log(user.email)
  });

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
        users.push({
          id: jsonData.id,
          name: jsonData.name,
          email: jsonData.email,
          study: jsonData.study,
          year: jsonData.year, 
          type: jsonData.type,
        });
        
      }
    });
    // console.log("User courses")
    // console.log(courses.filter(obj => obj.year === users[0].year && obj.studies.filter(s => s === users[0].study)))
    // setCourses(courses.filter(obj => obj.year === users[0].year));
    // courses.studies.forEach({

    // })
    //setCourses(courses.filter(obj => obj.year === users[0].year && obj.studies.filter(s => s === users[0].study)));
    
    
    
    setUsers(users.filter((obj, index) => {
      return index === users.findIndex(o => obj.email === o.email);
    }))
  };

  const addLecture = () => {
    let lastId = courses.sort((n1,n2) => {
      if (n1.id > n2.id) {
          return 1;
      }
  
      if (n1.id < n2.id) {
          return -1;
      }
  
      return 0;
  }).at(-1)!
    let course : Course
    const db = getFirestore(firebaseApp);
    course = {
      id: lastId.id + 1,
      name: name, 
      studies: study, 
      year: parseInt(year),
      dates: pickedDates,
      teacher: users[0].id,
    }
    console.log(course)

    addDoc(collection(db, "Courses"), course)
    history.push('/videocall');
    
  }

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
        dates: jsonData.dates,
        teacher: jsonData.teacher,
      });
      
    });
    setCourses(courses.filter((obj, index) => {
      return index === courses.findIndex(o => obj.id === o.id);
      }).sort((n1,n2) => {
        if (n1.id > n2.id) {
            return 1;
        }
    
        if (n1.id < n2.id) {
            return -1;
        }
    
        return 0;
    }))
    console.log(courses)
  };

  console.log(users)
  console.log(courses)

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

  const goBack = () => {
    history.goBack();
  }
  
  const openModal = () =>{
    setIsDateTimeModalOpen(true)
    //courseDate.length = 0
    setCourseDate([])
    setPickedStartDate("")
    setPickedEndDate("")
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

  return (
    <>
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Add Lecture</IonTitle>
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
          <IonItem button onClick={() => openModal()} className="ion-margin-top" type="submit">
            <IonLabel>Pick date</IonLabel>
          </IonItem>
          <IonItem button onClick={() => reset()} className="ion-margin-top" type="submit">
            <IonLabel>Clear</IonLabel>
          </IonItem>
          
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
          
        </IonContent>
          <IonFooter>
            <IonGrid>
              <IonRow>
                <IonCol size="3">
                  <IonButton
                    expand="block"
                    onClick={goBack}
                    color="danger"
                  >
                    <IonIcon icon={arrowBack}></IonIcon>
                  </IonButton>
                </IonCol>
                <IonCol size="6">
                </IonCol>
                <IonCol size="3">
                  <IonButton
                    expand="block"
                    disabled={study.length === 0 || name === '' || year === ''}
                    onClick={addLecture}
                    color="success"
                  >
                    <IonIcon icon={add}></IonIcon>
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonFooter>
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
                    color="success"
                  >
                    <IonIcon icon={add}></IonIcon>
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonFooter>
        </IonModal>
      </IonPage>
    </>
  );
};

export default AddLecture;

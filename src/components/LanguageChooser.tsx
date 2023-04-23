import { IonSelect, IonSelectOption } from '@ionic/react';
import './ExploreContainer.css';
import { Localization } from '../models/Localization';
import { languages } from '../App';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from 'react';
import i18next from '../i18n';
import "/node_modules/flag-icons/css/flag-icons.min.css";

interface ContainerProps { }

const LanguageChoooser: React.FC<ContainerProps> = () => {
  const langRef = useRef<HTMLIonSelectElement>(null);

  const [language, setLanguage] = useState(i18next.language);
  const [languageName, setLanguageName] = useState<Localization>();
  const { t, i18n } = useTranslation();

  function changeLang(lng: string){
    i18n.changeLanguage(lng);
  };
  
  useEffect(() => {
    let filtered = languages.filter(lang => lang.locale === language)
    //changeLang(filtered[0].locale)
    setLanguageName(filtered[0])
  },[language])

  return (
    <div className="container">
        <IonSelect 
            multiple={false}
            interface="action-sheet"
            cancelText={"Cancel"}
            id="lang-input"
            name="lang-input"
            ref={langRef}
            placeholder={t("language") as string}
            value={languageName}
            onIonChange={
              (ev) => {
                if (ev.detail.value !== null && ev.detail.value !== undefined){
                    let filtered = languages.filter(lang => lang.languageName === (ev.detail.value))
                    changeLang(filtered[0].locale)
                    setLanguageName(ev.detail.value)
                }
              }

            }
          >
            {languages.map((m: Localization) => (
              <IonSelectOption key={m.locale} value={m.languageName}>{m.languageName} ({m.locale})</IonSelectOption>
            ))}
            </IonSelect>
    </div>
  );
};

export default LanguageChoooser;
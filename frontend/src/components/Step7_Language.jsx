import React from 'react';

const Step7_Language = ({ nextStep, prevStep, handleChange, values }) => {
  const languages = [
    "English", "Tamil", "Malayalam", "Telugu", "Kannada", "Marathi", "Urdu",
    "Gujarati", "Arabic", "Bengali", "Bulgarian", "Chinese", "Croatian",
    "Czech", "Danish", "Dutch", "Estonian", "Finnish", "French", "German",
    "Greek", "Hebrew", "Hindi", "Hungarian", "Indonesian", "Italian",
    "Japanese", "Korean", "Kashmiri", "Latvian", "Lithuanian", "Norwegian", "Polish",
    "Portuguese", "Romanian", "Russian", "Serbian", "Slovak", "Slovenian",
    "Spanish", "Swahili", "Swedish", "Thai", "Turkish", "Ukrainian", "Vietnamese"
  ];

  return (
    <>
      <div className="form-group">
        <label htmlFor="language">Course Language</label>
        <select id="language" value={values.language} onChange={handleChange('language')} className="form-select">
          {languages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
        </select>
      </div>
      <div className="button-group">
        <button className="button-back" onClick={prevStep}>Back</button>
        <button className="button-next" onClick={nextStep}>Next</button>
      </div>
    </>
  );
};

export default Step7_Language;
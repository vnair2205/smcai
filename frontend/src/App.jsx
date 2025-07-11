import React, { useState } from 'react';
import './App.css';

// Import Components
import Sidebar from './components/Sidebar.jsx';
import Stepper from './components/Stepper.jsx';
import Login from './components/Login.jsx'; // <-- Import Login
import Step1_Topic from './components/Step1_Topic.jsx';
import Step2_ExperienceLevel from './components/Step2_ExperienceLevel.jsx';
import Step3_Objective from './components/Step3_Objective.jsx';
import Step4_Outcome from './components/Step4_Outcome.jsx';
import Step5_SubTopics from './components/Step5_SubTopics.jsx';
import Step6_Format from './components/Step6_Format.jsx';
import Step7_Language from './components/Step7_Language.jsx';
import Step8_Index from './components/Step8_Index.jsx';
import Step9_Generate from './components/Step9_Generate.jsx';

const stepTitles = ["Topic", "Experience", "Objective", "Outcome", "Sub-Topics", "Format", "Language", "Index", "Generate"];

// This is the main application component for logged-in users
const CourseGenerator = () => {
    const [step, setStep] = useState(1);
    const [courseData, setCourseData] = useState({
        topic: '', experienceLevel: 'Beginner', objective: '', outcome: '',
        subTopicCount: 5, format: 'Video and Theory', language: 'English', index: []
    });

    const totalSteps = stepTitles.length;
    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);
    const goToHome = () => {
        setCourseData({
            topic: '', experienceLevel: 'Beginner', objective: '', outcome: '',
            subTopicCount: 5, format: 'Video and Theory', language: 'English', index: []
        });
        setStep(1);
    };
    const handleChange = (input) => (e) => {
        setCourseData({ ...courseData, [input]: e.target.value });
    };

    if (step === 9) {
        return <Step9_Generate values={courseData} goToHome={goToHome} />;
    }

    return (
        <div className="app-wrapper">
            <Sidebar />
            <main className="main-content">
                <div className="wizard-container">
                    <Stepper currentStep={step} totalSteps={totalSteps} />
                    <div className="wizard-header"><h2>{stepTitles[step - 1]}</h2></div>
                    {(() => {
                        switch (step) {
                            case 1: return <Step1_Topic nextStep={nextStep} handleChange={handleChange} values={courseData} />;
                            case 2: return <Step2_ExperienceLevel nextStep={nextStep} prevStep={prevStep} handleChange={handleChange} values={courseData} />;
                            case 3: return <Step3_Objective nextStep={nextStep} prevStep={prevStep} values={courseData} setCourseData={setCourseData} />;
                            case 4: return <Step4_Outcome nextStep={nextStep} prevStep={prevStep} values={courseData} setCourseData={setCourseData} />;
                            case 5: return <Step5_SubTopics nextStep={nextStep} prevStep={prevStep} handleChange={handleChange} values={courseData} />;
                            case 6: return <Step6_Format nextStep={nextStep} prevStep={prevStep} handleChange={handleChange} values={courseData} />;
                            case 7: return <Step7_Language nextStep={nextStep} prevStep={prevStep} handleChange={handleChange} values={courseData} />;
                            case 8: return <Step8_Index nextStep={nextStep} prevStep={prevStep} values={courseData} setCourseData={setCourseData} />;
                            default: return null;
                        }
                    })()}
                </div>
            </main>
        </div>
    );
};


function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    if (!isLoggedIn) {
        return <Login onLogin={setIsLoggedIn} />;
    }

    return <CourseGenerator />;
}

export default App;

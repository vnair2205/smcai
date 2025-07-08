import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from '../firebase';
import axios from 'axios';
import './Auth.css';

const SignUp = ({ setAuthView }) => {
    const [formData, setFormData] = useState({ firstName: '', lastName: '', mobileNumber: '', email: '', password: '' });
    const [agreed, setAgreed] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

    const registerUserInDb = async (firebaseUser) => {
        const [firstName, ...lastName] = firebaseUser.displayName ? firebaseUser.displayName.split(' ') : [formData.firstName, formData.lastName];
        await axios.post('http://localhost:5000/api/auth/register', {
            firebaseUid: firebaseUser.uid,
            email: firebaseUser.email,
            firstName: firstName,
            lastName: lastName.join(' '),
            mobileNumber: formData.mobileNumber,
        });
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        if (!agreed) { setError("You must agree to the Terms of Service."); return; }
        setError('');
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            await registerUserInDb(userCredential.user);
        } catch (err) {
            setError("Failed to create an account.");
        }
    };

    const handleGoogleSignIn = async () => {
        setError('');
        try {
            const result = await signInWithPopup(auth, googleProvider);
            await registerUserInDb(result.user);
        } catch (err) {
            setError("Failed to sign in with Google.");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form-wrapper">
                <h2>Create Your Account</h2>
                <button className="google-btn" onClick={handleGoogleSignIn}>Sign up with Google</button>
                <div className="divider">OR</div>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSignUp}>
                    <div className="form-group"><label htmlFor="firstName">First Name</label><input type="text" id="firstName" onChange={handleChange} required /></div>
                    <div className="form-group"><label htmlFor="lastName">Last Name</label><input type="text" id="lastName" onChange={handleChange} required /></div>
                    <div className="form-group"><label htmlFor="mobileNumber">Mobile Number (Optional)</label><input type="tel" id="mobileNumber" onChange={handleChange} /></div>
                    <div className="form-group"><label htmlFor="email">Email</label><input type="email" id="email" onChange={handleChange} required /></div>
                    <div className="form-group"><label htmlFor="password">Password</label><input type="password" id="password" onChange={handleChange} required /></div>
                    <div className="checkbox-group"><input type="checkbox" id="agree" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} /><label htmlFor="agree">I agree to the Terms of Service & Privacy Policy.</label></div>
                    <div className="button-group"><button type="submit" className="button-next">Sign Up</button></div>
                </form>
                <div className="auth-switch">Already have an account? <span onClick={() => setAuthView('login')}>Login</span></div>
            </div>
        </div>
    );
};
export default SignUp;
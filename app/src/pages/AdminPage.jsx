import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import '../styles/settings.css';
import passHideIcon from '../assets/icons/pass-hide.svg';
import passSeeIcon from '../assets/icons/pass-see.svg';
import { useSearchParams } from "react-router-dom";

function AdminPage() {
  // react use state
  const [firstName, setFirstName] = useState('Placeholder');
  const [lastName, setLastName] = useState('Placeholder');
  const [email, setEmail] = useState('placeholder@email.com');
  const [contactNo, setContactNo] = useState('+63 999 999 9999');
  const [currentPass, setCurrentPass] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [newPass, setNewPass] = useState('');
  const [showNewPass, setShowNewPass] = useState(false);
  const [confirmPass, setConfirmPass] = useState('');
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);
  const [page1, setpage1] = useState(true);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setGeneralError('');
    setLoading(true);

    // Validation
    const newErrors = {};
    if (!firstName) newErrors.firstName = 'First Name is required';
    if (!lastName) newErrors.lastName = 'Last Name is required';
    if (!email) newErrors.email = 'Email is required';
    if (!contactNo) newErrors.contactNo = 'Contact Number is required';
    if (!currentPass) newErrors.currentPass = 'Current Password is required';
    if (!newPass) newErrors.newPass = 'New Password is required';
    if (!confirmPass) newErrors.confirmPass = 'Confirm Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-card">
        <div className="admin-card-top">
          <h1>Account Settings</h1>
          <p>Manage your account information and security settings</p>
        </div>

        <div className="admin-card-nav">
          <button 
            className={page1 ? "current" : ""}
            onClick={() => setpage1(true)}
          >Profile Information</button>
          <button 
            className={!page1 ? "current" : ""}
            onClick={() => setpage1(false)}
          >Change Password</button>
        </div>    


        {generalError && <div className="error-banner">{generalError}</div>}
        
        { page1 ?
          <form className="admin-form profile-information" onSubmit={handleSubmit}>
            <div className="profile-info-title">
              <h2>Profile Information</h2>
              <p>Update your personal information and contact details.</p>
            </div>
            
            <div className="flex-row">
              <div className={`form-group ${errors.firstName ? 'form-group-error' : ''}`}>
                <label htmlFor="firstName">First Name</label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={errors.firstName ? 'input-error' : ''}
                  required
                />
                {errors.firstName && <span className="error-text">{errors.firstName}</span>}
              </div>
              <div className={`form-group ${errors.lastName ? 'form-group-error' : ''}`}>
                <label htmlFor="lastName">Last Name</label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={errors.lastName ? 'input-error' : ''}
                  required
                />
                {errors.lastName && <span className="error-text">{errors.lastName}</span>}
              </div>
            </div>
            <div className={`form-group ${errors.email ? 'form-group-error' : ''}`}>
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={errors.email ? 'input-error' : ''}
                required
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>
            <div className={`form-group ${errors.contactNo ? 'form-group-error' : ''}`}>
              <label htmlFor="contactNo">Phone Number</label>
              <input
                id="contactNo"
                type="tel"
                value={contactNo}
                onChange={(e) => setContactNo(e.target.value)}
                className={errors.contactNo ? 'input-error' : ''}
                required
              />
              {errors.contactNo && <span className="error-text">{errors.contactNo}</span>}
            </div>

            <button type="submit" className="admin-button" disabled={loading}>
              {loading ? 'Updating Profile...' : 'Update Profile'}
            </button>
          </form> : 
          <form className="admin-form change-password" onSubmit={handleSubmit}>
            <div className="profile-info-title">
              <h2>Change Password</h2>
            </div>

            <div className={`form-group password-field ${errors.currentPass ? 'form-group-error' : ''}`}>
              <label htmlFor="currentPass">Current Password</label>
              <input
                id="currentPass"
                type={showCurrentPass ? 'text' : 'password'}
                value={currentPass}
                placeholder="Enter current password"
                onChange={(e) => setCurrentPass(e.target.value)}
                className={errors.currentPass ? 'input-error' : ''}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowCurrentPass(!showCurrentPass)}
                aria-label={showCurrentPass ? 'Hide password' : 'Show password'}
              >
                <img src={showCurrentPass ? passSeeIcon : passHideIcon} alt={showCurrentPass ? 'Hide password' : 'Show password'} />
              </button>
              {errors.currentPass && <span className="error-text">{errors.currentPass}</span>}
            </div>
            <div className={`form-group password-field ${errors.newPass ? 'form-group-error' : ''}`}>
              <label htmlFor="newPass">New Password</label>
              <input
                id="newPass"
                type={showNewPass ? 'text' : 'password'}
                value={newPass}
                placeholder="Enter new password"
                onChange={(e) => setNewPass(e.target.value)}
                className={errors.newPass ? 'input-error' : ''}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowNewPass(!showNewPass)}
                aria-label={showNewPass ? 'Hide password' : 'Show password'}
              >
                <img src={showNewPass ? passSeeIcon : passHideIcon} alt={showNewPass ? 'Hide password' : 'Show password'} />
              </button>
              {errors.newPass && <span className="error-text">{errors.newPass}</span>}
            </div>
            <div className={`form-group password-field ${errors.confirmPass ? 'form-group-error' : ''}`}>
              <label htmlFor="confirmPass">Confirm New Password</label>
              <input
                id="confirmPass"
                type="password"
                value={confirmPass}
                placeholder="Re-enter new password"
                onChange={(e) => setConfirmPass(e.target.value)}
                className={errors.confirmPass ? 'input-error' : ''}
                required
              />
              {errors.confirmPass && <span className="error-text">{errors.confirmPass}</span>}
            </div>

            <button type="submit" className="admin-button" disabled={loading}>
              {loading ? 'Changing Password...' : 'Change Password'}
            </button>
          </form>
        }
        

      </div>
    </div>
  );
}

export default AdminPage;
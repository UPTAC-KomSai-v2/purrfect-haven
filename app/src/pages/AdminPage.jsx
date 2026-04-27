import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/admin.css';
import passHideIcon from '../assets/icons/pass-hide.svg';
import passSeeIcon from '../assets/icons/pass-see.svg';


function AdminPage() {
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

  const adoptionRequestTemplate = () => {
    return (
      <>
        <div className="flex-row">
          <h2>Callie</h2>
          <p>Puspin ⋅ Applied Mar 28, 2026</p>
        </div>

        <div className="flex-row">
          <div>
            <h3>APPLICANT INFORMATION</h3>
            <h4>Full Name</h4>
            <p>Ana Reyes</p>
            <h4>Email Address</h4>
            <p>ana.reyes@gmail.com</p>
            <h4>Phone Number</h4>
            <p>0917-555-0101</p>
            <h4>Address</h4>
            <p>Downtown, Tacloban</p>
            <h4 className="topMargin20px">Additional Information</h4>
            <label>
              <input type="checkbox" disabled={true} checked/>
              This would be my first pet
            </label>
          </div>
          
          <div>
            <h3>FINANCIAL CAPABILITY</h3>
            <p>`Im rich cuh`</p>
            <p>//replace with a file</p>
            <h4 className="topMargin20px">Home Ownership</h4>
            <label>
              <input type="checkbox" disabled={true} checked/>
              I own my home
            </label>
          </div>

           <img
            src='https://placehold.co/400x400?text=No+Photo'
            className="detail-main-photo"
          />
        </div>
        <div className="flex-row buttons-container">
          <button className="approved-btn btn">
            Approve Application
          </button>
          <button className="rejected-btn btn">
            Reject Application
          </button>
        </div>
        <p className="small-italics">This action will notify the applicant via email.</p>
      </>
    );
  }

  const communityPostTemplate = () => {
    return (
      <>
        <div className="flex-col card-top">
          <h2>Community Post ID: ASH347B</h2>
          <p className="posted">Posted by Maria Santos on March 26, 2026</p>
        </div>

        <div className="flex-col padding20px">
          <div className="flex-row">
            <div className="posted-by">
              <h3>POSTED BY</h3>
              <h4>Full Name</h4>
              <p>Ana Reyes</p>
              <h4>Email Address</h4>
              <p>ana.reyes@gmail.com</p>
              <h4>Phone Number</h4>
              <p>0917-555-0101</p>
              <h4>Address</h4>
              <p>Downtown, Tacloban</p>
            </div>

            <div className="post-content-container">
              <h3>POST CONTENT</h3>

              <div className="flex-row space-between"> 
                <div>
                  <h4>Pet Name</h4>
                  <p>Cat1, Cat2, and Cat3</p>
                </div>
                <div>
                  <h4>Animal Type</h4>
                  <p>Cat</p>
                </div>
                <div>
                  <h4>Breed</h4>
                  <p>Puspin</p>
                </div>
                <div>
                  <h4>Pattern</h4>
                  <p>Black and white stripes</p>
                </div>
                
              </div>
              
              <div className="flex-row topMargin20px space-between">
                <div>
                  <h4>Age</h4>
                  <p>4 weeks old</p>
                </div>
                <div>
                  <h4>Gender</h4>
                  <p>2 Male, 1 Female</p>
                </div>
                <div>
                  <h4>Weight (kilograms)</h4>
                  <p>0.7 kg each</p>
                </div>
                <div>
                  <h4>Personality</h4>
                  <p>Cute and playful</p>
                </div>
              </div>
              
              <div className="flex-row topMargin20px space-between">
                <div>
                  <h4>Organization/Foster Home</h4>
                  <p>N/A</p>
                </div>
                <div>
                  <h4>Health & Care</h4>
                  <p>None</p>
                </div>
              </div>

              <div className="topMargin20px">
                <h4>About The Pet</h4>
                <p>Found 3 kittens behind SM Cebu. They're about 4 weeks old and need a loving home. I can provide initial supplies.</p>
              </div>
            
              <div>
                {
                  [1, 2, 3].map(id => (
                    <img
                      src='https://placehold.co/400x400?text=No+Photo'
                      className="detail-photo"
                      id={id}
                    />
                  ))
                }
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex-row buttons-container">
              <button className="approved-btn btn">
                Approve & Publish
              </button>
              <button className="rejected-btn btn">
                Reject Post
              </button>
            </div>
            <p className="small-italics">This action will notify the applicant via email.</p>
          </div>
        </div>
        
      </>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-nav">
          <button 
            className={page1 ? "current" : ""}
            onClick={() => setpage1(true)}
          >Adoption Requests</button>
          <button 
            className={!page1 ? "current" : ""}
            onClick={() => setpage1(false)}
          >Community Posts</button>
        </div>    
      
        {generalError && <div className="error-banner">{generalError}</div>}
        
        { page1 ?
          <div>
            { [1, 2, 3, 4, 5].map(id => (
              <div className="admin-card padding20px" id={id}>
                {adoptionRequestTemplate()}
              </div>
              ))}
          </div>  
             : 
          <div>
            { [1, 2, 3, 4, 5].map(id => (
              <div className="admin-card" id={id}>
                {communityPostTemplate()}
              </div>
              ))}
          </div>  
        }
        

    </div>
  );
}

export default AdminPage;
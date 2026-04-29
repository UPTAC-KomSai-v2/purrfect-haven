import React from 'react';
import { useNavigate } from 'react-router-dom';
import FormCard from '../../components/FormCard.jsx';
import Button from '../../components/Button.jsx';
import '../../styles/forms.css';
import '../../styles/community.css';

function CommunityPage() {
    const navigate = useNavigate();
    const [message, setMessage] = React.useState('');

    React.useEffect(() => {
        const fileInput = document.querySelector('.cap-hidden-file');
        if (fileInput) fileInput.disabled = true;
    }, []);

    return (
        <div className="cap-page-container">
            <div className="cap-main-wrapper">

                <section className="cap-info-section">
                    <h1 className="cap-title">Community Adoption</h1>

                    <div className="cap-image-placeholder">
                        <img src="chammi.jpg" alt="Pet Adoption 1" className="cap-featured-img" />
                    </div>

                    <p className="cap-description-text">
                        Have a pet you want to put up for adoption? Put them up for adoption right here at <strong>Purrfect Haven</strong>.<br /><br />
                        Find them a safe, loving home by connecting with responsible adopters who truly care. Our platform makes
                        the process simple, secure, and compassionate. Because every pet deserves a second chance and a forever family.
                    </p>

                    <div className="cap-image-placeholder">
                        <img src="brownie.jpg" alt="Pet Adoption 2" className="cap-featured-img" />
                        <img src="callie.jpg" alt="Pet Adoption 3" className="cap-featured-img" />
                    </div>
                </section>

                <section className="cap-form-section">
                    <FormCard 
                        className="cap-adoption-card" 
                        maxWidth={800} 
                    >
                        <form
                            onSubmit={async (e) => {
                                e.preventDefault();
                                setMessage('Submitting...'); 

                                const formData = {
                                    petName: document.getElementById('petName').value,
                                    age: document.getElementById('age').value,
                                    weight: document.getElementById('weight').value,
                                    gender: document.getElementById('gender').value,
                                    type: document.getElementById('type').value,
                                    breed: document.getElementById('breed').value,
                                    color: document.getElementById('color').value,
                                    personality: document.getElementById('personality').value,
                                    organization: document.getElementById('organization').value,
                                    location: document.getElementById('location').value,
                                    health: document.getElementById('health').value,
                                    about: document.getElementById('about').value,
                                };

                                try {
                                    const res = await fetch('http://localhost:3000/api/community', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        credentials: 'include',
                                        body: JSON.stringify(formData),
                                    });

                                    const data = await res.json();

                                    if (!res.ok) {
                                        setMessage(data.error || 'Submission failed');
                                        return;
                                    }

                                    setMessage('Submit successful!');
                                    e.target.reset();
                                    
                                    // Redirect to details page
                                    navigate(`/community/post/${data.postId}`);

                                } catch (err) {
                                    console.error('Fetch error:', err);
                                    setMessage('Connection error: Could not reach server');
                                }
                            }}
                        >
                            <p className="cap-form-header">Community Adoption Posting Form</p>

                            <div className="cap-input-group">
                                <label htmlFor='petName'>Pet Name</label>
                                <input type="text" id="petName" placeholder="Enter name of pet" />
                            </div>

                            <div className="cap-input-row">
                                <div className="cap-input-group">
                                    <label htmlFor='age'>Age</label>
                                    <input type="text" id="age" placeholder="Value" />
                                </div>
                                <div className="cap-input-group">
                                    <label htmlFor='weight'>Weight (kilograms)</label>
                                    <input type="text" id="weight" placeholder="Enter weight of pet" />
                                </div>
                                <div className="cap-input-group">
                                    <label htmlFor='gender'>Gender</label>
                                    <input type="text" id="gender" placeholder="Male/Female" />
                                </div>
                            </div>

                            <div className="cap-input-row">
                                <div className="cap-input-group">
                                    <label htmlFor='type'>Type</label>
                                    <input type="text" id="type" placeholder="e.g. cat, dog, etc." />
                                </div>
                                <div className="cap-input-group">
                                    <label htmlFor='breed'>Breed</label>
                                    <input type="text" id="breed" placeholder="e.g. Golden Retriever" />
                                </div>
                            </div>

                            <div className="cap-input-group">
                                <label htmlFor='color'>Color/Pattern</label>
                                <input type="text" id="color" placeholder="e.g. black, white, brown, calico, etc." />
                            </div>

                            <div className="cap-input-group">
                                <label htmlFor='personality'>Personality</label>
                                <input type="text" id="personality" placeholder="Enter pet's personality traits" />
                            </div>

                            <div className="cap-input-group">
                                <label htmlFor='organization'>Organization/Foster Home</label>
                                <input type="text" id="organization" placeholder="Enter organization or foster owner" />
                            </div>

                            <div className="cap-input-group">
                                <label htmlFor='location'>Location</label>
                                <input type="text" id="location" placeholder="Enter current home address of pet" />
                            </div>

                            <div className="cap-input-group">
                                <label htmlFor='health'>Health & Care</label>
                                <input type="text" id="health" placeholder="e.g. vaccinated, dewormed, healthy" />
                            </div>

                            <div className="cap-input-group">
                                <label htmlFor='about'>About The Pet</label>
                                <textarea id="about" rows="4"></textarea>
                            </div>

                            <div className="cap-upload-container">
                                <label>Pet Media</label>
                                <div className="cap-upload-dropzone">
                                    <div className="cap-upload-icon">📷</div>
                                    <p>Upload photos or videos of the animal</p>
                                    <small>JPG, PNG, MP4 up to 10MB each • Max 5 files</small>
                                    <input type="file" className="cap-hidden-file" disabled />
                                </div>
                            </div>

                            <div className="cap-action-area">
                                <Button type="submit">Submit Community Form</Button>
                            </div>

                            {message && (
                                <p style={{ 
                                    marginTop: '10px', 
                                    color: message.includes('successful') ? 'green' : 'red',
                                    fontWeight: 'bold'
                                }}>
                                    {message}
                                </p>
                            )}
                        </form>
                    </FormCard>
                </section>
            </div>  
        </div>
    );
}

export default CommunityPage;
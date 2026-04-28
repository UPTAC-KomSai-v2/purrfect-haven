import React from 'react';
import { useNavigate } from 'react-router-dom';
import FormCard from '../components/FormCard.jsx';
import Button from '../components/Button.jsx';
import '../styles/forms.css';
import '../styles/community.css';

function CommunityPage() {
    const navigate = useNavigate();

    return (
        <div className="cap-page-container">
            <div className="cap-main-wrapper">
                {/* LEFT COLUMN: Narrative & Media */}
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

                {/* RIGHT COLUMN: Entry Form */}
                <section className="cap-form-section">
                    {/* Removed onSubmit here */}
                    <form className="cap-adoption-card">
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
                            <textarea id="about" placeholder="Provide history, how they were found, etc." rows="4"></textarea>
                        </div>

                        <div className="cap-upload-container">
                            <label>Pet Media</label>
                            <div className="cap-upload-dropzone">
                                <div className="cap-upload-icon">📷</div>
                                <p>Upload photos or videos of the animal</p>
                                <small>JPG, PNG, MP4 up to 10MB each • Max 5 files</small>
                                <input type="file" multiple accept="image/*,video/*" className="cap-hidden-file" />
                            </div>
                        </div>

                        <div className="cap-action-area">
                            <Button>Submit</Button>
                        </div>
                    </form>
                </section>
            </div>
        </div>
    );
}

export default CommunityPage;
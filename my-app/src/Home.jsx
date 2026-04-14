import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <section class="nav">
        <h1>PURRFECT HAVEN</h1>
        <div class="navOptions">
          <a href="/">Home</a>
          <a href="">Adopt</a>
          <a href="">Rescue</a>
          <a href="">Community</a>
        </div>

        <a href="">SIGN IN</a>
      </section>

      <section class="imageContent">
        <div class="imageDiv">
          <div class="blur">
            <h1 id="dark">Every Pet Deserves a</h1>
            <h1>Loving Home</h1>
            <p>Browse adoptable pets around Tacloban City, report animals in need, or post community adoptions. Together, we can make a difference for our Tacloban fur babies.</p>
            <div class="row">
              <button>Available Pets</button>
              <button>Report a Rescue</button>
            </div>
          </div>
        </div>
      </section>
      
      <section class="featuredStory">
        <h1>Featured Story</h1>
        <div class="fsContent">
          <div class="fscat"></div>
          <div class="fsText">
            <p>Adoption Success Story</p>
            <h2>“Henhen changed our lives and we changed hers”</h2>
            <p>
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
            </p>
            <button>Adopt Now</button>
          </div>
        </div>
      </section>

      <section class="petsForAdoption">
        <h1>Available Pets for Adoption</h1>
        <p>Find your perfect furry friend from our loving pets waiting for their forever homes!</p>
        <div class="adoptionList">
          <div class="pet">
            <img src="callie.jpg" />
            <p><strong>Callie</strong></p>
            <p>Puspin</p>
            <p>3 yrs</p>
            <p>Female</p>
          </div>
          <div class="pet">
            <img src="elliot.png" />
            <p><strong>Elliot</strong></p>
            <p>German Shepherd</p>
            <p>3 yrs</p>
            <p>Male</p>
          </div>
          <div class="pet">
            <img src="samsam.png" />
            <p><strong>Samsam</strong></p>
            <p>Aspin</p>
            <p>3 yrs</p>
            <p>Female</p>
          </div>
          <div class="pet">
            <img src="tikay.png" />
            <p><strong>Tikay</strong></p>
            <p>Puspin</p>
            <p>3 yrs</p>
            <p>Male</p>
          </div>
        </div>
      </section>

      <section class="faq">
        <h1>Frequently Asked Questions</h1>
      </section>

      <section class="footer">
        <div class="row">
          <div class="column">
            <p><strong>Follow Us</strong></p>
            <div class="row">
              <img class="smallComputer" src="computer.png" />
              <img class="smallComputer" src="computer.png" />
              <img class="smallComputer" src="computer.png" />
            </div>
          </div>
          <div class="column">
            <p><strong>About</strong></p>
            <p><em>Every pet deserves a loving home.</em></p>
          </div>
        </div>
        <hr/>
        <div class="row">
          <div class="row">
            <p>© 2026 Purrfect Haven</p>
            <p>Privacy Policy</p>
            <p>Website Developed by rubberduck</p>
          </div>
        </div>
      </section>
    </> 
  )
}

export default App
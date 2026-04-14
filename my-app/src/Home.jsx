import './App.css'

function App() {
  return (
    <>
      <section className="nav">
        <h1>PURRFECT HAVEN</h1>
        <div className="navOptions">
          <a href="/">Home</a>
          <a href="">Adopt</a>
          <a href="">Rescue</a>
          <a href="">Community</a>
        </div>

        <a href="">SIGN IN</a>
      </section>

      <section className="imageContent">
        <div className="imageDiv">
          <div className="blur">
            <h1 id="dark">Every Pet Deserves a</h1>
            <h1>Loving Home</h1>
            <p>Browse adoptable pets around Tacloban City, report animals in need, or post community adoptions. Together, we can make a difference for our Tacloban fur babies.</p>
            <div className="row">
              <button>Available Pets</button>
              <button>Report a Rescue</button>
            </div>
          </div>
        </div>
      </section>
      
      <section className="featuredStory">
        <h1>Featured Story</h1>
        <div className="fsContent">
          <div className="fscat"></div>
          <div className="fsText">
            <p>Adoption Success Story</p>
            <h2>“Henhen changed our lives and we changed hers”</h2>
            <p>
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
            </p>
            <button>Adopt Now</button>
          </div>
        </div>
      </section>

      <section className="petsForAdoption">
        <h1>Available Pets for Adoption</h1>
        <p>Find your perfect furry friend from our loving pets waiting for their forever homes!</p>
        <div className="adoptionList">
          <div className="pet">
            <img src="callie.jpg" />
            <p><strong>Callie</strong></p>
            <p>Puspin</p>
            <p>3 yrs</p>
            <p>Female</p>
          </div>
          <div className="pet">
            <img src="elliot.png" />
            <p><strong>Elliot</strong></p>
            <p>German Shepherd</p>
            <p>3 yrs</p>
            <p>Male</p>
          </div>
          <div className="pet">
            <img src="samsam.png" />
            <p><strong>Samsam</strong></p>
            <p>Aspin</p>
            <p>3 yrs</p>
            <p>Female</p>
          </div>
          <div className="pet">
            <img src="tikay.png" />
            <p><strong>Tikay</strong></p>
            <p>Puspin</p>
            <p>3 yrs</p>
            <p>Male</p>
          </div>
        </div>
      </section>

      <section className="faq">
        <h1>Frequently Asked Questions</h1>
      </section>

      <section className="footer">
        <div className="row">
          <div className="column">
            <p><strong>Follow Us</strong></p>
            <div className="row">
              <img className="smallComputer" src="computer.png" />
              <img className="smallComputer" src="computer.png" />
              <img className="smallComputer" src="computer.png" />
            </div>
          </div>
          <div className="column">
            <p><strong>About</strong></p>
            <p><em>Every pet deserves a loving home.</em></p>
          </div>
        </div>
        <hr/>
        <div className="row">
          <div className="row">
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
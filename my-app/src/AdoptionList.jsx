import './App.css'
import Header from "./components/Header"
import Footer from "./components/Footer"

function App() {
  return (
    <>
      <Header />
      <section className="title">
        <h1>Pets for Adoption</h1>
        <p>Check out our list of pets up for adoption and find the perfect companion waiting to meet you!</p>
      </section>

      <section className="petsForAdoption">
        
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
        <div className="adoptionList">
          <div className="pet">
            <img src="micho.png" />
            <p><strong>Micho</strong></p>
            <p>Aspin-Pomeranian Mix</p>
            <p>2 yrs</p>
            <p>Female</p>
          </div>
          <div className="pet">
            <img src="chammi.png" />
            <p><strong>Chammi</strong></p>
            <p>Puspin-Persian Mix</p>
            <p>2 wks</p>
            <p>Male</p>
          </div>
          <div className="pet">
            <img src="manok.png" />
            <p><strong>Manok</strong></p>
            <p>Parakeet</p>
            <p>1 yr</p>
            <p>Male</p>
          </div>
          <div className="pet">
            <img src="mimin.png" />
            <p><strong>Mimin</strong></p>
            <p>Puspin</p>
            <p>2 yrs</p>
            <p>Female</p>
          </div>
        </div>
      </section>

      <section className="adoptedPets">
        <h1>Successfully Adopted Pets</h1>
        <p>These pets have found their forever homes!</p>
        <div className="adoptionList">
          <div className="pet">
            <img src="halimaw.png" />
            <div className='darkcircle'>
              <p class="adoptedlabel">Adopted!</p>
            </div>
            <p><strong>Halimaw</strong></p>
            <p>Puspin</p>
            <p>1 yr</p>
            <p>Female</p>
          </div>
          <div className="pet">
            <img src="brownie.png" />
            <div className='darkcircle'>
              <p class="adoptedlabel">Adopted!</p>
            </div>
            <p><strong>Brownie</strong></p>
            <p>Aspin</p>
            <p>6 mos</p>
            <p>Male</p>
          </div>
          <div className="pet">
            <img src="smiley.png" />
            <div className='darkcircle'>
              <p class="adoptedlabel">Adopted!</p>
            </div>
            <p><strong>Smiley</strong></p>
            <p>Aspin-Unknown Mix</p>
            <p>4 yrs</p>
            <p>Male</p>
          </div>
        </div>
      </section>

      <Footer />
    </> 
  )
}

export default App
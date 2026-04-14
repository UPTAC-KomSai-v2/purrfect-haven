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

      <section class="mainContent">
        <div class="imageDiv">
          <div class="blur">
            <h1 id="dark">Every Pet Deserves a</h1>
            <h1>Loving Home</h1>
            <p>Browse adoptable pets around Tacloban City, report animals in need, or post community adoptions. Together, we can make a difference for our Tacloban fur babies.</p>
            <div class="buttons">
              <button>Available Pets</button>
              <button>Report a Rescue</button>
            </div>
          </div>
          
        </div>
      </section>
      
      <section class="featuredStory">
        <h1>Featured Story</h1>
        <div class="fsContent">
          <img class="fs_cat" src="julie-anne.jpg" width="516" height="479" />
          <div class="fsText">
            <p>Adoption Success Story</p>
            <h2>“Henhen changed our lives and we changed hers”</h2>
            <p>
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
            </p>
          </div>
          <button>Adopt Now</button>
        </div>
      </section>

    </>
  )
}

export default App
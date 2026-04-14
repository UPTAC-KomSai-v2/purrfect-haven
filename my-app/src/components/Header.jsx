import '../App.css'
import { Link } from 'react-router-dom'

function App() {
  return (
    <section className="nav">
      <h1>PURRFECT HAVEN</h1>
      <div className="navOptions">
        <Link to="/">Home</Link>
        <Link to="/adoptionlist">Adopt</Link>
        <Link to="">Rescue</Link>
        <Link to="">Community</Link>
      </div>
      <Link to="/login">SIGN IN</Link>
    </section>
  )
}

export default App
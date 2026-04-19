import './styles/app.css'
import { Link } from 'react-router-dom'
import Header from "./components/Header"
import Footer from "./components/Footer"

function Signup() {
  return (
    <>
      <Header />
      <section class="login">
        <h1>Create Your Account</h1>
        <p>Join our community and help pets find loving homes</p>
        <form>
          <label>First Name <input type="text" placeholder="e.g. Juan"/></label>
          <label>Last Name <input type="text" placeholder="e.g. dela Cruz"/></label>
          <label>Email address <input type="text" placeholder="e.g. imarubberduck@duckdomain.xyz"/></label>
          <label>Phone Number <input type="number" placeholder="09XXXXXXXXX"/></label>
          
          <label>Password <input type="password" placeholder="secureHashSHA12123"/></label>
          <label>Confirm Password <input type="password" placeholder="secureHashSHA12123"/></label>
          
          <button>SIGN UP</button>
        </form>
        <Link to="/login">Already have an account? <strong>Sign in</strong></Link>
      </section>

      <Footer />
    </> 
  )
}

export default Signup
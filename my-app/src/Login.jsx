import './App.css'
import { Link } from 'react-router-dom'
import Header from "./components/Header"
import Footer from "./components/Footer"

function App() {
  return (
    <>
      <Header />
      <section class="login">
        <h1>Welcome Back</h1>
        <p>Sign in to your account to continue</p>
        <form>
          <label>Email address <input type="text" placeholder="imarubberduck@duckdomain.xyz"/></label>
          <label>Password <input type="password" placeholder="secureHashSHA12123"/></label>
          <label><input type="checkbox"/> Remember me</label>
         <Link to="/forgotPassword">Forgot password?</Link>
          <button>SIGN IN</button>
        </form>
        <Link to="/signup">Don't have an account? <strong>Sign up</strong></Link>
      </section>

      <Footer />
    </> 
  )
}

export default App
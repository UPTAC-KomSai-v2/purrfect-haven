import '../styles/app.css'
import { Link } from 'react-router-dom'

function Login() {
  return (
    <>
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

    </> 
  )
}

export default Login;
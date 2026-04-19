import '../styles/app.css'

function Footer() {
  return (
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
  )
}

export default Footer
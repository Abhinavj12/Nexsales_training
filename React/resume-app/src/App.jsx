import Header from "./components/Header";
import Contact from "./components/Contact";
import Education from "./components/Education";
import Experience from "./components/Experience";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import "./App.css";
import Profile from "./components/Profile";
import CareerObjective from "./components/CareerObjective";

function App() {
    return (
        <div className="resume">

            <Header />
          <div className="resume-body">
            <div className="left-section">
                <Profile />
                <Contact />
                <Skills />
                <p>Languages: English, Hindi, Marathi</p>
            </div>

            <div className="right-section">
                <CareerObjective/>
                 <Education />
                 <Experience />
                 <Projects />
            </div>

          </div>

        </div>
    );
}

export default App;
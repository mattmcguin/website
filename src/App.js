import React, { Component } from "react";
import Hero from "./components/Hero";
import ProjectList from "./components/ProjectList";
import Contact from "./components/Contact";
import scrollToComponent from "react-scroll-to-component";

class App extends Component {
    scrollToProjects = () => {
        scrollToComponent(this.Projects, { align: "top" });
    };

    scrollToContact = () => {
        scrollToComponent(this.Contact, { align: "top" });
    };

    render() {
        return (
            <div className="App">
                <Hero scrollToProjects={this.scrollToProjects} />
                <ProjectList
                    ref={element => {
                        this.Projects = element;
                    }}
                    scrollToContact={this.scrollToContact}
                />
                <Contact ref={element => (this.Contact = element)} />
            </div>
        );
    }
}

export default App;

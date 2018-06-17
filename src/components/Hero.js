import React, { Component } from "react";
import threeEntryPoint from "../threejs/threeEntryPoint";
import styled from "styled-components";

const InfoBlock = styled.div`
    background: white;
    position: absolute;
    max-width: 40rem;
    padding: 1.5rem;
    margin-right: 1rem;
    opacity: 0.93;
    -moz-box-shadow: 1rem 1rem 0px 0px rgba(153, 153, 153, 1);
    box-shadow: 1rem 1rem 0px 0px rgba(153, 153, 153, 1);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;

const Title = styled.h1`
    margin: 0 0 1rem 0;
    display: inline;
`;

const Info = styled.p`
    font-size: 1.25rem;
    margin: 0;
`;

const Scroll = styled.a`
    position: absolute;
    text-decoration: none;
    bottom: 0;
    font-size: 1rem;
    padding: 0.25rem;
    margin-bottom: 0.5rem;
`;

export default class Hero extends Component {
    componentDidMount() {
        threeEntryPoint(this.threeRootElement);
    }

    render() {
        return (
            <div
                style={{
                    height: "100vh",
                    width: "100vw",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}
                ref={element => (this.threeRootElement = element)}
            >
                <InfoBlock>
                    <div>
                        <Title>Hi there! I'm </Title>
                        <Title id="name">Matt McGuiness!</Title>
                    </div>
                    <Info>
                        I am a software developer living in Charlottesville,
                        Virginia currently focusing on front end development.
                        I’m a creative problem solver who loves to learn about
                        new technologies.
                    </Info>
                </InfoBlock>
                <Scroll onClick={this.props.scrollToProjects}>
                    ▼ Projects ▼
                </Scroll>
            </div>
        );
    }
}

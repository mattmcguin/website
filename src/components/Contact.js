import React, { Component } from "react";
import styled from "styled-components";

const Container = styled.div`
    height: 100vh;
    width: 100vw;
    background: #556272;
    display: grid;
    justify-content: center;
    align-items: center;
    justify-items: center;
    align-content: center;
`;

const Header = styled.h1`
    color: white;
`;

const ContactInfo = styled.h2`
    color: white;
    font-style: italic;
    @media (max-width: 360px) {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
`;

const Link = styled.a`
    font-style: normal;
    color: white;
    text-decoration: underline;
    font-size: 1.5rem;
`;

export default class Contact extends Component {
    render() {
        return (
            <Container>
                <Header>Contact</Header>
                <ContactInfo>
                    Email:{" "}
                    <Link href="mailto:matt@mattmcguin.com" target="_top">
                        matt@mattmcguin.com
                    </Link>
                </ContactInfo>
                <ContactInfo>
                    Github:{" "}
                    <Link href="https://github.com/mattmcguin">
                        @mattmcguin
                    </Link>
                </ContactInfo>
                <ContactInfo>
                    Resume:{" "}
                    <Link href="https://drive.google.com/open?id=1xHGwEPANoAvRqHamxa6LGCurJ7k7Tp0Q">
                        Google Doc
                    </Link>
                </ContactInfo>
            </Container>
        );
    }
}

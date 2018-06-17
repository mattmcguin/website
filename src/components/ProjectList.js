import React, { Component } from "react";
import styled from "styled-components";
import ContralineLogo from "../assets/contraline-logo.png";
import VueLogo from "../assets/vue-logo.png";
import ReactLogo from "../assets/react-logo.png";

const Container = styled.div`
    padding: 5rem;
    display: grid;
    justify-content: center;
    background: linear-gradient(#eeeeee, #556272);

    @media (max-width: 500px) {
        padding: 5rem 1rem;
    }
`;

const List = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 600px));
    grid-gap: 1.25rem;
    justify-content: center;

    @media (max-width: 700px) {
        grid-gap: 3rem;
    }
`;

const Header = styled.div`
    padding-bottom: 3rem;
`;

const SubHeader = styled.h3`
    font-size: 1.3rem;
`;

const ProjectLink = styled.a`
    color: inherit;
    text-decoration: none;
    display: grid;
    background: white;
    grid-template-columns: 225px 1fr;
    border-radius: 10px;
    transition: transform 0.25s;
    box-shadow: 0 8px 6px -6px #333333;

    &:hover {
        transform: translate(0px, -5px) scale(1.02);
    }

    @media (max-width: 700px) {
        grid-template-columns: auto;
    }
`;

const Thumbnail = styled.img`
    width: 100%;
    border-radius: 10px 0px 0px 10px;
    border-right: 1px solid lightgrey;

    @media (max-width: 700px) {
        border-bottom: 1px solid lightgrey;
        border-right: none;
        border-radius: 10px 10px 0px 0px;
    }
`;

const Text = styled.div`
    padding: 0.5rem;
`;

const Title = styled.h2`
    margin: 0;
`;

const Description = styled.p`
    margin: 0;
    font-size: 0.95rem;
`;

const WillowTreeLink = styled.a`
    text-decoration: underline;
    color: #4ecdc4;
`;

const SubTitle = styled.h4`
    color: #545454;
    margin: 0;
`;

const Horizontal = styled.div`
    display: flex;
`;
const Tools = styled.p`
    margin: 0;
    padding-left: 0.25rem;
    font-size: 0.95rem;
`;

const RightNow = styled.h1`
    margin-top: 0;
`;

const Scroll = styled.a`
    text-decoration: none;
    color: white;
    font-size: 1rem;
    padding: 0.25rem;
    margin-top: 5rem;
    display: flex;
    justify-content: center;
`;

export default class ProjectList extends Component {
    render() {
        return (
            <Container>
                <Header>
                    <RightNow>Right Now...</RightNow>
                    <SubHeader>
                        I am working at{" "}
                        <WillowTreeLink href="https://willowtreeapps.com/">
                            WillowTree
                        </WillowTreeLink>, a development agency, as a Software
                        Engineer. If you want to learn more about my current and
                        past projects feel free to check them out below!
                    </SubHeader>
                </Header>
                <List>
                    <ProjectLink href="http://contraline.com">
                        <Thumbnail src={ContralineLogo} />
                        <Text>
                            <Title>Contraline</Title>
                            <SubTitle>Professional</SubTitle>
                            <Horizontal>
                                <SubTitle>Tools:</SubTitle>
                                <Tools>
                                    React.js, Gatsby, Contentful, GraphQL,
                                    Styled-Components
                                </Tools>
                            </Horizontal>
                            <SubTitle>Description</SubTitle>
                            <Description>
                                Contraline is inventing the future of male
                                contraception. This rich web application tells
                                the story of Contraline and allows the users to
                                reach out to and learn more about the company.
                            </Description>
                        </Text>
                    </ProjectLink>
                    <ProjectLink href="https://github.com/mattmcguin/reading-list">
                        <Thumbnail src={ReactLogo} />
                        <Text>
                            <Title>Book Log</Title>
                            <SubTitle>For Fun</SubTitle>
                            <Horizontal>
                                <SubTitle>Tools:</SubTitle>
                                <Tools>
                                    React.js, Apollo, GraphQL,
                                    Styled-Components, Express, MongoDB
                                </Tools>
                            </Horizontal>
                            <SubTitle>Description</SubTitle>
                            <Description>
                                An application that lets users track what books
                                they have read. I built this application to have
                                a list of the books I was reading and also to
                                learn more about GraphQl, Express, and MongoDB.
                            </Description>
                        </Text>
                    </ProjectLink>
                    <ProjectLink href="https://github.com/mattmcguin/vue-todo">
                        <Thumbnail src={VueLogo} />
                        <Text>
                            <Title>To-Do List</Title>
                            <SubTitle>For Fun</SubTitle>
                            <Horizontal>
                                <SubTitle>Tools:</SubTitle>
                                <Tools>Vue.js, Vue-Router, Vuex</Tools>
                            </Horizontal>
                            <SubTitle>Description</SubTitle>
                            <Description>
                                To-Do app that also gives you the weather and
                                time. It pulls the todo items from a JSON
                                creator and formats them into a list. I built
                                this app to present Vue.js in a talk and explore
                                its viability as a replacement tool to using
                                React for client applications.
                            </Description>
                        </Text>
                    </ProjectLink>
                </List>
                <Scroll onClick={this.props.scrollToContact}>
                    ▼ Contact ▼
                </Scroll>
            </Container>
        );
    }
}

import React from 'react';
import { Container } from 'reactstrap';
import './Home.css'

const Home = () => {
    return (
        <Container>
            <div className="home">
                <h1>Welcome to our HttpArchive</h1>
                <p>To use our service please register or login first</p>
            </div>
        </Container>
    );
};

export default Home;

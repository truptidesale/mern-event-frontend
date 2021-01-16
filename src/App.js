import React from 'react';
import { Container } from 'reactstrap'
import Routes from './routes';
import { ContextWrapper } from './user-context'
import './App.css';

function App() {
  return (
    <ContextWrapper>
      <Container fluid>
        <div className="content">
          <Routes />
        </div>
      </Container>
    </ContextWrapper>
  );
}

export default App;

import React, { useState, useContext } from 'react';
import api from '../../services/api'
import logo from '../../assets/logo.png'
import { Alert, Container, Button, Form, FormGroup, Input, Media, Row, Col } from 'reactstrap';
import { UserContext } from '../../user-context';
import './login.css'

export default function Login({ history }) {
    const { setIsloggedIn } = useContext(UserContext);
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState("false")

    const handleSubmit = async evt => {
        evt.preventDefault();
        const response = await api.post('/login', { email, password })
        const user_id = response.data.user_id || false;
        const user = response.data.user || false;

        try {
            if (user && user_id) {
                localStorage.setItem('user', user)
                localStorage.setItem('user_id', user_id)
                setIsloggedIn(true);
                history.push('/')
            } else {
                const { message } = response.data
                setError(true)
                setErrorMessage(message)
                setTimeout(() => {
                    setError(false)
                    setErrorMessage("")
                }, 2000)
            }
        } catch (error) {
            setError(true)
            setErrorMessage("Error, the server returned an error")
        }
    }

    return (
        <Container>
            <Media>
                <img
                    src={logo}
                    className="img-fluid"
                    alt="Book my event"
                />
            </Media>
            <Row>
                <Col sm="12" md={{ size: 8, offset: 3 }}>
                    Welcome to Book My Event App. Please <strong>"Login"</strong> into your account to view and register for the upcoming events in Saskatoon. You can create new events using <strong>"Create Event"</strong> option from menubar. Users will register for the event you have created and you will receive a notification to accept/reject in the <strong>"Registration Requests"</strong> section.
                </Col>
                
            </Row>
            
            <Form onSubmit={handleSubmit}>
                <div className="input-group">
                    <FormGroup className="form-group-"></FormGroup>
                    <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                        <Input type="email" name="email" id="email" placeholder="Your email" onChange={evt => setEmail(evt.target.value)} />
                    </FormGroup>
                    <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                        <Input type="password" name="password" id="password" placeholder="Your password" onChange={evt => setPassword(evt.target.value)} />
                    </FormGroup>
                </div>
                <FormGroup>
                    <Button className="submit-btn">Login</Button>
                </FormGroup>
                <FormGroup>
                    <Button className="secondary-btn" onClick={() => history.push("/register")}>Register</Button>
                </FormGroup>
            </Form>
            {error ? (
                <Alert className="event-validation" color="danger"> {errorMessage}</Alert>
            ) : ""}
        </Container>
    );
}
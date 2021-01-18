import React, { useEffect, useState, useMemo } from 'react';
import api from '../../services/api';
import moment from 'moment';
import { Button, ButtonGroup, Alert, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import socketio from 'socket.io-client';
import './dashboard.css'


export default function Dashboard({ history }) {
    const [events, setEvents] = useState([])
    const user = localStorage.getItem('user')
    const user_id = localStorage.getItem('user_id')

    const [rSelected, setRSelected] = useState(null)
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false)
    const [messageHandler, setMessageHandler] = useState('')
    const [eventsRequest, setEventsRequest] = useState([])
    const [dropdownOpen, setDropDownOpen] = useState(false)
    const [eventRequestMessage, setEventRequestMessage] = useState('')
    const [eventRequestSuccess, setEventRequestSuccess] = useState(false)

    const toggle = () => setDropDownOpen(!dropdownOpen);

    useEffect(() => {
        getEvents()
    }, [])

    const socket = useMemo(
        () =>
            socketio('https://mern-stack-event-project.herokuapp.com/', { query: { user: user_id } }),
        [user_id]
    );

    useEffect(() => {
        socket.on('registration_request', data => setEventsRequest([...eventsRequest, data]));
    }, [eventsRequest, socket])

    const filterHandler = (query) => {
        setRSelected(query)
        getEvents(query)
    }

    const myEventsHandler = async () => {
        try {
            setRSelected('myevents')
            const response = await api.get('/user/events', { headers: { user } })
            setEvents(response.data.events)
        } catch (error) {
            history.push('/login');
        }

    }

    const getEvents = async (filter) => {
        try {
            const url = filter ? `/dashboard/${filter}` : '/dashboard';
            const response = await api.get(url, { headers: { user } })

            setEvents(response.data.events)
        } catch (error) {
            history.push('/login');
        }

    };

    const deleteEventHandler = async (eventId) => {
        try {
            await api.delete(`/event/${eventId}`, { headers: { user: user } });
            setSuccess(true)
            setMessageHandler('The event was deleted successfully!')
            setTimeout(() => {
                setSuccess(false)
                filterHandler(null)
                setMessageHandler('')
            }, 2500)

        } catch (error) {
            setError(true)
            setMessageHandler('Error when deleting event!')
            setTimeout(() => {
                setError(false)
                setMessageHandler('')
            }, 2000)
        }
    }

    const registrationRequestHandler = async (event) => {
        try {
            await api.post(`/registration/${event.id}`, {}, { headers: { user } })
            setSuccess(true)
            setMessageHandler(`The request for the event ${event.title} was successfully!`)
            setTimeout(() => {
                setSuccess(false)
                filterHandler(null)
                setMessageHandler('')
            }, 2500)

        } catch (error) {
            setError(true)
            setMessageHandler(`The request for the event ${event.title} wasn't successfully!`)
            setTimeout(() => {
                setError(false)
                setMessageHandler('')
            }, 2000)
        }
    }

    const acceptEventHandler = async (eventId) => {
        try {
            await api.post(`/registration/${eventId}/approvals`, {}, { headers: { user } })
            setEventRequestSuccess(true)
            setEventRequestMessage('Event approved successfully!')
            removeNotificationFromDashboard(eventId)
            setTimeout(() => {
                setEventRequestSuccess(false)
                setEventRequestMessage('')
            }, 2000)

        } catch (err) {
            console.log(err)
        }
    }

    const rejectEventHandler = async (eventId) => {
        try {
            await api.post(`/registration/${eventId}/rejections`, {}, { headers: { user } })
            setEventRequestSuccess(true)
            setEventRequestMessage('Event rejected successfully!')
            removeNotificationFromDashboard(eventId)
            setTimeout(() => {
                setEventRequestSuccess(false)
                setEventRequestMessage('')
            }, 2000)

        } catch (err) {
            console.log(err)
        }
    }

    const removeNotificationFromDashboard = (eventId) => {
        const newEvents = eventsRequest.filter((event) => event._id !== eventId)
        setEventsRequest(newEvents)
    }

    return (
        <>
            <ul className="notifications">
                {eventsRequest.map(request => {
                    return (
                        <li key={request._id}>
                            <div>
                                <strong>{request.user.email} </strong> is requesting to register to your Event <strong>{request.event.title}</strong>
                            </div>
                            <ButtonGroup>
                                <Button color="secondary" onClick={() => acceptEventHandler(request._id)}>Accept</Button>
                                <Button color="danger" onClick={() => rejectEventHandler(request._id)}>Reject</Button>
                            </ButtonGroup>
                        </li>
                    )
                })}
            </ul>
            {eventRequestSuccess ? <Alert color="success"> {eventRequestMessage}</Alert> : ""}
            <div className="filter-panel">
                <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                    <DropdownToggle color="primary" caret>
                        Select Category
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem onClick={() => filterHandler(null)} active={rSelected === null} >All</DropdownItem>
                        <DropdownItem onClick={myEventsHandler} active={rSelected === 'myevents'} >My Events</DropdownItem>
                        <DropdownItem onClick={() => filterHandler("tech")} active={rSelected === 'tech'} >Tech</DropdownItem>
                        <DropdownItem onClick={() => filterHandler("social")} active={rSelected === 'social'} >Social</DropdownItem>
                        <DropdownItem color="primary" onClick={() => filterHandler('entertainment')} active={rSelected === 'entertainment'} >Entertainment</DropdownItem>
                        <DropdownItem color="primary" onClick={() => filterHandler('charity')} active={rSelected === 'charity'} >Charity</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>

            <div className="event-categories">
                <ButtonGroup>
                    <Button  outline color="primary" onClick={() => filterHandler(null)} active={rSelected === null}>All</Button>
                    <Button outline color="primary" onClick={myEventsHandler} active={rSelected === 'myevents'}>My Events</Button>
                    <Button outline color="primary" onClick={() => filterHandler("tech")} active={rSelected === 'tech'}>Tech</Button>
                    <Button outline color="primary" onClick={() => filterHandler("social")} active={rSelected === 'social'}>Social</Button>
                    <Button outline color="primary" onClick={() => filterHandler('entertainment')} active={rSelected === 'entertainment'}>Entertainment</Button>
                    <Button outline color="primary" onClick={() => filterHandler('charity')} active={rSelected === 'charity'}>Charity</Button>
                </ButtonGroup>
            </div>
            <ul className="events-list">
                {events.map(event => (
                    <li key={event._id}>
                        <header style={{ backgroundImage: `url(${event.thumbnail_url})` }}>
                            {event.user === user_id ? <div><Button color="danger" size="sm" onClick={() => deleteEventHandler(event._id)}>Delete</Button></div> : ""}
                        </header>
                        
                            <strong>{event.title}</strong>
                            <span>Date: {moment(event.date).format('ll')}</span>
                            <span>Price: {parseFloat(event.price).toFixed(2)}</span>
                            <span className="eve-desc">Description: {event.description}</span>
                        
                        <Button className="event-btn" color="primary" onClick={() => registrationRequestHandler(event)}>Register</Button>
                    </li>
                ))}
            </ul>
            {
                error ? (
                    <Alert className="event-validation" color="danger"> {messageHandler} </Alert>
                ) : ""
            }
            {
                success ? (
                    <Alert className="event-validation" color="success"> {messageHandler}</Alert>
                ) : ""
            }
        </>
    )
}
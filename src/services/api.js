import axios  from 'axios';  

const api = axios.create({
    baseURL:'https://mern-stack-event-project.herokuapp.com/'
})

export default api;

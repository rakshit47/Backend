# Challenge Task 1
 
 These files are for the challenge provided by Deep Thought asa test.
 
 ## Available Scripts

 In the project directory, you can run:

 ### `npm start`
 
 Runs the app in the development mode.\
 Open [http://localhost:8000](http://localhost:8000) to view it in the browser.

 Test these APIs on directly on [Postman](https://www.getpostman.com/collections/1f4f10f2ef2cd136b505).
 
 ### API
 
 `GET`  http://localhost:8000/api/v3/app/events?id=*event_id*
 `GET`  http://localhost:8000/api/v3/app/events?type=*latest*&limit=2&page=0 _{type : latest, normal }_
 `POST` http://localhost:8000/api/v3/app/events
 `PUT`  http://localhost:8000/api/v3/app/events/*:id*
 `DEL`  http://localhost:8000/api/v3/app/events/*:id*

# User Authentication Microservice

## Overview
This is a user authentication microservice that allows users to register for a new account, log into an existing account, and verifying that their current user session is valid. This microservice implements the use of JSON Web Tokens (JWT) to ensure that only authorized users can access protected pages. 

In the client program, users can choose to either login with a valid username and password or register for a new account. When a user has successfully logged into their account, the microservice sends a signed JWT to the client program that is valid for one hour. That means that the user can access protected pages while they are logged in for one hour. After an hour, the JWT expires and the user can no longer access protected pages. 

### Prerequisites for the client program:
1. A registration page with username and password input fields
   - where you make a call to ```localhost:3000/api/auth/register``` 
3. A login page with username and password input fields
   - where you make a call to ```localhost:3000/api/auth/login``` 
5. A ProtectedRoutes function that will be used to specify which pages will be locked if the user is not logged in
   - where you make a call to ```localhost:3000/api/auth/verify``` 
7. A logout function to remove the JWT stored in localStorage (optional)

### Running Microservice A
1. Navigate to the same folder where ```server.mjs``` is stored.
2. Run the following command in your terminal: ```node server.mjs```
3. The microservice will be running on ```localhost:3000```

## REQUEST and RECEIVE data from microservice

### Registering
* Fetching from: ```localhost:3000/api/auth/register```
* Method: POST
* Header: ```{ 'Content-Type': 'application/json' }```
* Body: ```{ username, password }```
  * Example of JSON body to send to microservice:
  ```{"username": "test_user", "password": "test_password"}```
* REQUEST: 
  * Verification that username is not already taken 
* RECEIVE: 
  * If username is not taken: a message indicating “User registered successfully” in JSON format (status code 201) 
  * If username is taken: a message indicating “User already exists” in JSON format (status code 400)
* Example call:
```javascript
try {
    const response = await fetch(`http://localhost:3000/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    if (response.ok) {
        localStorage.setItem('token', data.token); // Store token
    } else {
        alert(`Error: ${data.message}`);
    }
} catch (error) {
    console.error('Error:', error);
}
```

### Logging In
* Fetching from: ```localhost:3000/api/auth/login```
* Method: POST
* Header: ```{ 'Content-Type': 'application/json' }```
* Body: ```{ username, password }```
  * Example of JSON body to send to microservice:
  ```{"username": "test_user", "password": "test_password"}```
* REQUEST: 
  * Verification that username and password are valid
* RECEIVE: 
  * If username and password are valid: a signed JWT in JSON format to store in the client program’s localStorage (status code 200)
  * If username and password are invalid: a message indicating “Invalid credentials” in JSON format (status code 400)
* Example call:
```javascript
try {
    const response = await fetch(`http://localhost:3000/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    if (response.ok) {
        localStorage.setItem('token', data.token); // Store token
    } else {
        alert(`Error: ${data.message}`);
    }
} catch (error) {
    console.error('Error:', error);
}
```

### Verifying
* Fetching from: ```localhost:3000/api/auth/verify```
* Method: POST
* Header: ```{ 'Authorization': `Bearer ${token}`}```
* REQUEST:
  * Verification that the JWT stored in localStorage (after logging in) is valid
* RECEIVE:
  * If the JWT is valid: the variable “valid” set to boolean True AND a decoded JWT (status code 200)
  * If the JWT is invalid or expired: the variable “valid” is set to boolean False AND the message “​​Invalid or expired token” (status code 401)
* Example call:
```javascript
const navigate = useNavigate();
const token = localStorage.getItem('token');
        if (token) {
            fetch('http://localhost:3000/api/auth/verify', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.valid) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                    navigate('/'); // Redirect to login if token is not valid
                }
            })
            .catch(() => {
                setIsAuthenticated(false);
                navigate('/'); // Redirect to login on error
            });
        } else {
            navigate('/'); // Redirect to login if no token found
        }
    }, [navigate]);
```

## UML Diagrams
### Register a new user (POST)
![image](https://github.com/user-attachments/assets/52c408f8-c64d-49b3-bda4-dfcb1ca3e96b)

### Login an existing user (POST)
![image](https://github.com/user-attachments/assets/2d8ae2b6-d8b7-4c88-a407-e860886f7b55)

### Verify an existing user (POST)
![image](https://github.com/user-attachments/assets/36e4bc78-6b5e-47d8-a7b6-25ff4a8cee38)

## Test user authentication microservice via cURL
### Register for a new account
```
curl -X POST http://localhost:3000/api/auth/register \
-H "Content-Type: application/json" \
-d '{"username": "test", "password": "test"}'
```

On success
```
{"message":"User registered successfully"}
```

On fail
```
{"message":"User already exists"}
```

### Log into an existing account
```
curl -X POST http://localhost:3000/api/auth/login \
-H "Content-Type: application/json" \
-d '{"username": "noelle", "password": "noelle"}'
```

On success
```
{"token":"<secret_JWT>"}
```

On fail
```
{"message":"Invalid credentials"}
```

### Verifying if an account is valid
```
curl -X POST http://localhost:3000/api/auth/verify -H "Authorization: Bearer <secret_JWT>"
```

On success
```
{"valid":true,"user":{"id":"<JWT_id>","iat":<time_when_JWT_was_created>,"exp":<time_when_JWT_will_expire>}}
```

On fail
```
{"valid":false,"message":"Invalid or expired token"}
```

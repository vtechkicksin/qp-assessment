# QuestionPro

Grocery booking APIs

API Documentation
This document outlines the endpoints and their functionalities for interacting with the grocery application.

# Managing User Roles by SuperAdmin

In our system, a superAdmin has the authority to modify the roles of users. This includes the ability to promote a user to an admin or demote an admin to a regular user. This feature provides flexibility in managing user roles and permissions, allowing the superAdmin to adapt the system to changing organizational needs and user responsibilities.

# Change User Roles

# changeRoles (POST)

-> URL:http://localhost:3000/updateRole


Request Payload:
{
    "superAdmin":"superAdmin.logipe@gmail.com", 
    "emailToChange":"osho@gmail.com",
    "rolesToChange":"user" 
}



superAdmin => this id will be checked from config file
emailToChange => the desired user to change the roles
rolesToChange => either user or admin




1. Register User (POST)
   Register a new user with the system.

URL: http://localhost:3000/registerUser
Request Payload:

{
"name": "sample",
"email": "sample@gmail.com",
"password": "password",
"passwordConfirm": "password"
}
Response:
{
"success": 1,
"message": "User registered successfully"
}

2. Login (POST)
   Authenticate a user with the system and generate an access token.

URL: http://localhost:3000/login
Request Payload:

{
"email": "sample@gmail.com",
"password": "password"
}
Response:

{
"success": 1,
"message": "Login successful",
"token": "<access_token>"
}

3. Add New Grocery (POST)
   Add new grocery items to the system. Requires admin privileges.

URL: http://localhost:3000/addNewGrocery
Request Payload:
[
{
"name": "maggie",
"price": 15,
"quantity_left": 10
},
{
"name": "appyfiz",
"price": 20,
"quantity_left": 10
},
...
]
Response:

{
"message": "Grocery items added successfully"
}

4. View Grocery (GET)
   View all existing grocery items in the system. Public access.

URL: http://localhost:3000/viewGrocery
Response:

[
{
"item_id": "1",
"name": "maggie",
"price": 15,
"quantity_left": 10
},
{
"item_id": "2",
"name": "appyfiz",
"price": 20,
"quantity_left": 10
},
...
]

5. Remove Grocery Items (POST)
   Remove specified grocery items from the system. Requires admin privileges.

URL: http://localhost:3000/removeGrocery
Request Payload:

["maggie", "appyfiz", ...]
Response:

{
"message": "Grocery items removed successfully"
}

6. Update Grocery Items (POST)
   Update details of existing grocery items. Requires admin privileges.

URL: http://localhost:3000/updateGrocery
Request Payload:
[
{
"item_id": "1",
"name": "maggie",
"price": 15,
"quantityToAdd": 5
},
...
]
Response:

{
"success": 1,
"message": "Grocery items updated successfully"
}

7. Order Grocery (POST)
   Place an order for multiple grocery items. Requires user authentication.

URL: http://localhost:3000/order
Request Payload:
[
{
"name": "maggie",
"quantity": 2
},
{
"name": "appyfiz",
"quantity": 1
},
...
]
Response:

{
"success": 1,
"message": "Order placed successfully"
}
Authentication
Role-based Access: Different endpoints have different access restrictions based on user roles. Admins have access to certain endpoints that regular users do not.
Authorization Token: Users must include an authorization token in the request headers to access protected endpoints. The token is obtained during login and must be included in subsequent requests.

# About

This code is a guide on how to set up a cookie authentication for a Web application using Node.js and Express.js
It also has an implementation of how to connect to MongoDB database from Node.js and set up the collections and documents using the Schema.

## To set a cookie over a https Protocol and same domain

### Configuration code in virtual sites [Nginx]

[Navigate To]() **etc/nginx/sites-enabled/**

Add this piece of code in the location object

![Code](/Assets/nginx%20code.png)

### Configuration for express-session MiddleWare [Node]

[Navigate To](./index.js) index.js

Set proxy: _true_.  
Set sameSite && secure attributes to _true_ in cookie Object

![Code](/Assets/node%20middleware%20code.png)

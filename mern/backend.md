# Back End Fundamentals

## What happens when we access a website?

1. **DNS Lookup**: The domain name is converted into an IP address.
2. **HTTP Request**: A request is sent to the server.
3. **Server Processing**: The server processes the request.
4. **HTTP Response**: The server sends back a response.
5. **Rendering**: The browser renders the response.

## Static Websites vs Dynamic Websites

1. **Static Websites**: The content is fixed and does not change unless the developer changes it.
2. **Dynamic Websites**: The content changes based on the user, time, etc.(server-side rendering).
3. **API-Powered Websites**: The content changes based on the user, time, etc.(client-side rendering).

## API

1. **API**: Application Programming Interface.
2. **REST API**: Representational State Transfer API.
3. **GraphQL API**: Query language for APIs.

### Rest Architecture

1. Separate API into logical resources.
2. Expose structured URLs.
3. Use standard HTTP methods.
4. Return JSON data.
5. Be stateless.

### HTTP Methods

1. **GET**: Retrieve data.
2. **POST**: Submit data.
3. **PUT**: Update data.
4. **PATCH**: Partially update data.
5. **DELETE**: Delete data.

### HTTP Status Codes

> [!IMPORTANT]
> HTTP status codes:
>
> - 200 OK
> - 201 Created
> - 204 No Content
> - 400 Bad Request
> - 401 Unauthorized
> - 403 Forbidden
> - 404 Not Found
> - 500 Internal Server Error

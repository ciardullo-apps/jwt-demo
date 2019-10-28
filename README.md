# JWT Demo
Demonstrates the use of JSON Web Token in ExpressJS, NodeJS and Angular2.

## NodeJS Backend
The backend uses JSON Web Token to both sign and verify an arbitrary user-specific value, which is then used as the authorization token for subsequent requests.

Access control headers must be set to allow [Cross Origin Resource Sharing](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) (CORS) and prevent requests forbidden by default due to the [same-origin-security-policy](https://en.wikipedia.org/wiki/Same-origin_policy).

Upon login, the user's id (email address) is signed using a secret key and sent to the client in the response body. (TODO use response header instead). Angular then stores the signed token value in window localStorage for transmission to the server on subsequent requests.

The backend protects sensitive resources using JWT.verify() using the same secret key and the signed token, which is sent as a request header by Angular (see below). Once verified, it is decoded, providing the user email address.

#### Configure dotenv
The ExpressJS / NodeJS backend uses dotenv to manage environment-specific settings. To configure dotenv, create a file called .env in the backend directory with the following:

```sh
# .env
NODE_ENV=development
PROTOCOL=https
HOSTNAME=myhost
PORT_BACKEND=3001
PORT_FRONTEND=4200
CONTEXT=jwt-demo
JWT_KEY=secretSharedKey
TLS_KEY_PATH=server.key
TLS_CERT_PATH=server.crt
TLS_CERT_AUTH_PATH=serverCA.crt
```

## Angular Frontend
The frontend contains AuthService, which is used to manage the signed token in window localStorage. It also contains the client functions to login, logout, and invoke one protected route in the backend for demonstration purposes.
* login sends the email and password to the backend using HTTP POST, receives the signed token from the response, and stores it in localStorage.
* logout removes the signed token from localStorage
* buildHeaders uses HttpHeaders in Angular to hold the _Authorization_ request header which contains the signed key from window localStorage
* getBalance demonstrates how to send the signed token in the request header to the backend, where it is verified by JWT and decoded (see above)

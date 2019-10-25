const express = require('express');
const port = 3001;
const bodyParser = require('body-parser');
const app = express();
const https = require('https');
const fileStream = require('fs');
const jwt = require('jsonwebtoken');
const secretEncryptionKey = 'secretSharedKey'; // TODO Determine your own value
app.use(bodyParser.json());

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS');
	res.setHeader('Access-Control-Allow-Credentials', 'true');
	next();
});

const router = express.Router();
app.use('/jwt-demo', router);

router.get('/api', (req, res) => {
  res.json( {
    message: 'Welcome to the API'
  })
  .status(200)
  .end();
});

// Users must come from a remote source. Hardcoded for the purposes of demonstration.
const appUsers = {
  'foo@mail': {
    email: 'foo@mail',
    name: 'John Smith',
    pw: '1234'
  },
  'bar@mail': {
    email: 'bar@mail',
    name: 'Jane Smith',
    pw: '1235'
  }
}

const validatePayloadMiddleware = (req, res, next) => {
  if(req.body) {
    next();
  } else {
    res.status(403).send({
      errorMessage: 'No payload'
    })
  }
};

router.post('/api/login', validatePayloadMiddleware, (req, res) => {
  console.log("In api/login " + req.body.email);
  const user = appUsers[req.body.email];
  if(user && user.pw === req.body.password) {
    const userSansPassword = {...user};
    delete userSansPassword.pw;
    const token = jwt.sign(userSansPassword, secretEncryptionKey);
    res.status(200).send({
      user: userSansPassword,
      token: token
    });
  } else {
    res.status(403).send({
      errorMessage: 'Permission denied'
    });
  }
});

const jwtMiddleware = (req, res, next) => {
  const authString = req.headers['authorization'];
	if(typeof authString === 'string' && authString.indexOf(' ') > -1) {
		const authArray = authString.split(' ');
		const token = authArray[1];
		jwt.verify(token, secretEncryptionKey, (err, decoded) => {
			if(err) {
				res.status(403).send({
		      errorMessage: 'Permission denied'
		    });
			} else {
				req.decoded = decoded;
				next();
			}
		});
	} else {
		res.status(403).send({
			errorMessage: 'Permission denied'
		});

	}
};

const accountBalances = {
	'foo@mail': 19870,
	'bar@mail': 21320
};

const getBalance = (email) => {
	return accountBalances[email];
};

router.get('/api/balance', jwtMiddleware, (req, res) => {
	const user = req.decoded;
	const balance = getBalance(user.email);
	if(balance) {
		res.status(200).send({
			balance: balance
		});
	} else {
		res.status(500).send({
			error: 'Blah blah'
		});
	}
});

const server = https.createServer({
	key: fileStream.readFileSync('server.key'),
	cert: fileStream.readFileSync('server.crt'),
	ca: fileStream.readFileSync('serverCA.crt'),
}, app);

server.listen(port);

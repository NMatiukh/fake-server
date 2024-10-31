const jsonServer = require('json-server');
const clone = require('clone');
const data = require('./db.json');
const corsOptions = {
    origin: 'http://127.0.0.1:5500', // Замість '*' вкажіть ваш конкретний домен
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true // Якщо потрібна підтримка куків
};
server.use(cors(corsOptions));


const isProductionEnv = process.env.NODE_ENV === 'production';
const server = jsonServer.create();

// Додаємо проміжний шар для CORS
server.use(cors());

const router = jsonServer.router(isProductionEnv ? clone(data) : 'db.json', {
    _isFake: isProductionEnv
});
const middlewares = jsonServer.defaults();

server.use(middlewares);

// Запобігаємо зміні даних у production
server.use((req, res, next) => {
    if (req.path !== '/')
        router.db.setState(clone(data));
    next();
});

server.use(router);
server.listen(process.env.PORT || 8000, () => {
    console.log('JSON Server is running');
});

// Export the Server API
module.exports = server;

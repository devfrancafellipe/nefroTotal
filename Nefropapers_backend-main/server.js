const env = require('./env/index.js')
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http'); 
const { Server } = require('socket.io'); 
const { validateApiKey } = require('./middlewares/authMiddleware');
const apiKeyController = require('./controllers/apiKeyController');

const app = express();
const server = http.createServer(app); 

// const io = new Server(server, {
//   cors: {
//     origin: 'http://147.93.70.83/'
//   },
// });

// const allowedOrigins = ['http://127.0.0.1:5500', 'http://147.93.70.83:5500'];
// const allowedOrigins = 'http://147.93.70.83/';
// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error('Origin not allowed by CORS'));
//       }
//     },
//   })
// );

app.use(bodyParser.json());
app.use(cors())

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const moduleRoutes = require('./routes/moduleRoutes');
const questionRoutes = require('./routes/questionRoutes');
const simulationRoutes = require('./routes/simulationRoutes');
const storageRoutes = require("./routes/storageRoutes");

app.use('/auth', authRoutes);
app.post('/generate-api-key', validateApiKey, apiKeyController.gerarApiKey);
app.use('/usuarios', userRoutes);
app.use('/modulos',  moduleRoutes);
app.use('/questoes',  questionRoutes);
app.use('/simulados', simulationRoutes);

app.use("/storage", storageRoutes);


app.get('/', (req, res) => {
  res.send('Backend funcionando!');
});

// io.on('connection', (socket) => {
//   console.log('Usuário conectado:', socket.id);

//   socket.on('joinTest', (testId) => {
//     socket.join(testId);
//     console.log(`Usuário entrou no teste: ${testId}`);
//   });

//   socket.on('disconnect', () => {
//     console.log('Usuário desconectado:', socket.id);
//   });
// });

const notifyTestUpdate = (testId) => {
  io.to(testId).emit('testUpdated', { testId });
};

module.exports = { app };

const PORT = env.PORT;
const HOST = env.HOST;
server.listen(PORT, HOST, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Ambiente: ${env.NODE_ENV}`);
  console.log(`Servidor disponível em: ${env.PROXY}${HOST}:${PORT}`);
});

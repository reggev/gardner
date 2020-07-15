const jsonServer = require('json-server');
const app = jsonServer.create();
const router = jsonServer.router('./db.json');
const middlewares = jsonServer.defaults();
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(middlewares);

app.post('/samples', (req, res) => {
  console.log(req.body);
  return res.json({ minutes: 0.1 });
});

app.use(router);

app.listen(PORT, () => {
  console.info(`running on port ${PORT}\n\t press ctrl+c to stop...`);
});

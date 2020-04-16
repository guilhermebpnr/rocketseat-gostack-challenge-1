const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

/**
 * POST /repositories: A rota deve receber title, url e techs dentro do corpo da requisição, 
 * sendo a URL o link para o github desse repositório. Ao cadastrar um novo projeto, ele deve 
 * ser armazenado dentro de um objeto no seguinte formato: 
 * { 
 *   id: "uuid", 
 *   title: 'Desafio Node.js', 
 *   url: 'http://github.com/...', 
 *   techs: ["Node.js", "..."], 
 *   likes: 0 
 * }; 
 * 
 * Certifique-se que o ID seja um UUID, e de sempre iniciar os likes como 0.
 */
app.post("/repositories", (request, response) => {
  const id = uuid();
  const { title, url, techs, likes = 0 } = request.body;

  const repo = { id, title, url, techs, likes };

  repositories.push(repo);

  return response.status(201).json(repo);
});

/**
 * A rota deve alterar apenas o 
 * título, a url e as techs 
 * do repositório que possua o id igual ao id presente nos parâmetros da rota;
 */
app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if (repoIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' });
  }

  const { title, url, techs } = request.body;
  const { likes } = repositories[repoIndex];

  const repo = { id, title, url, techs, likes };

  repositories[repoIndex] = repo;

  return response.json(repo);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if (repoIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' });
  }

  repositories.splice(repoIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if (repoIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' });
  }

  const { title, url, techs } = repositories[repoIndex];
  const likes = repositories[repoIndex].likes + 1;

  const repo = { id, title, url, techs, likes };

  repositories[repoIndex] = repo;

  return response.json(repo);
});

module.exports = app;

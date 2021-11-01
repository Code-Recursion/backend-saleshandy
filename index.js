const express = require("express");
const app = express();
const fetch = require("node-fetch");
app.use(express.json());

const cors = require('cors')

app.use(cors())

let users = [
  {
    id: 1,
    name: "Bruce Wayne",
    created: "2021-11-01T03:15:37.758Z",
    aadhaar: "43567897654",
    ip: "171.61.58.51",
    state: "KL",
    vaccinated: true,
  },
  {
    id: 2,
    name: "Alan Walker",
    created: "2021-11-01T03:15:37.758Z",
    aadhaar: "32456567567",
    ip: "171.61.58.51",
    state: "KL",
    vaccinated: false,
  },
  {
    id: 3,
    name: "Peter Parker",
    created: "2021-11-01T03:15:37.758Z",
    aadhaar: "85567845766",
    ip: "171.61.58.51",
    state: "KL",
    vaccinated: true,
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/users", (request, response) => {
  response.json(users);
});

app.get("/api/info", async (req, res) => {
  const response = await fetch("https://api.ipify.org/?format=json", {
    method: "get",
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
  console.log(data);
  res.send(
    `<p>last request was sent on ${new Date()} <br/> ip : ${data.ip}</p>`
  );
});

app.get("/api/totalRecords", (request, response) => {
  response.send(`<p>Total Records registered : ${users.length}</p>`);
});

const generateId = () => {
  const maxId = users.length > 0 ? Math.max(...users.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.post("/api/users", async (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({
      error: `user's name is missing`,
    });
  } else if (!body.aadhaar) {
    return response.status(400).json({
      error: `user's aadhaar number is missing`,
    });
  } else if (!body.state) {
    return response.status(400).json({
      error: `user's state is missing`,
    });
  } else if (!body.vaccinated) {
    return response.status(400).json({
      error: `user's vaccinated status is missing`,
    });
  }

  console.log("body", body);
  const res = await fetch("https://api.ipify.org/?format=json", {
    method: "get",
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();
  const user = {
    id: generateId(),
    created: new Date(),
    aadhaar: body.aadhaar,
    ip: data.ip,
    state: body.state,
    vaccinated: body.vaccinated,
  };
  users = users.concat(user);
  response.json(user);
});

app.get("/api/user/:id", (request, response) => {
  const id = Number(request.params.id);
  const user = users.find((record) => {
    return record.id === id;
  });
  console.log("user ", user);
  response.json(user);
});

app.get("/api/user/aadhaar/:aadhaar", (request, response) => {
  const aadhaar = request.params.aadhaar;
  const user = users.find((user) => {
    return user.aadhaar === aadhaar;
  });
  console.log(user);
  response.json(user);
});

app.get("/api/ip", function (req, res) {
  var url = "https://api.ipify.org/?format=json";
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log("your ip is : ", data.ip);
      res.send({ ip: data.ip });
    })
    .catch((err) => {
      console.log("error", err);
    });
});

app.delete("/api/users/:id", (request, response) => {
  const id = Number(request.params.id);
  users = users.filter((user) => user.id !== id);
  response.status(204).end();
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("------");
  next();
};

app.use(requestLogger);
app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});

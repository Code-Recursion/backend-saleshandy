const User = require("../models/user");
const userRouter = require("express").Router();

// userRouter.get("/", (request, response) => {
//   response.send("<h1>Hello World!</h1>");
// });

userRouter.get("/", (request, response) => {
  User.find({}).then((users) => {
    response.json(users);
  });
});

userRouter.get("/api/info", async (req, res) => {
  const response = await fetch("https://api.ipify.org/?format=json", {
    method: "get",
    headers: { "Content-Type": "userRouterlication/json" },
  });
  const data = await response.json();
  console.log(data);
  res.send(
    `<p>last request was sent on ${new Date()} <br/> ip : ${data.ip}</p>`
  );
});

userRouter.get("/api/totalRecords", (request, response) => {
  response.send(`<p>Total Records registered : ${users.length}</p>`);
});

const generateId = () => {
  const maxId = users.length > 0 ? Math.max(...users.map((n) => n.id)) : 0;
  return maxId + 1;
};

userRouter.post("/", async (request, response) => {
  const body = request.body;

  //basic server side validation
  if (body.name === undefined) {
    return response.status(400).json({
      error: `user's name is missing`,
    });
  } else if (body.aadhaar === undefined) {
    return response.status(400).json({
      error: `user's aadhaar number is missing`,
    });
  } else if (body.state === undefined) {
    return response.status(400).json({
      error: `user's state is missing`,
    });
  } else if (body.vaccinated === undefined) {
    return response.status(400).json({
      error: `user's vaccinated status is missing`,
    });
  } else if (body.aadhaar.length != 12) {
    return response.status(400).json({
      error: `invalid aadhaar number`,
    });
  }

  //generating ip for the user
  const res = await fetch("https://api.ipify.org/?format=json", {
    method: "get",
    headers: { "Content-Type": "userRouterlication/json" },
  });

  const data = await res.json();

  const user = new User({
    name: body.name,
    aadhaar: body.aadhaar,
    created: new Date(),
    vaccinated: body.vaccinated,
    state: body.state,
    ip: data.ip,
  });
  console.log("user to be saved ", user);
  user.save().then((savedUser) => {
    response.json(savedUser);
  });

  // const user = new User({
  //   name: "abc mongo",
  //   aadhaar: "586758695768",
  //   vaccinated: true,
  //   state: "MP",
  // });

  // user.save().then((result) => {
  //   console.log("user saved!");
  // });
});

// get user by given id
userRouter.get("/:id", (request, response, next) => {
  User.findById(request.params.id)
    .then((user) => {
      if (user) {
        response.json(user);
      } else {
        reponse.status(404).end();
      }
    })
    .catch((error) => next(error));
});

// get user by given aadhaar
userRouter.get("/aadhaar/:aadhaar", (request, response) => {
  const aadhaar = request.params.aadhaar;
  const user = users.find((user) => {
    return user.aadhaar === aadhaar;
  });
  console.log(user);
  response.json(user);
});

//get ip for the current user
userRouter.get("/api/ip", (req, res) => {
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

// delete user by given id
userRouter.delete("/:id", (request, response) => {
  // const id = Number(request.params.id);
  // users = users.filter((user) => user.id !== id);
  // response.status(204).end();
  users
    .findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

module.exports = userRouter;

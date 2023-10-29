// viewrouter.js
const express = require("express");
const userServices = require("../users/users.services.js");
const cookieParser = require("cookie-parser");
const TaskModel = require("../model/TaskModel.js");
const taskService = require("../task/task_controller");
const taskRouter = require("../task/task_router");
// const auth = require('../auth/auth_login')
const jwt = require("jsonwebtoken");
const app = require("../api.js");
require("dotenv").config();
const router = express.Router();

router.use(cookieParser());
router.use('/tasks', taskRouter)



router.get("/", (req, res) => {
  res.render("home");
});
router.get("/signup", (req, res) => {
  const message = "";
  res.render("signup",  { user: req.user, message })  ;
});

router.get("/login", (req, res) => { 
  res.render("login");
 });

router.post("/signup", async (req, res) => {
  try {
    const response = await userServices.Signup({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    });
    console.log(response);

    if (response.success) {
        res.redirect("login");
    } else {
      const message = response.message;
        res.render("signup", { message, user: req.user })   
    }
} catch (error) {
  res.status(500).json({
    success: false,
    message: error.message,
  });
}
});


router.post("/login", async (req, res) => {
  const response = await userServices.Login({
    email: req.body.email,
    password: req.body.password,
  }); 
  console.log(response);

  if (response.success ) {
    res.cookie("jwt", response.data.token, {maxAge: 1000 * 60 * 60 * 24});
    res.redirect("task");
  } else {
    res.render("login");
  }
});


router.use(async (req, res, next) => {
      const token = req.cookies.jwt;

    if (token) {
        try {
            const decodedValue = await jwt.verify(token, process.env.JWT_SECRET);

            res.locals.user = decodedValue
            next()
        } catch (error) {
            res.redirect('/login')
        }
    } else {
        res.redirect('/login')
    }
})

router.get('/logout', (req, res) => {
    // res.cookie('jwt', '', { maxAge: 1 });
    res.clearCookie('jwt');
    res.render('index');
})

router.get('/task', async (req, res) => {
  const user_id = res.locals.user.id;

  const response = await taskService.getTasks(user_id);

  res.render('task', { 
    user: res.locals.user, 
    tasks: response.data.tasks
  });

  console.log({ user: res.locals.user });
  console.log(response);
});




 
router.get('/task/create', (req, res) => {
  res.render('taskcreate')
} )

router.post('/task/create', async (req, res) => {
  console.log({ body : req.body })
  req.body.user_id = res.locals.user.id;
  console.log({ body : req.body.user_id })
  const response = await taskService.createTask(req.body);


  if (response.code === 200) {
      res.redirect('/views/task')
  } else {
      res.render('taskcreate', { error: response.message })
  }
})


// Inside your Express router







module.exports = router;

const express = require('express');
const Admin = require('../models/admin');
const Student = require('../models/student');
const Teacher = require('../models/teacher');
const Course = require('../models/course');
const User = require('../models/users');
const Test = require('../models/test');
const auth = require('../middleware/auth');
// const pro = require('../test');
const browserify = require('browserify')
const path = require('path');
// const hbs = require('hbs');
const bodyparser = require('body-parser');
const { stringify } = require('querystring');
// const title } = require('process');
const router = new express.Router();
router.use(bodyparser.urlencoded({
  extended: true
}));

router.get('/', async (req, res) => {
  res.render('index', {
    title: 'Login Page',
    // name : 'Sujith S'
  });

})

router.post('/chat', async (req, res) =>{
  console.log(req.body);
  res.status(200).send();
})

router.get('/chat_list/:user1&:user2&:roll', async (req, res) => {
  // console.log(req.params);
  const roll = req.params.roll;
  const reqData = req.params;
  var user1Data;
  if (roll === 'student') {
    const mainUserData = await Student.findById(req.params.user1);
    user1Data = await User.findOne({ email: mainUserData.email });
    // console.log('user1data::',user1Data)
  } else if (roll === 'teacher') {
    const mainUserData = await Teacher.findById(req.params.user1);
    user1Data = await User.findOne({ email: mainUserData.email });
    // console.log('user1data::', mainUserData.name)
  }
  const userdata = await User.findById(req.params.user2);
  // console.log(userdata.name)
  const username = userdata.name;
  const room = userdata.roll;
  // console.log(value)
  // value = 'hello from router';
  const userIdData = [];
  for (const i in reqData) {
    // console.log(i)
    if (i === 'user1') {
      userIdData.push(user1Data._id.toString())
    } else {
      userIdData.push(reqData[i])
    }
  }
  const userId = userIdData[0];

  // /console.log('userid ::', userId)
  const exist = await Room.findOne({ mainUser: userId });
  // console.log('Room data exist ::', exist)
  let count = 0;

  if (exist) {
    console.log('found');
    const existData = exist.userIds;
    // console.log( existData.length);
    for (let i = 0; i < existData.length - 1; i++) {
      if (existData[i] === userIdData[i]) {
        // console.log(existData[i]);
        count += 1;
      }
      // console.log(existData[i]);
    }
    console.log(count)

    switch (count) {
      case 1: const roomData = new Room({ mainUser: userId, userIds: userIdData });
        roomData.save();
        res.redirect(`/chat.html?username=${userId}&room=${roll}`);
        break;
      case 2:
        res.redirect(`/chat.html?username=${userId}&room=${roll}`);
        break;
    }

  } else {
    // console.log('not found');
    const roomData = new Room({ mainUser: userId, userIds: userIdData });
    roomData.save();
    res.redirect(`/chat.html?username=${userId}&room=${roll}`);
  }

});

router.get('/chat/:id&:roll', async (req, res) => {
  const roll = req.params.roll;
  if (req.params.roll === 'student') {
    const userdata = await Student.findById(req.params.id);
    const users = await User.find({});
    let users_data = []
    for (const i in users) {
      if (users[i].name !== userdata.name) {
        users_data.push(users[i]);
      }
    }
    const useremail = userdata.email;
    const userid = userdata.id;
    res.render('index_chat', {
      users_data,
      userdata,
      useremail,
      userid,
      roll
    })
  } else if (req.params.roll === 'teacher') {
    const userdata = await Teacher.findById(req.params.id);
    const users = await User.find({});
    let users_data = []
    for (const i in users) {
      if (users[i].name !== userdata.name) {
        users_data.push(users[i]);
      }
    }
    const useremail = userdata.email;
    const userid = userdata.id;
    res.render('index_chat', {
      users_data,
      userdata,
      useremail,
      userid,
      roll
    })
  }
  })
    

router.get('/test', async (req, res) => {

  res.render('test', {
    title: 'Login Page',
  });

})

router.get('/about', (req, res) => {
  res.render('about', {
    title: 'About Me',
    // name : 'Sujith S'
  });
});

//***********************Admin Login********* */
router.get('/login/admin', async (req, res) => {
  res.render('loginAdmin');
})

router.post('/login/admin', async (req, res) => {
  try {
    // console.log(req.body)
    const admin = await Admin.findOne({ email: req.body.email, password: req.body.password });
    if (admin) {

      return res.redirect('/admin/dashboard');
    }
  } catch (e) {
    res.status(400).send(e)
  }
});

//***************Teacher Login*************** */
router.get('/login/teacher', async (req, res) => {
  res.render('loginTeacher');
})

router.get('/teacher/dashboard/:id', async (req, res) => {

  const student = await Student.find({});
  const teacher = await Teacher.findById(req.params.id);
  res.render('teacherDashboard', {
    title: 'Teacher Page',
    body: teacher.name,
    teacher,
    student
  });
});

router.get('/student/dashboard/:id', async (req, res) => {

  _id = req.params.id;
  const student = await Student.findById(req.params.id);
  res.render('studentDashboard', {
    title: 'Student Page',
    student
    // teacher
  });
});

router.get('/student/score/:id', async (req, res) => {
  _id = req.params.id;
  const student = await Student.findById(req.params.id)
  const course = await Course.findOne({ studentName: student.name, subject: student.subject });
  const test = await Test.findOne({ studentName: student.name, subject: student.subject });
  marks = test.score;
  totalQuestions = test.answer.length
  score = (marks / totalQuestions) * 10;
  res.render('testing', {
    score,
    course,
    _id
  })
});

//*************************login*********************** */
router.post('/login', async (req, res) => {

  try {
    const admin = await Admin.findOne({ email: req.body.email, password: req.body.password });
    if (admin) {

      return res.redirect('/admin/dashboard');
    } else {
      const user = await User.findByCredentials(req.body.email, req.body.password);;
      const token = await user.generateAuToken();
      if (!user) {
        return res.status(404).send();
      }
      // console.log(user.roll)
      if (user.roll === 'not assigned') {
        res.render('notAssigned', {
          title: 'Home Page',
          user,
          message: ' Pls wait for Admin to assigned',
          // name: 'Sujith S'
        });
      } else if (user.roll === 'student') {
        try {
          const student = await Student.findByCredentials(req.body.email, req.body.password);
          const token = await student.generateAuToken();
          const student_id = student._id;
          if (!student) {
            return res.status(404).send();
          }
          res.redirect(`/student/dashboard/${student_id}`)
        } catch (e) {
          res.status(400).send(e)
        }
      } else if (user.roll === 'teacher') {
        try {
          const teacher = await Teacher.findByCredentials(req.body.email, req.body.password);
          const token = await teacher.generateAuToken();
          const student = await Student.find({});
          if (!teacher) {
            return res.status(404).send();
          }
          teacher_id = teacher._id
          res.redirect(`/teacher/dashboard/${teacher_id}`);
        } catch (e) {
          res.status(400).send(e)
        }
      }
    }
  } catch (e) {
    res.status(400).send(e);
  }
});

//************************signup****************** */

router.post('/signup', (req, res) => {
  const user = new User(req.body)
  user.save().then(() => {
    res.redirect('/');
  }).catch((e) => {
    res.status(400).send(e);
  });
})
//***********logout all**************** */

router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token
    })
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.get('/user/me', auth, async (req, res) => {
  console.log('inside /users')
  res.send(req.user);
});

//*************************Admin***************** */
router.get('/admin/dashboard', async (req, res) => {

  const student = await Student.find({});
  const teacher = await Teacher.find({});
  const user = await User.find({});
  res.render('adminDashboard', {
    admin: 'Admin',
    user,
    student,
    teacher
  })
});

router.post('/admin', (req, res) => {
  const admin = new Admin(req.body)
  admin.save().then(() => {
    res.status(201).send(admin)
  }).catch((e) => {
    res.status(400).send(e);
  })
});

router.get('/admin', (req, res) => {
  Admin.find({}).then((admin) => {
    res.send(admin);
  }).catch((e) => {
    res.status(500).send();
  })
});

//*************************STUDENT******************************** */
router.get('/newStudent', (req, res) => {
  res.render('newStudent')
})
router.post('/student', (req, res) => {
  // console.log(req.body)
  const student = new Student(req.body)
  student.save().then(() => {
    res.redirect('/admin/dashboard');
  }).catch((e) => {
    res.status(400).send(e);
  })
});

router.get('/students', (req, res) => {
  Student.find({}).then((student) => {
    res.send(student);
  }).catch((e) => {
    res.status(500).send();
  })
});

router.get('/student/exam/:id', async (req, res) => {

  const _id = req.params.id;
  Student.findById({ _id }).then(async (student) => {
    const testdata = await Test.findOne({ studentName: student.name, subject: student.subject });
    if (!testdata) {
      res.status(400).send()
    }
    const question = testdata.questions[0].mcq_question;
    const mcq = testdata.questions;
    res.render('Exam1', {
      student,
      testdata,
      //  ar
    })
  }).catch((e) => {
    res.status(500).send(e);
  })
});

router.get('/students/:id', (req, res) => {
  const _id = req.params.id;
  Student.findById(_id).then((student) => {
    if (!student) {
      return res.status(404).send();
    }
    res.send(student);
  }).catch((e) => {
    res.status(500).send();
  })
});

router.get('/student/edit/:id', async (req, res) => {
  const _id = req.params.id;
  const student = await Student.findById(_id);
  res.render('editStudent', {
    title: 'Student Page',
    student
  });
});

router.post('/student/edit/:id', async (req, res) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'roll', 'age', 'subject'];
  const isValidUpdate = updates.every((update) => allowedUpdates.includes(update));
  if (!isValidUpdate) {
    return res.status(404).send({ error: 'Invalid Update...!' })
  }
  try {
    const student = await Student.findOneAndUpdate({ _id }, req.body, { new: true })
    updates.forEach((update) => student[update] = req.body[update])
    if (!student) {
      return res.status(404).send();
    }
    res.redirect('/admin/dashboard');
  } catch (e) {
    res.status(400).send();
  }
})

router.get('/student/delete/:id', async (req, res) => {
  const _id = req.params.id;
  const student = await Student.findById(_id);
  const user = await User.findOne({ email: student.email });
  if (!student) {
    res.status(400).send();
  }
  try {
    await user.remove();
    await student.remove();
  } catch (e) {
    res.status(400).send();
  }
  res.redirect('/admin/dashboard');
})

// ***************TEACHER ************************/
router.get('/newTeacher', (req, res) => {
  res.render('newTeacher')
})

router.post('/teacher', (req, res) => {
  const teacher = new Teacher(req.body)
  teacher.save().then(() => {
    // res.status(201).send(teacher)
    res.redirect('/admin/dashboard');
  }).catch((e) => {
    res.status(400).send(e);
  })
});

router.get('/teachers', (req, res) => {
  Teacher.find({}).then((teacher) => {
    res.send(teacher);
  }).catch((e) => {
    res.status(500).send();
  })
});

router.get('/teacherUserList/:id', async (req, res) => 
  const teacher = await Teacher.findById(req.params.id)
  await User.find({ roll: 'not assigned' }).then((user) => {
    if (!user) {
      return res.student(400).send()
    } else if (user.length === 0) {

      return res.status(404).send({ error: 'no data found' })
    }
    else {

      res.render('teacherUserList', {
        user,
        teacher
        // name:'Sujith S'
      })
    }
  }).catch((e) => {
    res.status(400).send()
  })
})

router.get('/teacher/userEdit/:id', async (req, res) => {
  const _id = req.params.id;
  const user = await User.findById(_id);
  res.render('teacherEdit', {
    title: 'Teacher Page',
    user
  })
});

router.post('/teacher/userEdit/:id', async (req, res) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'roll', 'age'];
  const isValidUpdate = updates.every((update) => allowedUpdates.includes(update));
  if (!isValidUpdate) {
    return res.status(404).send({ error: 'Invalid Update...!' })
  }
  try {
    const user = await User.findOneAndUpdate({ _id }, req.body, { new: true })
    updates.forEach((update) => user[update] = req.body[update])
    //    await req.user.save();
    if (!user) {
      return res.status(404).send();
    }
    res.redirect(`/teacherUserList/${_id}`);
  } catch (e) {
    res.status(400).send();
  }
})

router.get('/teacher/edit/:id', async (req, res) => {
  const _id = req.params.id;
  const teacher = await Teacher.findById(_id);
  res.render('editTeacher', {
    title: 'Teacher Page',
    teacher
  })
})

router.post('/teacher/edit/:id', async (req, res) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'roll', 'age', 'subjects_taught'];
  const isValidUpdate = updates.every((update) => allowedUpdates.includes(update));
  if (!isValidUpdate) {
    return res.status(404).send({ error: 'Invalid Update...!' })
  }
  try {
    const teacher = await Teacher.findOneAndUpdate({ _id }, req.body, { new: true })
    updates.forEach((update) => teacher[update] = req.body[update])
    if (!teacher) {
      return res.status(404).send();
    }
    res.redirect('/admin/dashboard');
  } catch (e) {
    res.status(400).send();
  }
});

router.get('/teacher/delete/:id', async (req, res) => {
  const _id = req.params.id;
  const teacher = await Teacher.findById(_id);
  const user = await User.findOne({ email: teacher.email });

  if (!teacher) {
    res.status(400).send();
  }
  try {
    await user.remove();
    await teacher.remove();
  } catch (e) {
    res.status(400).send();
  }
  // res.status(200).send();
  res.redirect('/admin/dashboard');
})


/**************************8User**************8 */

router.get('/newUser', (req, res) => {
  res.render('newUser')
});


router.post('/users', (req, res) => {

  const user = new User(req.body)

  user.save().then(() => {
    // res.status(201).send(user)
    res.redirect('/admin/dashboard')
  }).catch((e) => {
    res.status(400).send(e);
  });
});


router.get('/user/delete/:id', async (req, res) => {

  const _id = req.params.id;
  // console.log(_id)

  try {
    const user = await User.findById(_id);
    const student = await Student.findOne({ email: user.email });
    const teacher = await Teacher.findOne({ email: user.email });
    const roll = user.roll;
    if (!user) {
      return res.status(404).send();
    }
    if (roll === 'student') {
      await user.remove();
      await student.remove();

    } else if (roll === 'teacher') {
      await user.remove();
      await teacher.remove();
    }
    res.redirect('/admin/dashboard');

  } catch (e) {
    res.status(500).send();
  }
});

router.get('/user/edit/:id', async (req, res) => {
  const _id = req.params.id;
  const user = await User.findById(_id);
  res.render('editUser', {
    user
  });
});

router.post('/user/edit/:id', async (req, res) => {

  const _id = req.params.id;
  const student = req.body;
  const teacher = req.body;
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'roll', 'age'];
  const isValidUpdate = updates.every((update) => allowedUpdates.includes(update));
  if (!isValidUpdate) {
    return res.status(404).send({ error: 'Invalid Update...!' })
  }
  try {
    const user = await User.findOneAndUpdate({ _id }, req.body, { new: true })
    updates.forEach((update) => user[update] = req.body[update])
    if (!user) {
      return res.status(404).send();
    }
    if (req.body.roll === 'student') {

      res.render('newStudentAdmin', {
        student
      })
    } else if (req.body.roll === 'teacher') {
      res.render('newTeacherAdmin', {
        teacher
      })
    }

  } catch (e) {
    res.status(400).send();
  }
})

//**************************Course****************** */
router.get('/course', async (req, res) => {
  const course = await Course.find({});
  res.render('course', {
    helptetx: 'Course Offered',
    title: 'Course',
    course,
    // name : 'Sujith S'
  });
});

router.get('/newCourse', (req, res) => {
  res.render('newCourseAdmin', {
    helptetx: 'Course Offered',
    title: 'Course',
  });
});
router.post('/course', (req, res) => {

  console.log(req.body);
  const course = new Course(req.body);
  course.save().then(() => {
    // res.status(201).send(user)
    res.redirect('/course');
  }).catch((e) => {
    res.status(400).send(e);
  });
});
/***************TEST******************** */
router.get('/teacherMcq/:id', async (req, res) => {

  try {
    const teacher_id = req.params.id;
    const teacher = await Teacher.findById(req.params.id);
    const course = await Course.findOne({ teacherName: teacher.name })
    res.render('tag', {
      course,
      teacher_id
    })
  }
  catch (e) {
    res.status(400).send(e)
  }
})

router.post('/mcq/:id', async (req, res) => {
  const teacher_id = req.params.id;
  const ar = req.body.mcq_question;
  const arr = req.body.options;
  var start = 0, end = 4;
  var arr_length = arr.length / 4
  var question = [];
  for (let i = 0; i < ar.length; i++) {
    if (end <= arr.length + 1) {
      question.push({ mcq_question: ar[i], options: arr.slice(start, end) })
    }
    start += 4;
    end += 4;  
  }
  await Test.mcqData(req.body, question);
  res.redirect(`/teacher/dashboard/${teacher_id}`);
})

router.post('/test/data/:id', async (req, res) => {
  _id = req.params.id;
  testAnswer = req.body;
  const student = await Student.findById(req.params.id)
  const course = await Course.findOne({ studentName: student.name, subject: student.subject });
  const test = await Test.findOne({ studentName: student.name, subject: student.subject });
  var score = 0;
  const ansValue = test.answer
  const ans = JSON.stringify(testAnswer);
  const objAns = JSON.parse(ans)
  console.log("*********************")
  var studentAnswer = []

  for (var i in objAns) {
    studentAnswer.push(objAns[i]);
    // console.log(objAns[i])
  }
  // console.log(studentAnswer)

  for (let i = 0; i < ansValue.length; i++) {
    if (ansValue[i] === studentAnswer[i]) {
      score += 10
    }
  }

  console.log(score)
  const updates = {
    score
  };
  try {
    const test = await Test.findOneAndUpdate({ studentName: student.name }, updates, { new: true })

    if (!test) {
      return res.status(404).send();
    }
    await test.save();
    //  res.status(200).send()
  }
  catch (e) {
    res.status(400).send()
  }
  res.render('scorecard', {
    score,
    course,
    _id
  })
})

//***********************HELP******************** */
router.get('/help', (req, res) => {
  res.render('help', {
    helptetx: 'Help Page',
    title: 'help',
    // name : 'Sujith S'
  });
});

//*************************error Page************** */

router.get('*', (req, res) => {
  res.render('404', {
    title: '404',
    errorMessage: 'Page Not Found'
  });
});

module.exports = router;

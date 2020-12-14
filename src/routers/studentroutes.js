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

// app.use(express.json());
router.use(bodyparser.urlencoded({
  extended: true
}));

// app.set('views', viewsPath);

router.get('/', async (req, res) => {
  res.render('index', {
    title: 'Login Page',
    // name : 'Sujith S'
  });

})

router.get('/test', async (req, res) => {

  res.render('test', {
    title: 'Login Page',
    // name : 'Sujith S'
  });

})

// app.get('/test2', async (req, res) => {
//     res.render('test2',{
//         title : 'Login Page',
//         body : 'Sujith S'
//     });
// })

router.get('/about', (req, res) => {
  res.render('about', {
    title: 'About Me',
    // name : 'Sujith S'
  });
});

// app.post('/test', async (req, res) => {
//     const email = await req.body;
//     console.log(email);
//   res.send('success')
// })
//************************Login*****************88*8 */
// router.get('/login', (req, res) => {
//     res.render('loginandregister');
// })

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

// router.post('/login/teacher', async (req, res) => {
// try {
//   // if (user.roll === 'teacher'){
//   // console.log(req.body)
//   const teacher = await Teacher.findByCredentials(req.body.email, req.body.password);
//   const token = await teacher.generateAuToken();
//   //  console.log('ready to render...');
//   //  console.log(teacher);
//   const student = await Student.find({});
//   if (!teacher) {
//     return res.status(404).send();
//   }
//   teacher_id = teacher._id
//   res.redirect(`/teacher/dashboard/${teacher_id}`)
//   // res.render('teacherDashboard',{
//   //     title : 'Teacher Page',
//   //      body : teacher.name,
//   //      teacher,
//   //     //  subject: teacher.subjects_taught,
//   //     student
//   //     // teacher    
//   // });
//   //  }
// } catch (e) {
//   res.status(400).send(e)
// }
// })

router.get('/teacher/dashboard/:id', async (req, res) => {

  // console.log(req.params.id)
  const student = await Student.find({});
  // const userTeacher = await User.find({roll: 'teacher'});
  const teacher = await Teacher.findById(req.params.id);
  // const user = await User.find({});
  // console.log( userTeacher.name,  userTeacher.email,  userTeacher.roll, userTeacher.age, userTeacher.password)
  //     const teacher = new Student(userTeacher)
  // console.log(userTeacher[0])

  res.render('teacherDashboard', {
    title: 'Teacher Page',
    body: teacher.name,
    teacher,
    //  subject: teacher.subjects_taught,
    student
    // teacher

  });
});

//****************Student login*************** */
// router.get('/login/student', async (req, res) => {
//   res.render('loginStudent');
// })

// router.post('/login/student', async (req, res) => {
// try {
//   console.log(req.body)
//   const student = await Student.findByCredentials(req.body.email, req.body.password);
//   const token = await student.generateAuToken();
//   const student_id = student._id;
//   // console.log(student)
//   if (!student) {
//     return res.status(404).send();
//   }
//   res.redirect(`/student/dashboard/${student_id}`)
//   // res.render('test2',{
//   //     title : 'student Page',
//   //     student  
//   // });
// } catch (e) {
//   res.status(400).send(e)
// }
// })

router.get('/student/dashboard/:id', async (req, res) => {

  // console.log(req.params.id)
  const student = await Student.findById(req.params.id);

  // const userTeacher = await User.find({roll: 'teacher'});
  // const teacher = await Teacher.findById(req.params.id);
  // const user = await User.find({});
  // console.log( userTeacher.name,  userTeacher.email,  userTeacher.roll, userTeacher.age, userTeacher.password)
  //     const teacher = new Student(userTeacher)
  // console.log(userTeacher[0])

  res.render('studentDashboard', {
    title: 'Student Page',
    //  body : teacher.name,
    //  teacher,
    //  subject: teacher.subjects_taught,
    student
    // teacher
  });
});

router.get('/student/score/:id', async (req, res) => {
  _id = req.params.id;
  // testAnswer = req.body;
  // console.log(testAnswer)
  const student = await Student.findById(req.params.id)
  // console.log(student.name)
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

  //     console.log('inside router', req);
  //     res.send(req.body);
  //     // try {
  //     // const email = req.body.email;
  //     // console.log(email)
  //     const admin = await Admin.findOne({email: req.body.email, password: req.body.password});
  //     if (admin) { 
  //         return res.send('welcome admin');
  //     }
  //     const user = await User.findOne({email: req.body.email, password: req.body.password});
  //     // const token = await user.generateAuToken();
  //     if (!user) {
  //         return  res.send({
  //             error : 'worng credentials'
  //         })
  //     } else {
  //         // res.send(user);
  //         res.redirect('/users');
  //     }
  // } catch (e) {
  //     res.status(400).send();
  // }

  try {
    // console.log(req.body)
    const admin = await Admin.findOne({ email: req.body.email, password: req.body.password });
    if (admin) {

      return res.redirect('/admin/dashboard');
    } else {
      // console.log('inside else')
      // console.log(req.body)
      const user = await User.findByCredentials(req.body.email, req.body.password);;
      const token = await user.generateAuToken();
      // const student = await Student.findByCredentials(req.body.email, req.body.password);
      // console.log(student)
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
        // // console.log('in side student login logic')
        // // console.log(req.body)
        // const student = await Student.findByCredentials(req.body.email, req.body.password);
        // const token = await student.generateAuToken();
        // // console.log(student)
        // if (!student) {
        //   return res.status(404).send();
        // }
        // res.render('test2', {
        //   title: 'student Page',
        //   student
        // });

        try {
          // console.log(req.body)
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
        // // console.log(req.body)
        // const teacher = await Teacher.findByCredentials(req.body.email, req.body.password);
        // const token = await teacher.generateAuToken();
        // //  console.log('ready to render...');
        // //  console.log(teacher);
        // const student = await Student.find({});
        // if (!teacher) {
        //   return res.status(404).send();
        // }
        // res.render('teacherDashboard', {
        //   title: 'Teacher Page',
        //   body: teacher.name,
        //   teacher,
        //   //  subject: teacher.subjects_taught,
        //   student
        //   // teacher
        // });

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
      //  console.log(user)
      //  res.send({ user, token });
      //     Us.find({}, {}, function(e, docs) {
      //         res.render('user-list', {'userlist' : docs});
      //   });
      //res.send(user.roll);
      // res.redirect('/user')
    }
  } catch (e) {
    res.status(400).send(e);
  }
});

// router.get('/teacher/dashboard', async (req, res) => {
//     console.log('hello')
//     res.send('hello')
// })

//************************signup****************** */

router.post('/signup', (req, res) => {
  const user = new User(req.body)
  user.save().then(() => {
    // res.status(201).send(user);
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

//************************user not assigned Page********* */

// app.get('/user', (req, res) => {
//     // const name = new User.findOne({email: req.body.email})
//     // console.log(res.send(req.user));
//     res.render('/notAssigned',{
//         title : 'Home Page',
//         user: 'user',
//         message : 'Pls wait for Admin to assigned'
//      });
// })

router.get('/user/me', auth, async (req, res) => {
  console.log('inside /users')
  res.send(req.user);
});

//*************************Admin***************** */
router.get('/admin/dashboard', async (req, res) => {

  const student = await Student.find({});
  // const userTeacher = await User.find({roll: 'teacher'});
  const teacher = await Teacher.find({});
  const user = await User.find({});
  // console.log( userTeacher.name,  userTeacher.email,  userTeacher.roll, userTeacher.age, userTeacher.password)

  //     const teacher = new Student(userTeacher)
  // console.log(userTeacher[0])

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

  // console.log(req.params.id)
  const _id = req.params.id;
  Student.findById({ _id }).then(async (student) => {
    // res.send(student);
    const testdata = await Test.findOne({ studentName: student.name, subject: student.subject });
    if (!testdata) {
      res.status(400).send()
    }
    // console.log(testdata[0].questions)
    // let question = []
    const question = testdata.questions[0].mcq_question;
    const mcq = testdata.questions;
    // var obj = mcq.toObject();
    // var obj = mcq.toObject();
    // var onj1 = mcq.lean();
    // var obj = mongooseArray.toObject();
    // const ar = mcq.options;
    // console.log(ar)
    //  console.log(mcq[0].options.length)
    // mcq.forEach(element => {
    //     // console.log(element.options)
    //     element.options.forEach(ele => {
    //         console.log(ele)
    //     });
    //     console.log('***************')
    // });
    //  console.log(mcq)

    //  console.log('.lean method: ', onj1)
    res.render('Exam1', {
      student,
      // question,
      // mcq,
      testdata,
      //  ar
    })
    // const data = {
    //     code: 42,
    //     items: [{
    //         id: 1,
    //         name: 'foo'
    //     }, {
    //         id: 2,
    //         name: 'bar'
    //     }]
    // };
    // console.log(data)
    // console.log(testdata)
    //  res.status(200).send();
  }).catch((e) => {
    res.status(500).send(e);
  })
  // res.render('Exam')
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
  // console.log(req.body);
  const _id = req.params.id;
  // console.log(req.params.id)
  const updates = Object.keys(req.body);
  // console.log(updates)
  const allowedUpdates = ['name', 'email', 'roll', 'age', 'subject'];
  const isValidUpdate = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidUpdate) {
    return res.status(404).send({ error: 'Invalid Update...!' })
  }
  // console.log('validation oki')
  try {
    //    const user = await User.findOneAndUpdate(email, req.body, { new : true, runValidators: true});
    const student = await Student.findOneAndUpdate({ _id }, req.body, { new: true })
    //    const user = await User.findById(_id);
    // console.log(user)

    updates.forEach((update) => student[update] = req.body[update])
    //    await req.user.save();
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
  // console.log(_id)
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
  // res.status(200).send(student);
  res.redirect('/admin/dashboard');
})

// ***************TEACHER ************************/
router.get('/newTeacher', (req, res) => {
  res.render('newTeacher')
})

router.post('/teacher', (req, res) => {
  const teacher = new Teacher(req.body)
  // console.log(req.body);
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

router.get('/teacherUserList/:id', async (req, res) => {
  // const user = await User.find({roll:'not assigned'});
  // if (!user) {
  //     return res.student(400).send() 
  // } else if (user.length === 0) {
  //     return alert("no data found");
  // }
  //  else {
  // res.render('teacherUserList', {
  //     user,
  //     name:'Sujith S'
  // })}
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
  // console.log(req.body);
  const _id = req.params.id;
  // console.log(req.params.id)
  const updates = Object.keys(req.body);
  // console.log(updates)
  const allowedUpdates = ['name', 'email', 'roll', 'age'];
  const isValidUpdate = updates.every((update) => allowedUpdates.includes(update));
  if (!isValidUpdate) {
    return res.status(404).send({ error: 'Invalid Update...!' })
  }
  // console.log('validation oki')
  try {
    //    const user = await User.findOneAndUpdate(email, req.body, { new : true, runValidators: true});
    const user = await User.findOneAndUpdate({ _id }, req.body, { new: true })
    //    const user = await User.findById(_id);
    // console.log(user);
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
  // console.log(req.body);
  const _id = req.params.id;
  // console.log(req.params.id)
  const updates = Object.keys(req.body);
  // console.log(updates)
  const allowedUpdates = ['name', 'email', 'roll', 'age', 'subjects_taught'];
  const isValidUpdate = updates.every((update) => allowedUpdates.includes(update));
  if (!isValidUpdate) {
    return res.status(404).send({ error: 'Invalid Update...!' })
  }
  // console.log('validation oki')
  try {
    //    const user = await User.findOneAndUpdate(email, req.body, { new : true, runValidators: true});
    const teacher = await Teacher.findOneAndUpdate({ _id }, req.body, { new: true })
    //    const user = await User.findById(_id);
    // console.log(user)
    updates.forEach((update) => teacher[update] = req.body[update])
    //    await req.user.save();
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
  // console.log(_id)
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
    // const user = await User.findByIdAndDelete(req.user._id);
    const user = await User.findById(_id);
    const student = await Student.findOne({ email: user.email });
    const teacher = await Teacher.findOne({ email: user.email });
    //  console.log(user)
    //  console.log(student);
    //  console.log(teacher);
    const roll = user.roll;
    // console.log(roll);
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

    // await user.remove();
    // res.status(200).send(user);
    res.redirect('/admin/dashboard');

  } catch (e) {
    res.status(500).send();
  }
});

router.get('/user/edit/:id', async (req, res) => {
  // console.log(req.params.id)
  const _id = req.params.id;
  const user = await User.findById(_id);

  res.render('editUser', {
    user
  });
});


// router.patch('/users/:id', async (req, res) => {

// router.patch('/users/me', auth, async (req, res) => {

router.post('/user/edit/:id', async (req, res) => {
  // console.log(req.body);
  const _id = req.params.id;
  // console.log(req.body.roll);
  // if (req.body.roll === 'student') {
  //     const student = req.body;

  //     const _id = req.params.id;
  //     console.log(_id)
  //     try {
  //         const user = await User.findById(_id);
  //         console.log(user)
  //         if (!user) {
  //             return res.status(404).send();
  //         }
  //         await user.remove();
  //     } catch (e) {
  //         res.status(500).send();
  //     }
  //     res.render('newStudentAdmin',{
  //         student
  //     })
  // } else if (req.body.roll === 'teacher') {
  //     const teacher = req.body;
  //     const _id = req.params.id;
  //     console.log(_id)
  //     try {
  //         const user = await User.findById(_id);
  //         console.log(user)
  //         if (!user) {
  //             return res.status(404).send();
  //         }
  //         await user.remove();
  //     } catch (e) {
  //         res.status(500).send();
  //     }
  // res.render('newTeacherAdmin',{
  //     teacher
  //     })
  // }
  // else {

  const student = req.body;
  const teacher = req.body;
  const updates = Object.keys(req.body);
  // console.log(updates)
  const allowedUpdates = ['name', 'email', 'roll', 'age'];
  const isValidUpdate = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidUpdate) {
    return res.status(404).send({ error: 'Invalid Update...!' })
  }
  // console.log('validation oki')
  try {
    //    const user = await User.findOneAndUpdate(email, req.body, { new : true, runValidators: true});
    const user = await User.findOneAndUpdate({ _id }, req.body, { new: true })
    //    const user = await User.findById(_id);
    // console.log(user)

    updates.forEach((update) => user[update] = req.body[update])

    //    await req.user.save();

    if (!user) {
      return res.status(404).send();
    }

    // res.redirect('/admin/dashboard');

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
  // }

})

// app.get('/users', (req, res) => {   
//     User.find({}).then((user) => {
//         res.send(user);
//     }).catch((e) => {
//         res.status(500).send(e);
//     })
// });

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
    // name : 'Sujith S'
  });
  // progressBar(10,100)
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
    // console.log(teacher)
    // console.log(course)
    res.render('tag', {
      course,
      teacher_id
    })
    // res.status(200).send();
  }
  catch (e) {
    res.status(400).send(e)
  }
})

// router.get('/mcq', async(req, res) => {
//     res.render('teacherDashboard');
// })
router.post('/mcq/:id', async (req, res) => {
  // const mcq = new Test();
  // var question= {
  //     mcq_question: req.body.mcq_question,
  //     options: req.body.options
  // };
  const teacher_id = req.params.id;
  const ar = req.body.mcq_question;
  const arr = req.body.options;
  // console.log(req.body);
  // console.log(ar)
  // var opt = [];
  var start = 0, end = 4;
  var arr_length = arr.length / 4
  // console.log(arr_length)

  // for (let i = 0; i < arr_length; i++) {
  //     if (end<=arr.length+1) {
  //         opt.push([arr.slice(start,end)])
  //     }
  //     start+=4;
  //     end+=start;
  // }
  //    opt.push(arr.slice(0,4)
  //    var i,j,temparray,chunk = 10;
  // for (i=0,j=arr.length; i<j; i+=chunk) {
  //     temparray = arr.slice(i,i+chunk);
  //     // do whatever
  // }

  // console.log(temparray)

  // console.log(question[0].mcq_question)

  // var question = [{
  //     mcq_question: null,
  // }]

  // for (let i = 0; i < ar.length; i++) {
  //     //   question.mcq_question = ar[i];
  //        question.mcq_question=[ar[i]]
  //     // console.log(ar[i])

  // }
  // console.log(question)


  //*************************correct one **************** */
  // console.log(arr.length,"and",ar.length)
  var question = [];
  for (let i = 0; i < ar.length; i++) {
    // console.log(i)
    // console.log(ar[i])
    if (end <= arr.length + 1) {
      // console.log("inside if before push , start:" + start + " end:" + end)
      // opt.push([arr.slice(start,end)])
      question.push({ mcq_question: ar[i], options: arr.slice(start, end) })

    }
    start += 4;
    end += 4;
    // console.log("outside if, start:" + start + " end:" + end)
    // question.push({options: opt[i]})
    // question.push({mcq_question: ar[i] });   
  }
  // results.push( { mcq_question:ar[0] });
  // results.push( { mcq_question:ar[1] });
  // results.push( { id:2, title:4, content:6, source:"unsplash" });
  // And then with JSON.stringify(results) will code your results into JSON.

  //  console.log(question);
  // console.log(question.options)
  // console.log(opt);

  //************************************************************ */

  // var arra = []
  // var i, j, chunk = 4; 
  // var array = [1, 2, 3, 4, 5, 6, 7, 8]; 
  //     var array1 =  
  //         array.slice(0, chunk); 
  //     var array2 = 
  //         array.slice(chunk, chunk + array.length);     
  //     arra.push(array1,array2)
  //     console.log(arra)
  //***************************************************** */
  // for (i in question) {
  //     // console.log(question[i])
  //     for (j in question[i].mcq_question) {
  //         console.log(question[i].mcq_question[j])
  //     }
  //     for (j in question[i].options) {
  //         // if (j<4) {
  //         //     console.log(question[i].options[j])
  //         // }
  //         console.log(question[i].options[j])
  //     }
  //   }
  //   for (i in myObj.cars) {
  //     x += "<h1>" + myObj.cars[i].name + "</h1>";
  //     for (j in myObj.cars[i].models) {
  //       x += myObj.cars[i].models[j];
  //     }
  //   }
  //   const ar = mcq[0].options;
  //   console.log(ar)
  //   ar.forEach(element => {
  //       console.log(element)
  //   });
  //   question.mcq_question.forEach(element => {
  //       console.log(element.mcq_question)
  //   });
  // console.log(req.body.studentName +'\n' +req.body.subject + '\n' +req.body.teacherName + '\n'
  //       + req.body.score  + '\n' + req.body.answer);
  // console.log(req.body);       , options: req.body.options
  //  console.log(question[0].mcq_question[1])
  // const mcq_q = question[0].mcq_question;
  // console.log(mcq_q)
  // question[0].mcq_question.forEach(element => {
  //           console.log(element)
  // });
  // mcq_q.forEach(element => {
  //     console.log(element)
  // });
  //   console.log(mcq_q)
  // const opt = question[1].options;

  // question[1].options.forEach(element => {
  //         console.log(element)
  // });
  // console.log(question[0].options)
  // console.log(question[1])
  // const mcq = new Test({
  //     studentName: req.body.studentName,
  //     subject: req.body.subject,
  //     teacherName: req.body.teacherName,
  //      questions:question,
  //     // answer: req.body.answer
  // });  
  await Test.mcqData(req.body, question);
  // await mcq.save();
  // res.status(200).send();
  // const mcq = new Test();
  // mcq_q.forEach( element => {
  //     // mcq.questions = mcq.questions.concat({ element });
  //     // await mcq.save().then(() =>{
  //     //     res.status(200).send();
  //     // }).catch((e) => {
  //     //     res.status(400).send(e)
  //     // })
  //      console.log(element);
  //      res.status(200).send();
  // });
  // mcq.questions = mcq.questions.concat({ mcq_q });
  // await user.save();
  // res.status(200).send();
  // await mcq.save();
  // res.render('teacherDashboard',{
  //     teacher_id
  // });
  res.redirect(`/teacher/dashboard/${teacher_id}`);
  // await mcq.save().then(() => {
  //     res.render('teacherDashboard');
  // }).catch((e) => {
  //     res.status(400).send(e);
  // })
})

// var personSchema = Schema({
//     name    : String,
//     surname : String,
//     addresses : [{
//       street: String,
//       city: String
//     }]
//   var addresses= [
//       {street: 'W Division', city: 'Chicago'},
//       {street: 'Beekman', city: 'New York'},
//       {street: 'Florence', city: 'Los Angeles'}
//   ];
//   //Saving in Schema
//   var personData = new personSchema ({
//     name:'peter',
//     surname:'bloom',
//     addresses:addresses  
//   })
//   personData.save();

router.post('/test/data/:id', async (req, res) => {
  // console.log(req.params.id)
  _id = req.params.id;
  testAnswer = req.body;
  // console.log(testAnswer)
  const student = await Student.findById(req.params.id)
  // console.log(student.name)
  const course = await Course.findOne({ studentName: student.name, subject: student.subject });
  const test = await Test.findOne({ studentName: student.name, subject: student.subject });
  // console.log(course)
  //  console.log(test.answer)
  //  test.answer.forEach(element => {
  //      console.log(element)
  //  });
  var score = 0;
  const ansValue = test.answer
  //  console.log(ansValue)

  //  console.log('*****************************')

  const ans = JSON.stringify(testAnswer);
  // console.log(ans)

  const objAns = JSON.parse(ans)
  // console.log(objAns)
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

  // var JS_Obj = '{"prop_1":"val_1", "prop_2":"val_2", "prop_3" : "val_3"}'; 
  // console.log(JS_Obj)     
  // up.innerHTML = "JSON string - '" + JS_Obj + "'";      
  // var down = document.getElementById("GFG_DOWN");     
  // function myGFG() { 
  // var obj = JSON.parse(JS_Obj); 
  // console.log(obj)
  // var res = [];  
  // for(var i in obj){ 
  //     // res.push(obj[i]); 
  //     console.log(obj[i])
  // }
  // down.innerHTML = "Array of values - [" 
  //                 + res + "]"; 
  // console.log(req.body)
  // res.render('testing', {
  //     score,
  //     course,
  //     _id
  // })
  res.render('scorecard', {
    score,
    course,
    _id
  })
  // res.status(200).send('thank you , Your Score is: '+ score);
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
  // res.send('My 404 ERROR PAGE');
  res.render('404', {
    title: '404',
    //  name : 'Sujith S',
    errorMessage: 'Page Not Found'
  });
});

module.exports = router;
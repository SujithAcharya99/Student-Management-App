const express = require('express');
const Admin = require('../models/admin');
const Student = require('../models/student');
const Teacher = require('../models/teacher');
const Course = require('../models/course');
const User = require('../models/users');
const Test = require('../models/test');
const auth = require('../middleware/auth');
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
    res.render('index',{
        title : 'Login Page',
        name : 'Sujith S'
    });
 
})

router.get('/test', async (req, res) => {

    res.render('test',{
        title : 'Login Page',
        name : 'Sujith S'
    });
 
})

router.get('/about', (req, res) => {
    res.render('about',{
        title : 'About Me',
        name : 'Sujith S'
    });
})

//***********************Admin Login********* */
router.get('/login/admin', async (req, res) => {
    res.render('loginAdmin');
})

router.post('/login/admin', async (req, res) => {
    try {
        console.log(req.body)
        const admin = await Admin.findOne({email: req.body.email, password: req.body.password});
        if (admin) {
           
            return res.redirect('/admin/dashboard');
        }
    } catch (e) {
        res.status(400).send(e)
    }
})
//***************Teacher Login*************** */
router.get('/login/teacher', async (req, res) => {
    res.render('loginTeacher');
})

router.post('/login/teacher', async (req, res) => {
    try {
        // if (user.roll === 'teacher'){
            // console.log(req.body)
            const teacher = await Teacher.findByCredentials(req.body.email, req.body.password);
            const token = await teacher.generateAuToken();
            //  console.log('ready to render...');
            //  console.log(teacher);
             const student = await Student.find({});
             if (!teacher) {
                return res.status(404).send();
            }
                teacher_id = teacher._id
          res.redirect(`/teacher/dashboard/${teacher_id}`)
        //  }
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/teacher/dashboard/:id', async (req, res) => {

    console.log(req.params.id)
    const student = await Student.find({});
    const teacher = await Teacher.findById(req.params.id);
 
res.render('teacherDashboard',{
    title : 'Teacher Page',
     body : teacher.name,
     teacher,
    //  subject: teacher.subjects_taught,
    student
    // teacher
    
});
});

//****************Student login*************** */
router.get('/login/student', async (req, res) => {
    res.render('loginStudent');
})

router.post('/login/student', async (req, res) => {
    try {
        console.log(req.body)
        const student = await Student.findByCredentials(req.body.email, req.body.password);
        const token = await student.generateAuToken();
        const student_id = student._id;
        // console.log(student)
        if (!student) {
            return res.status(404).send();
        }
        res.redirect(`/student/dashboard/${student_id}`)
     
    } catch (e) {
        res.status(400).send(e)
    }
})


router.get('/student/dashboard/:id', async (req, res) => {

    console.log(req.params.id)
    const student = await Student.findById(req.params.id);
  
res.render('studentDashboard',{
    title : 'Student Page',
    student
    // teacher
});
});

//*************************login*********************** */
 router.post('/login', async (req, res) => {

    try {
         console.log(req.body)
        const admin = await Admin.findOne({email: req.body.email, password: req.body.password});
        if (admin) {
           
            return res.redirect('/admin/dashboard');
        } else {
            console.log('inside else')
            console.log(req.body)
        const user = await User.findByCredentials(req.body.email, req.body.password);;
        const token = await user.generateAuToken();
      
        if (!user) {
            return res.status(404).send();
        }
        console.log(user.roll)
         if (user.roll === 'not assigned') {
            res.render('notAssigned',{
                title : 'Home Page',
                user,
                message : ' Pls wait for Admin to assigned',
                name: 'Sujith S'
             });
         } else if(user.roll === 'student'){
          
            const student = await Student.findByCredentials(req.body.email, req.body.password);
            const token = await student.generateAuToken();
            // console.log(student)
            if (!student) {
                return res.status(404).send();
            }
            res.render('test2',{
                title : 'student Page',
                student   
            });
         } else if (user.roll === 'teacher'){
            // console.log(req.body)
            const teacher = await Teacher.findByCredentials(req.body.email, req.body.password);
            const token = await teacher.generateAuToken();
             const student = await Student.find({});
             if (!teacher) {
                return res.status(404).send();
            }
            res.render('teacherDashboard',{
                title : 'Teacher Page',
                 body : teacher.name,
                 teacher,
                //  subject: teacher.subjects_taught,
                student
                // teacher
                
            });
         }
        }
    } catch (e) {
        res.status(400).send(e);
    }
    
});

//************************signup****************** */

router.post('/signup', (req,res) => {

    const user = new User(req.body)

    user.save().then(() =>{
        // res.status(201).send(user);
        res.redirect('/');
    }).catch((e) =>{
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
    // const userTeacher = await User.find({roll: 'teacher'});
    const teacher = await Teacher.find({});
    const user = await User.find({});
  
    res.render('adminDashboard',{
        admin: 'Admin',
        user,
        student,
        teacher
})
});


router.post('/admin', (req, res) => {
    
  const admin = new Admin(req.body)

    admin.save().then(() =>{
        res.status(201).send(admin)
    }).catch((e) =>{
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
    console.log(req.body)
    const student = new Student(req.body)

    student.save().then(() =>{
        res.redirect('/admin/dashboard');
    }).catch((e) =>{
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
  
    Student.findById({_id}).then(async (student) => {
        // res.send(student);
        const testdata = await Test.findOne({studentName: student.name , subject: student.subject});
        if (!testdata) {
            res.status(400).send()
        }
        // console.log(testdata[0].questions)
        // let question = []
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
    // res.render('Exam')
});

router.get('/students/:id', (req, res) => {
    const _id= req.params.id;
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
    res.render('editStudent',{
    title : 'Student Page',
    student
})
})

router.post('/student/edit/:id', async (req, res) => {
    console.log(req.body);
    const _id = req.params.id;
    console.log(req.params.id)
    const updates = Object.keys(req.body);
    console.log(updates)
    const allowedUpdates = ['name', 'email', 'roll', 'age', 'subject'];
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
        return res.status(404).send({ error : 'Invalid Update...!'})
    }
console.log('validation oki')
    try {
    //    const user = await User.findOneAndUpdate(email, req.body, { new : true, runValidators: true});
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

 // ***************TEACHER ************************/
 router.get('/newTeacher', (req, res) => {
    res.render('newTeacher')
})

 router.post('/teacher', (req, res) => {
    
    const teacher = new Teacher(req.body)
    console.log(req.body)

    teacher.save().then(() =>{
        // res.status(201).send(teacher)
        res.redirect('/admin/dashboard');
    }).catch((e) =>{
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
router.get('/teacher/userEdit/:id', async (req, res) => {
    const _id = req.params.id;
    const user = await User.findById(_id);
    res.render('teacherEdit',{
    title : 'Teacher Page',
    user
})
    
});

router.get('/teacherUserList', async (req, res) => {

    await User.find({roll:'not assigned'}).then((user) => {
        if (!user) {
            return res.student(400).send() 
        } else if (user.length === 0) {
            
            return res.status(404).send({ error : 'no data found'}) 
        }
         else {
        res.render('teacherUserList', {
            user,
            name:'Sujith S'
        })}
    }).catch((e) => {
        res.status(400).send()
    })
})
router.post('/teacher/userEdit/:id', async (req, res) => {
    // console.log(req.body);
    const _id = req.params.id;
    // console.log(req.params.id)
    const updates = Object.keys(req.body);
    // console.log(updates)
    const allowedUpdates = ['name', 'email', 'roll', 'age'];
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update));
    if (!isValidUpdate) {
        return res.status(404).send({ error : 'Invalid Update...!'})
    }
    try {
     const user = await User.findOneAndUpdate({ _id }, req.body, { new: true })
    updates.forEach((update) => user[update] = req.body[update])
        if (!user) {
            return res.status(404).send();
        }
        res.redirect('/teacherUserList');
    } catch (e) {
        res.status(400).send();
    }
})

router.get('/teacher/edit/:id', async (req, res) => {
    const _id = req.params.id;
    const teacher = await Teacher.findById(_id);
    res.render('editTeacher',{
    title : 'Teacher Page',
    teacher
})
})

router.post('/teacher/edit/:id', async (req, res) => {
    console.log(req.body);
    const _id = req.params.id;
    console.log(req.params.id)
    const updates = Object.keys(req.body);
    console.log(updates)
    const allowedUpdates = ['name', 'email', 'roll', 'age', 'subjects_taught'];
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update));
    if (!isValidUpdate) {
        return res.status(404).send({ error : 'Invalid Update...!'})
    }
console.log('validation oki')
    try {
    //    const user = await User.findOneAndUpdate(email, req.body, { new : true, runValidators: true});
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

/**************************8User**************8 */

router.get('/newUser', (req, res) => {
    res.render('newUser')
});

router.post('/users', (req, res) => {
    
    const user = new User(req.body)

    user.save().then(() =>{
        // res.status(201).send(user)
        res.redirect('/admin/dashboard')
    }).catch((e) =>{
        res.status(400).send(e);
    });
});

router.get('/user/delete/:id', async (req, res) => {

    const _id = req.params.id;
    console.log(_id)

    try {
        // const user = await User.findByIdAndDelete(req.user._id);
        const user = await User.findById(_id);
        console.log(user)
        if (!user) {
            return res.status(404).send();
        }

        await user.remove();
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

    res.render('editUser',{
        user
    });
});

router.post('/user/edit/:id', async (req, res) => {
        console.log(req.body);
        const _id = req.params.id;
        console.log(req.body.roll);
            const student = req.body;
            const teacher = req.body;
            const updates = Object.keys(req.body);
        // console.log(updates)
        const allowedUpdates = ['name', 'email', 'roll', 'age'];
        const isValidUpdate = updates.every((update) => allowedUpdates.includes(update));
        if (!isValidUpdate) {
            return res.status(404).send({ error : 'Invalid Update...!'})
        }
    // console.log('validation oki')
        try {
         const user = await User.findOneAndUpdate({ _id }, req.body, { new: true })
           updates.forEach((update) => user[update] = req.body[update]);
            if (!user) {
                return res.status(404).send();
            }
    
            // res.redirect('/admin/dashboard');

            if (req.body.roll === 'student') {
                
                res.render('newStudentAdmin',{
                    student
                })
            } else if (req.body.roll === 'teacher') {
                res.render('newTeacherAdmin',{
                    teacher
                })
            }
    
        } catch (e) {
            res.status(400).send();
        }
        // }
        
    })

//**************************Course****************** */
router.get('/course', async(req, res) =>{
    const course = await Course.find({}); 
    res.render('course',{
        helptetx : 'Course Offered',
        title : 'Course',
        course,
        name : 'Sujith S'
    });
});

router.get('/newCourse', (req, res) =>{
    res.render('newCourseAdmin',{
        helptetx : 'Course Offered',
        title : 'Course',
        name : 'Sujith S'
    });
});
router.post('/course', (req, res) => {

    console.log(req.body);
    
    const course = new Course(req.body);

    course.save().then(() =>{
        // res.status(201).send(user)
        res.redirect('/course');
    }).catch((e) =>{
        res.status(400).send(e);
    });
});
/***************TEST******************** */
router.get('/teacherMcq/:id', async (req,res) => {

    try{
        const teacher_id = req.params.id;
    const teacher = await Teacher.findById(req.params.id);
    const course = await Course.findOne({teacherName: teacher.name});
    res.render('mcq',{
        course,
        teacher_id
    })
    // res.status(200).send();
    }
    catch(e){
        res.status(400).send(e)
    }
})

// router.get('/mcq', async(req, res) => {
//     res.render('teacherDashboard');
// })
router.post('/mcq/:id', async (req,res) => {
    const teacher_id = req.params.id;
    const ar = req.body.mcq_question;
    const arr = req.body.options;
    var start = 0, end = 4;
    var arr_length = arr.length/4
//     console.log(arr_length)
    let question = [];
    for (let i = 0; i < ar.length; i++) {
        if (end<=arr.length+1) {
            // opt.push([arr.slice(start,end)])
            question.push({mcq_question: ar[i] , options: arr.slice(start,end)})
        }
        start+=4;
        end+=start;   
    }
     await Test.mcqData(req.body, question);
     res.redirect(`/teacher/dashboard/${teacher_id}`)
})

router.post('/test/data/:id', async (req, res) => {
    // console.log(req.params.id)
    _id = req.params.id;
    testAnswer = req.body;
    // console.log(testAnswer)
    const student = await Student.findById(req.params.id)
    // console.log(student.name)
    const course = await Course.findOne({studentName: student.name, subject: student.subject});
     const test = await Test.findOne({studentName: student.name, subject: student.subject});
    console.log(course)
    var score = 0;
     const ansValue = test.answer
   
     
     console.log('*****************************')

        const ans = JSON.stringify(testAnswer);
        // console.log(ans)

        const objAns = JSON.parse(ans)
        // console.log(objAns)

        var studentAnswer = []

        for(var i in objAns){ 
             studentAnswer.push(objAns[i]); 
        }
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
          const test = await Test.findOneAndUpdate( _id, updates, { new: true })
    
             if (!test) {
                 return res.status(404).send();
             }
             await test.save();
            //  res.status(200).send()
            }
            catch(e){
                res.status(400).send()
            }
    res.render('scorecard', {
        score,
        course,
        _id
    })
})

//***********************HELP******************** */
router.get('/help', (req, res) =>{
    res.render('help',{
        helptetx : 'Help Page',
        title : 'help',
        name : 'Sujith S'
    });
});

//*************************error Page************** */

router.get('*', (req, res) =>{
    // res.send('My 404 ERROR PAGE');
    res.render('404',{
     title : '404',
     name : 'Sujith S',
     errorMessage : 'Page Not Found'
 });
});

module.exports = router;

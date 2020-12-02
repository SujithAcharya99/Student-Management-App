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
// const title } = require('process');
const router = new express.Router();

// app.use(express.json());
router.use(bodyparser.urlencoded({
    extended: true
}));

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
        // const student = await Student.findByCredentials(req.body.email, req.body.password);
        // console.log(student)
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
                student
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
    const question = testdata.questions[0].mcq_question;
        const mcq = testdata.questions;
     console.log(mcq)
        res.render('Exam1', {
            student,
            question,
            mcq,
            testdata
        })      
    }).catch((e) => {
        res.status(500).send(e);
    })
    
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
    
    const _id = req.params.id;
    const updates = Object.keys(req.body);
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
    const teacher = await Teacher.findById(req.params.id);



    const course = await Course.findOne({teacherName: teacher.name});

    // console.log(teacher)
    // console.log(course)
    res.render('mcq',{
        course
    })
    // res.status(200).send();
    }
    catch(e){
        res.status(400).send(e)
    }
})

router.post('/mcq', async (req,res) => {
   
    var question= [
              {mcq_question: req.body.mcq_question, options: req.body.options},
          ];
    // console.log(req.body.studentName +'\n' +req.body.subject + '\n' +req.body.teacherName + '\n'
    //       + req.body.score  + '\n' + req.body.answer);
    //  console.log(question);
    
    res.status(200).send();
    const mcq = new Test({
        studentName: req.body.studentName,
        subject: req.body.subject,
        teacherName: req.body.teacherName,
        score: req.body.score,
        questions: question,
        answer: req.body.answer
    });
    await mcq.save().then(() => {
        res.render('teacherDashboard');
    }).catch((e) => {
        res.status(400).send(e);
    })
})

router.post('/test/data', async (req, res) => {
    console.log(req.body)
    res.status(200).send('thank you ')
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

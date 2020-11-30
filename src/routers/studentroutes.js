const express = require('express');
const Admin = require('../models/admin');
const Student = require('../models/student');
const Teacher = require('../models/teacher');
const Course = require('../models/course');
const User = require('../models/users');
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

// app.get('/test2', async (req, res) => {
//     res.render('test2',{
//         title : 'Login Page',
//         body : 'Sujith S'
//     });
 
// })



router.get('/about', (req, res) => {
    res.render('about',{
        title : 'About Me',
        name : 'Sujith S'
    });
})

// app.post('/test', async (req, res) => {

//     const email = await req.body;

//     console.log(email);
//   res.send('success')
// })

//************************Login*****************88*8 */
// router.get('/login', (req, res) => {

//     res.render('loginandregister');
// })



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
         console.log(req.body)
        const admin = await Admin.findOne({email: req.body.email, password: req.body.password});
        if (admin) {
           
            return res.redirect('/admin/dashboard');
        } else {
            console.log('inside else')
            console.log(req.body)
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuToken();
        // const student = await Student.findByCredentials(req.body.email, req.body.password);
        // console.log(student)
        console.log(user.roll)
         if (user.roll === 'not assigned') {
           
            res.render('notAssigned',{
                title : 'Home Page',
                user,
                message : ' Pls wait for Admin to assigned',
                name: 'Sujith S'
             });
         } else if(user.roll === 'student'){
            console.log('in side student login logic')
            console.log(req.body)
            const student = await Student.findByCredentials(req.body.email, req.body.password);
            const token = await student.generateAuToken();
            console.log(student)

            res.render('test2',{
                title : 'student Page',
                student
                
            });
         } else if (user.roll === 'teacher'){
            console.log(req.body)
            const teacher = await Teacher.findByCredentials(req.body.email, req.body.password);
            const token = await teacher.generateAuToken();
             console.log('ready to render...');
            //  console.log(teacher);
             const student = await Student.find({});
            res.render('teacherDashboard',{
                title : 'Teacher Page',
                 body : teacher.name,
                student
                // teacher
                
            });
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

router.get('/teacher/dashboard', async (req, res) => {
    console.log('hello')
    res.send('hello')
})
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
})


/**************************8User**************8 */

router.get('/newUser', (req, res) => {
    res.render('newUser')
})


router.post('/users', (req, res) => {
    
    const user = new User(req.body)

    user.save().then(() =>{
        // res.status(201).send(user)
        res.redirect('/admin/dashboard')
    }).catch((e) =>{
        res.status(400).send(e);
    })
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
    })
})


// router.patch('/users/:id', async (req, res) => {

    // router.patch('/users/me', auth, async (req, res) => {

router.post('/user/edit/:id', async (req, res) => {
        console.log(req.body);
        const _id = req.params.id;
        console.log(req.body.roll);
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
            return res.status(404).send({ error : 'Invalid Update...!'})
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

    // app.get('/users', (req, res) => {   
//     User.find({}).then((user) => {
//         res.send(user);
//     }).catch((e) => {
//         res.status(500).send(e);
//     })
// });

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

    console.log(req.body)
    
    const course = new Course(req.body)

    course.save().then(() =>{
        // res.status(201).send(user)
        res.redirect('/course')
    }).catch((e) =>{
        res.status(400).send(e);
    })
});

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

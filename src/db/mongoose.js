const mongoose = require('mongoose');
//const validator = require('validator');



// mongoose.connect(process.env.MONGODB_URL, {
//     useNewUrlParser : true,
//     useCreateIndex : true,
//     useFindAndModify : false
// });

mongoose.connect('mongodb://127.0.0.1:27017/student-management', {
    useNewUrlParser : true,
    useCreateIndex : true,
    // useFindAndModify : false
});

//*************************Admin***************** */
// const Admin = mongoose.model('Admin', {
//         name: {
//             type: String,
//             required: true,
//             trim: true
//         },
//         age: {
//             type: Number,
//             required: true
//         }
//     });
    
//     const admin = new Admin({
//         name: 'sujith',
//         age: 22
//     })
    
//     admin.save().then((admin) => {
//         console.log(admin);
//     }).catch((e) => {
//         console.log('error', e);
//     })



//*************************USER******************************** */
// const User = mongoose.model('User', {
//     name: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     age: {
//         type: Number,
//         required: true
//     }
// });

// const me = new User({
//     name: 'sujith',
//     age: 22
// })

// me.save().then((me) => {
//     console.log(me);
// }).catch((e) => {
//     console.log('error', e);
// })

// // ***************TEACHER ************************/
// const Teacher = mongoose.model('Teacher', {
//     name: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     subjects_taught: {
//         type: String,
//         required: true,
//         trim: true
//     }
// });

// const teacher = new Teacher({
//     name: 'Mohan',
//     subjects_taught: 'cloud'
// })

// teacher.save().then((teacher) => {
//     console.log(teacher)
// }).catch((e) => {
//     console.log('error in teacher', e)
// })
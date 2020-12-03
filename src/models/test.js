const mongoose = require('mongoose');
const validator = require('validator')

// const Test = mongoose.model('Test', {
const testSchema = new mongoose.Schema({
    studentName: {
        type: String,
        required: true,
        trim: true
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    teacherName: {
        type: String,
        required: true,
        trim: true
    },score: {
        type: Number,
        required: true,
        default: 00
    },
    questions: [{
        mcq_question: [{
            type: String,
            required: true
        }],
        options: [{
            type: String,
            required: true
        }]
    }],
    answer: [{
        type: String,
        required: true
    }]
});

testSchema.statics.mcqData = async (data,que) => {
     const test = this;


     const mcq = new Test({
        studentName: data.studentName,
        subject: data.subject,
        teacherName: data.teacherName,
        //  questions:que,
        // answer: data.answer
    });
    //  console.log(que)
     const ar = que[0].mcq_question;
    // // const token = jwt.sign({ _id: user._id.toString() }, 'thisismynewcourse')

    // const token = jwt.sign({ _id: user._id.toString() }, 'thisismynewcourse')
    // // // console.log(token)
    ar.forEach(element => {
        // test.questions = test.questions.concat({ element });
        console.log(element.toString())
         mcq.answer = mcq.answer.concat({element}) ;
    });
    
    
     await mcq.save();
    // console.log(que)
    return;
}

const Test = mongoose.model('Test', testSchema);

module.exports = Test;
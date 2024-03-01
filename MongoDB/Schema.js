const mongoose = require('mongoose');
const { Schema } = mongoose;

const Users = new Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            unique: true,
        },
        user_pwd: {
            required: true,
            type: String,
        },
        user_email: {
            required: true,
            type: String,
        },
        user_mobile_no: {
            required: true,
            type: Number,
        },
        created_at: {
            type: Date,
        },
    },
    { timestamps: true }
);
Users.pre('save', function (next) {
    if (!this.user_id) {
        this.user_id = this._id;
    }
    next();
});

module.exports.Users = mongoose.model('Users', Users);

const Stages = new Schema(
    {
        stage_id: {
            type: mongoose.Schema.Types.ObjectId,
            unquie: true,
        },
        stage_name: {
            type: String,
            required: true,
        },
        stage_score: {
            type: Number,
            required: true,
        },
        stage_number: {
            type: String,
            required: true,
        },
        challenge_id: {
            type: String,
            required: true,
        },
        isLocked: { type: Boolean, required: true },
        question: { type: String, required: true },
        ref_answer: { type: String, required: true },
        time_req: { type: String, required: true },
        created_by: { type: String },
        isLocked: {
            type: Boolean,
            required: true,
        },
        user_score: {
            type: Number,
        },
        user_attempts: { type: Number, required: true },
        feedback: { type: Array },
    },
    { timestamps: true }
);

Stages.pre('save', function (next) {
    if (!this.stage_id) {
        this.stage_id = this._id;
    }
    next();
});

module.exports.Stages = mongoose.model('Stages', Stages);

const StageStudentAssessment = new Schema(
    {
        stage_assessment_id: {
            type: mongoose.Schema.Types.ObjectId,
            unique: true,
        },
        stage_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        num_of_attempt: { required: true, type: Number },
        user_answer: { required: true, type: Array },
        answer_score: { type: Array },
        answer_feedback: { type: Array },
        isAttentionRequired: {
            required: true,
            type: Boolean,
        },
        isExamStarted: {
            required: true,
            type: Boolean,
        },
        stageFeedback: {
            type: Array,
        },
        timeTakenToComplete: { type: Array },
        warningCount: { type: Array },
        compileCount: { type: Array },
        hintCount: { type: Array },
        created_by: { type: String },
    },
    { timestamps: true }
);

StageStudentAssessment.pre('save', function (next) {
    if (!this.stage_assessment_id) {
        this.stage_assessment_id = this._id;
    }
    next();
});

module.exports.StageStudentAssessment = mongoose.model(
    'StageStudentAssessment',
    StageStudentAssessment
);

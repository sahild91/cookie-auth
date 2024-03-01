const express = require('express');
const mongoose = require('mongoose');
const otpController = require('../Controllers/otpController');
const signupController = require('../Controllers/signupController');
const loginController = require('../Controllers/loginController');
const Schemas = require('../MongoDB/Schema');
const router = express.Router();

const getModel = (request, req, res) => {
    switch (request.level) {
        case 'Users':
            return {
                user_id: '',
                user_name: request.details.user_name,
                user_pwd: request.details.user_pwd,
                user_email: request.details.user_email,
                user_mobile_no: request.details.user_mobile_no,
                created_at: new Date(),
            };
        case 'Stages':
            return {
                stage_id: request.details.stage_id,
                stage_name: request.details.stage_name,
                stage_score: request.details.stage_score,
                stage_number: request.details.stage_number,
                challenge_id: request.details.challenge_id,
                question: request.details.question,
                ref_answer: request.details.ref_answer,
                time_req: request.details.time_req,
                isLocked: request.details.isLocked,
                user_score: request.details.user_score,
                user_attempts: request.details.user_attempts,
                feedback: request.details.feedback,
                created_by: '',
            };
        case 'StageStudentAssessment':
            return {
                stage_assessment_id: request.details.stage_assessment_id,
                stage_id: request.details.stage_id,
                num_of_attempt: request.details.num_of_attempt,
                user_answer: request.details.user_answer,
                answer_score: request.details.answer_score,
                answer_feedback: request.details.answer_feedback,
                isAttentionRequired: request.details.isAttentionRequired,
                isExamStarted: request.details.isExamStarted,
                stageFeedback: request.details.stageFeedback,
                timeTakenToComplete: request.details.timeTakenToComplete,
                warningCount: request.details.warningCount,
                compileCount: request.details.compileCount,
                hintCount: request.details.hintCount,
                created_by: '',
            };
        case 'Otp':
            return otpController.sendOTP(req, res);
        case 'SignUp':
            return signupController.signup(req, res);
        case 'Login':
            return loginController.login(req, res);
    }
};

const checkForAuthentication = (req, res, next) => {
    if (!['Otp', 'Login', 'SignUp'].includes(req.body.level)) {
        if (req.session.LoggedIn) {
            next();
        } else {
            res.status(400).json({ Message: 'Please login' });
        }
    } else {
        next();
    }
};

const saveDataToDb = async (res, request, details) => {
    try {
        const data = new Schemas[request.level](details);
        console.log(data);
        const dataToSave = await data.save();
        res.status(200).json({ success: true, Message: data });
    } catch (error) {
        res.status(400).json({ success: false, Message: error.message });
    }
};

router.post('/get', checkForAuthentication, async (req, res) => {
    const request = req.body;
    try {
        const documents = await Schemas[`${request.collection}`]
            .find(request.condition)
            .sort(request.sort)
            .exec();
        let details_list = null;
        if (request.format.length !== 0) {
            request.format.unshift('_id');
            let details = [];
            documents.map((docs) => {
                let eachObj = {};
                request.format.map((value) => {
                    eachObj[`${value}`] = docs[`${value}`];
                });
                details.push(eachObj);
            });
            details_list = details;
        } else {
            details_list = documents;
        }
        res.status(200).json({ Success: true, Message: details_list });
    } catch (error) {
        res.status(404).json({
            Success: false,
            Message: error,
        });
    }
});

router.post('/post', checkForAuthentication, async (req, res) => {
    const request = req.body;
    console.log(request);
    const details = getModel(request, req, res);
    if (!['Otp', 'Login', 'SignUp'].includes(request.level)) {
        saveDataToDb(res, request, details);
    }
});

router.post('/update', async (req, res) => {
    const request = req.body;
    switch (request.Type) {
        case 'new':
            try {
                const requiredSchema =
                    fieldToSchemas[
                        Object.entries(request.details['$push']).map(
                            (value) => {
                                return value[0].split('.').slice(-1)[0];
                            }
                        )[0]
                    ];
                console.log(requiredSchema);
                try {
                    let data = new Schemas[requiredSchema](
                        Object.entries(request.details['$push']).map(
                            (value) => {
                                return value[1];
                            }
                        )[0]
                    );
                    await data.validate();
                    try {
                        const update = await Schemas[
                            request.level
                        ].findOneAndUpdate(
                            { _id: request.id },
                            request.details,
                            {
                                new: true,
                            }
                        );
                        res.status(200).json({
                            Success: true,
                            Message: update,
                        });
                    } catch (e) {
                        console.log(e);
                        res.status(404).json({ Success: false, Message: e });
                    }
                } catch (e) {
                    res.status(404).json({
                        Success: false,
                        Message: `Schema validation failed ${e}`,
                    });
                }
            } catch (e) {
                console.log(e);
                res.status(404).json({
                    Success: false,
                    Message: `Schema validation failed ${e}`,
                });
            }
            return;
        case 'existing':
            request.details['updated_at'] = new Date();
            try {
                const update = await Schemas[request.level].findOneAndUpdate(
                    { _id: request.id },
                    request.details,
                    {
                        new: true,
                    }
                );
                res.status(200).json({ Success: true, Message: update });
            } catch (e) {
                console.log(e);
                res.status(404).json({ Success: false, Message: e });
            }
            return;
    }
});

module.exports = router;

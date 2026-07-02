// routes/workspace-member.routes.js

const express =
require("express");

const router =
express.Router();

const authenticate =
require(
    "../middleware/auth.middleware"
);

const {

    validateDeveloperInviteCode

} = require(

    "../middleware/developer-invite.middleware"

);

const workspaceMemberController =
require(

    "../controllers/workspace-member.controller"

);


router.post(

    "/join-developer",

    authenticate,

    validateDeveloperInviteCode,

    workspaceMemberController
    .joinAsDeveloper

);


module.exports =
router;
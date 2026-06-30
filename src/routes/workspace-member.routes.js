// routes/workspace-member.routes.js

const express =
require("express");

const router =
express.Router();

const authenticate =
require("../middleware/auth.middleware");

const {
    validateDeveloperInviteCode
} = require(
    "../middleware/domain-invite.middleware"
);

const workspaceMemberController =
require(
    "../controllers/workspace-member.controller"
);


router.post(
    "/join-as-developer",
    authenticate,
    validateDeveloperInviteCode,
    workspaceMemberController
    .joinAsDeveloper
);


module.exports =
router;
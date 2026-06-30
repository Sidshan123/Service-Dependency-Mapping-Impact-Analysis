// routes/invite.routes.js

const express =
require("express");

const router =
express.Router();

const authenticate =
require("../middleware/auth.middleware");

const {
    canModifyWorkspace,
} = require(
    "../middleware/workspace.middleware"
);

const {canUpdateDomainName} =
require("../middleware/domain.middleware");

const inviteController =
require(
    "../controllers/invite.controller"
);


// Get domain lead invite code
// :id -> workspace id

router.get(
    "/workspace/:id/lead-code",
    authenticate,
    canModifyWorkspace,
    inviteController
    .getLeadInviteCode
);


// Get developer invite code
// :id -> domain id

router.get(
    "/domain/:id/developer-code",
    authenticate,
    canUpdateDomainName,
    inviteController
    .getDeveloperInviteCode
);


module.exports =
router;
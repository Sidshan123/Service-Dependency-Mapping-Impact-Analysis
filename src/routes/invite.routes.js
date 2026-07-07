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

const {canInviteDevelopers} =
require("../middleware/domain.middleware");


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

router.get(
    "/workspace/:workspaceId/invite-codes/developer",
    authenticate,
    canInviteDevelopers,
    inviteController
    .getDeveloperInviteCodes
);


module.exports =
router;
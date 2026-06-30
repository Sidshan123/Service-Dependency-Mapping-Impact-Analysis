const express =
require("express");

const router =
express.Router();

const authenticate =
require("../middleware/auth.middleware");

const {
    canUpdateDomainName,
    canManageDomain,
} = require(
    "../middleware/domain.middleware"
);


const domainController =
require(
    "../controllers/domain.controller"
);

const {
    validateLeadInviteCode
} = require(
    "../middleware/domain-invite.middleware"
);




// Domain creation route

router.post(
    "/",
    authenticate,
    validateLeadInviteCode,
    domainController.createDomain
);


//Domain Name modification route

router.patch(
    "/:id/name",
    authenticate,
    canUpdateDomainName,
    domainController.updateDomainName
);

//Domain deletion route

router.delete(
    "/:id",
    authenticate,
    canManageDomain,
    domainController.deleteDomain
);

//Domain retrieval route


router.get(
    "/:workspaceId",
    authenticate,
    domainController.getDomains
);









module.exports = router;
const express =
require("express");

const router =
express.Router();

const authenticate =
require("../middleware/auth.middleware");

const {
    canModifyWorkspace,
    canOwnerManageDomainLead
} = require(
    "../middleware/workspace.middleware"
);

const workspaceLeaveController =
require(
    "../controllers/workspace-leave.controller"
);


const {canUpdateDomainName} = require(
    "../middleware/domain.middleware"
);


// Developer exit

router.delete(
    "/:id/developer-exit",
    authenticate,
    workspaceLeaveController
    .developerExit
);


// Domain lead self exit options

//:id---->workspace id

router.get(
    "/:id/domain-lead-exit-options",
    authenticate,
    workspaceLeaveController
    .getDomainLeadExitOptions
);


// Domain lead self exit

router.post(
    "/:id/domain-lead-exit",
    authenticate,
    workspaceLeaveController
    .domainLeadExit
);


// Owner changes lead options

//:id --->domain id 

router.get(
    "/:id/change-lead-options",
    authenticate,
    canOwnerManageDomainLead,
    workspaceLeaveController
    .getChangeLeadOptions
);

//owner changes lead update

router.post(
    "/:id/change-lead",
    authenticate,
    canOwnerManageDomainLead,
    workspaceLeaveController
    .changeDomainLead
);



// Owner exit options

router.get(
    "/:id/owner-exit-options",
    authenticate,
    canModifyWorkspace,
    workspaceLeaveController
    .getOwnerExitOptions
);


// Owner exit

router.post(
    "/:id/owner-exit",
    authenticate,
    canModifyWorkspace,
    workspaceLeaveController
    .ownerExit
);


//----------------------------------
//retreiving the domain leads of a workspace
//----------------------------------


router.get(
    "/:id/domain-leads",
    authenticate,
    canModifyWorkspace,
    workspaceLeaveController
    .getDomainLeads
);



//----------------------------------
// Get all developers of a domain
//----------------------------------

router.get(
    "/:id/developers",
    authenticate,
    canUpdateDomainName,
    workspaceLeaveController
    .getDomainDevelopers
);


//----------------------------------
// Remove developer from domain
//----------------------------------

router.delete(
    "/:id/developers/:developerId",
    authenticate,
    canUpdateDomainName,
    workspaceLeaveController
    .removeDeveloper
);





module.exports =
router;
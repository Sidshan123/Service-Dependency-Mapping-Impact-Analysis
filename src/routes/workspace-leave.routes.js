const express =
require("express");

const router =
express.Router();

const authenticate =
require("../middleware/auth.middleware");

const workspaceLeaveController =
require("../controllers/workspace-leave.controller");


const{canOwnerManageDomainLead} =
require("../middleware/workspace.middleware");


const{canModifyWorkspace} =
require("../middleware/workspace.middleware");



const{canUpdateDomainName} =
require("../middleware/domain.middleware");


//Exit options
router.get(
    "/:workspaceId/exit-options",
    authenticate,
    workspaceLeaveController
    .getExitOptions
);

//Exit workspace

router.post(
    "/:workspaceId/exit",
    authenticate,
    workspaceLeaveController
    .exitWorkspace
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
    .getMyDevelopers
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
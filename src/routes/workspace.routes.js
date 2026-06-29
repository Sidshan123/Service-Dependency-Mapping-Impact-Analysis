const express = require("express");

const router = express.Router();

const authMiddleware =
require("../middleware/auth.middleware");

const workspaceController =
require("../controllers/workspace.controller");


const {
    canModifyWorkspace
} = require(
    "../middleware/workspace.middleware"
);

const {canTransferWorkspaceOwnership} =
require("../middleware/workspace.middleware");


//workspace creation route

router.post(
    "/",
    authMiddleware,
    workspaceController.createWorkspace
);

//workspaces retrieval route


router.get(
    "/all",
    authMiddleware,
    workspaceController.getWorkspaces
);

// returns the nodes and  edges of the workspace graph for a given workspace id

router.get(
    "/:id/graph",
    authMiddleware,
    workspaceController.getWorkspaceGraph
);

//generates the graph and impact report for a given workspace id


router.post(
    "/:id/impact-report",
    authMiddleware,
    workspaceController.generateImpactReport
);


//workspace name modification route

router.patch(
    "/:id/name",
    authMiddleware,
    canModifyWorkspace,
    workspaceController.updateWorkspaceName
);

//workspace ownership transfer route


router.patch(
    "/:id/owner",
    authMiddleware,
    canTransferWorkspaceOwnership,
    workspaceController.transferWorkspaceOwnership
);

//workspace deletion route


router.delete(
    "/:id",
    authMiddleware,
    canModifyWorkspace,
    workspaceController.deleteWorkspace
);

//personal workspace name modification route


router.patch(
    "/:id/personal-name",
    authMiddleware,
    canModifyWorkspace,
    workspaceController.updatePersonalWorkspaceName
);

//personal workspace deletion route


router.delete(
    "/:id/personal",
    authMiddleware,
    canModifyWorkspace,
    workspaceController.deletePersonalWorkspace
);


//personal workspace cloning route

router.post(
    "/:id/clone",
    authMiddleware,
    workspaceController
    .cloneWorkspaceToPersonal
);






module.exports = router;
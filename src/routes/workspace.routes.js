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

const {canViewWorkspaceGraph} = require(
    "../middleware/workspace-graph.middleware"
);

const {
    validateLeadInviteCode
} = require(
    "../middleware/domain-invite.middleware"
);

//workspace creation route

router.post(
    "/",
    authMiddleware,
    workspaceController.createWorkspace
);

//workspaces retrieval route by userID


router.get(
    "/all",
    authMiddleware,
    workspaceController.getWorkspaces
);

// returns the nodes and  edges of the workspace graph for a given workspace id

router.get(
    "/:id/graph",
    authMiddleware,
    canViewWorkspaceGraph,
    workspaceController.getWorkspaceGraph
);

//generates the graph and impact report for a given workspace id


router.post(
    "/:id/impact-report",
    authMiddleware,
    canViewWorkspaceGraph,
    workspaceController.generateImpactReport
);


//workspace name modification route

router.patch(
    "/:id/name",
    authMiddleware,
    canModifyWorkspace,
    workspaceController.updateWorkspaceName
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





// routes/workspace.routes.js

router.get(
    "/search",
    authMiddleware,
    workspaceController
    .searchWorkspace
);





module.exports = router;
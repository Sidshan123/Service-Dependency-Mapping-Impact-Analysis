const express =
require("express");

const router =
express.Router();

const authenticate =
require("../middleware/auth.middleware");

const {
    canManageDependency
} = require(
    "../middleware/dependency.middleware"
);

const {
    canDeleteDependency
} = require(
    "../middleware/dependency.middleware"
);

const dependencyController =
require(
    "../controllers/dependency.controller"
);

// Dependency creation route

router.post(
    "/",
    authenticate,
    canManageDependency,
    dependencyController.createDependency
);

// Dependency DELETION route

router.delete(
    "/:id",
    authenticate,
    canDeleteDependency,
    dependencyController.deleteDependency
);

// Workspace dependencies retrieval route

router.get(
    "/workspace/:workspaceId",
    authenticate,
    dependencyController.getWorkspaceDependencies
);

module.exports = router;
const express =
require("express");

const router =
express.Router();

const authenticate =
require("../middleware/auth.middleware");

const {
    canModifyService
} = require(
    "../middleware/service.middleware"
);

const serviceController =
require(
    "../controllers/service.controller"
);


// Service creation route


router.post(
    "/",
    authenticate,
    canModifyService,
    serviceController.createService
);

// Services retrieval route

router.get(
    "/workspace/:workspaceId",
    authenticate,
    serviceController.getWorkspaceServices
);

// Service name modification route

router.patch(
    "/:id/name",
    authenticate,
    canModifyService,
    serviceController.updateServiceName
);

// Service deletion route

router.delete(
    "/:id",
    authenticate,
    canModifyService,
    serviceController.deleteService
);






module.exports = router;
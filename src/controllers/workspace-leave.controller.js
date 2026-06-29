// controllers/workspace-leave.controller.js

const workspaceLeaveService =
require(
    "../services/workspace-leave.service"
);


exports.developerExit =
async(req,res)=>{

    try{

        const result =
        await workspaceLeaveService
        .developerExit(

            req.params.id,
            req.user.userId

        );

        return res
        .status(200)
        .json(result);

    }
    catch(error){

        return res
        .status(400)
        .json({

            message:
            error.message

        });

    }

};



exports.getDomainLeadExitOptions =
async(req,res)=>{

    try{

        const result =
        await workspaceLeaveService
        .getDomainLeadExitOptions(

            req.params.id,
            req.user.userId

        );

        return res
        .status(200)
        .json(result);

    }
    catch(error){

        return res
        .status(400)
        .json({

            message:
            error.message

        });

    }

};



exports.domainLeadExit =
async(req,res)=>{

    try{

        const result =
        await workspaceLeaveService
        .domainLeadExit(

            req.params.id,
            req.user.userId,
            req.body

        );

        return res
        .status(200)
        .json(result);

    }
    catch(error){

        return res
        .status(400)
        .json({

            message:
            error.message

        });

    }

};



exports.getChangeLeadOptions =
async(req,res)=>{

    try{

        const result =
        await workspaceLeaveService
        .getChangeLeadOptions(
            req.params.id
        );

        return res
        .status(200)
        .json(result);

    }
    catch(error){

        return res
        .status(400)
        .json({

            message:
            error.message

        });

    }

};



exports.changeDomainLead =
async(req,res)=>{

    try{

        const result =
        await workspaceLeaveService
        .changeDomainLead(

            req.params.id,
            req.body

        );

        return res
        .status(200)
        .json(result);

    }
    catch(error){

        return res
        .status(400)
        .json({

            message:
            error.message

        });

    }

};



exports.getOwnerExitOptions =
async(req,res)=>{

    try{

        const result =
        await workspaceLeaveService
        .getOwnerExitOptions(

            req.params.id,
            req.user.userId

        );

        return res
        .status(200)
        .json(result);

    }
    catch(error){

        return res
        .status(400)
        .json({

            message:
            error.message

        });

    }

};



exports.ownerExit =
async(req,res)=>{

    try{

        const result =
        await workspaceLeaveService
        .ownerExit(

            req.params.id,
            req.user.userId,
            req.body

        );

        return res
        .status(200)
        .json(result);

    }
    catch(error){

        return res
        .status(400)
        .json({

            message:
            error.message

        });

    }

};
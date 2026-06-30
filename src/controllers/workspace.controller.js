const workspaceService =
require("../services/workspace.service");

exports.createWorkspace =
async(req,res)=>{

    try{

        const result =
        await workspaceService
        .createWorkspace(

            req.body,

            req.user.userId

        );

        res.status(201)
        .json(result);

    }
    catch(error){

        res.status(400)
        .json({
            message:error.message
        });

    }

};



exports.getWorkspaces =
async(req,res)=>{

    try{

        const result =
        await workspaceService
        .getWorkspaces(
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


exports.updateWorkspaceName =
async(req,res)=>{

    try{

        const result =
        await workspaceService
        .updateWorkspaceName(

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


exports.deleteWorkspace =
async(req,res)=>{

    try{

        const result =
        await workspaceService
        .deleteWorkspace(
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




exports.deletePersonalWorkspace =
async(req,res)=>{

    try{

        const result =
        await workspaceService
        .deletePersonalWorkspace(
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


exports.getWorkspaceGraph =
async(req,res)=>{

    try{

        const result =
        await workspaceService
        .getWorkspaceGraph(
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



exports.cloneWorkspaceToPersonal =
async(req,res)=>{

    try{

        const result =
        await workspaceService
        .cloneWorkspaceToPersonal(

            req.params.id,
            req.user.userId

        );

        return res
        .status(201)
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




exports.generateImpactReport =
async(req,res)=>{

    try{

        const result =
        await workspaceService
        .generateImpactReport(

            req.params.id,

            req.body

        );

        return res
        .status(201)
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


exports.getLeaveOptions =
async(req,res)=>{

    try{

        const result =
        await workspaceService
        .getLeaveOptions(

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



exports.transferDomainLeads =
async(req,res)=>{

    try{

        const result =
        await workspaceService
        .transferDomainLeads(

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



exports.getOwnerOptions =
async(req,res)=>{

    try{

        const result =
        await workspaceService
        .getOwnerOptions(

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



exports.leaveWorkspace =
async(req,res)=>{

    try{

        const result =
        await workspaceService
        .leaveWorkspace(

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




exports.searchWorkspace =
async(req,res)=>{

    try{

        const result =
        await workspaceService
        .searchWorkspace(
            req.query.name
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
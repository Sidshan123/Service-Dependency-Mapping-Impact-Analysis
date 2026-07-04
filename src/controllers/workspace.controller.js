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




exports.updatePersonalWorkspaceName =
async(req,res)=>{

    try{

        const result =
        await workspaceService
        .updatePersonalWorkspaceName(

            req.params.id,
            req.body,
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
async function getWorkspaceGraph(
    req,
    res
){

    try{

        const graph =
        await workspaceService
        .getWorkspaceGraph(

            req.params.id,

            req.workspaceRoles

        );

        return res
        .status(200)
        .json(graph);

    }
    catch(error){

        return res
        .status(500)
        .json({

            message:
            error.message

        });

    }

}



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
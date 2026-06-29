const prisma =
require("../config/prisma");

async function canTransferWorkspaceOwnership(
    req,
    res,
    next
){

    try{

        const workspaceId =
        Number(req.params.id);

        const userId =
        req.user.userId;

        const workspace =
        await prisma.workspaces.findUnique({

            where:{
                id:workspaceId
            }

        });

        if(!workspace){

            return res
            .status(404)
            .json({

                message:
                "Workspace not found"

            });

        }

        if(
            Number(
                workspace.owner_user_id
            ) !== userId
        ){

            return res
            .status(403)
            .json({

                message:
                "Only workspace owner can transfer ownership"

            });

        }

        return next();

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

const prisma =
require("../config/prisma");

async function canModifyWorkspace(
    req,
    res,
    next
){

    try{

        const workspaceId =
        Number(req.params.id);

        const userId =
        req.user.userId;

        const workspace =
        await prisma.workspaces.findUnique({

            where:{
                id:workspaceId
            }

        });

        if(!workspace){

            return res
            .status(404)
            .json({

                message:
                "Workspace not found"

            });

        }

        if(

            Number(
                workspace.owner_user_id
            ) !== userId

        ){

            return res
            .status(403)
            .json({

                message:
                "Only workspace owner can modify workspace"

            });

        }

        return next();

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


async function canOwnerManageDomainLead(
    req,
    res,
    next
){

    const domainId =
    Number(req.params.id);

    const userId =
    req.user.userId;

    const domain =
    await prisma.domains.findUnique({

        where:{
            id:domainId
        }

    });

    if(!domain){

        return res
        .status(404)
        .json({
            message:"Domain not found"
        });

    }

    const workspace =
    await prisma.workspaces.findUnique({

        where:{
            id:domain.workspace_id
        }

    });

    if(
        Number(workspace.owner_user_id)
        !== userId
    ){

        return res
        .status(403)
        .json({

            message:
            "Only workspace owner can change domain lead"

        });

    }

    next();

}


module.exports = {
    canModifyWorkspace,
    canTransferWorkspaceOwnership,
    canOwnerManageDomainLead
};



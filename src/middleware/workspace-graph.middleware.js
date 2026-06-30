const prisma =
require("../config/prisma");

async function canViewWorkspaceGraph(
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

        //----------------------------------
        // OWNER
        //----------------------------------

        if(
            Number(
                workspace.owner_user_id
            ) === userId
        ){

            return next();

        }

        //----------------------------------
        // MEMBER
        //----------------------------------

        const member =
        await prisma.workspace_members
        .findFirst({

            where:{

                workspace_id:
                workspaceId,

                user_id:
                userId

            }

        });

        if(member){

            return next();

        }

        return res
        .status(403)
        .json({

            message:
            "Only workspace members can view the graph"

        });

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

module.exports = {
    canViewWorkspaceGraph
};
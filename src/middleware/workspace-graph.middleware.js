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

        const roles = [];

        //----------------------------------
        // OWNER
        //----------------------------------

        if(
            Number(
                workspace.owner_user_id
            ) === userId
        ){

            roles.push(
                "OWNER"
            );

        }

        //----------------------------------
        // LEAD / DEVELOPER
        //----------------------------------

        const members =
        await prisma.workspace_members.findMany({

            where:{

                workspace_id:
                workspaceId,

                user_id:
                userId

            },

            select:{
                role:true
            }

        });

        members.forEach(

            member => {

                if(
                    !roles.includes(
                        member.role
                    )
                ){

                    roles.push(
                        member.role
                    );

                }

            }

        );

        //----------------------------------
        // NOT A MEMBER
        //----------------------------------

        if(
            roles.length === 0
        ){

            return res
            .status(403)
            .json({

                message:
                "Only workspace members can view the graph"

            });

        }

        req.workspaceRoles =
        roles;

        next();

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
const prisma =
require("../config/prisma");

async function validateLeadInviteCode(
    req,
    res,
    next
){

    try{

        const {

            workspace_id,
            invite_code

        } = req.body;

        if(!workspace_id){

            return res
            .status(400)
            .json({

                message:
                "Workspace id is required"

            });

        }

        const workspace =
        await prisma.workspaces.findUnique({

            where:{

                id:Number(workspace_id)

            },

            select:{

                workspace_type:true

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

            workspace.workspace_type ===
            "PERSONAL"

        ){

            return next();

        }

        if(!invite_code){

            return res
            .status(400)
            .json({

                message:
                "Lead invite code is required"

            });

        }

        const invite =
        await prisma.workspace_invites
        .findFirst({

            where:{

                workspace_id:
                Number(workspace_id),

                invite_code,

                role:
                "LEAD"

            }

        });

        if(!invite){

            return res
            .status(403)
            .json({

                message:
                "Invalid lead invite code"

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

module.exports = {
    validateLeadInviteCode
};
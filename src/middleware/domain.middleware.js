const prisma =
require("../config/prisma");

async function canManageDomain(
    req,
    res,
    next
){

    try{

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

                message:
                "Domain not found"

            });

        }

        const workspace =
        await prisma.workspaces
        .findUnique({

            where:{
                id:domain.workspace_id
            }

        });

        if(

            workspace &&
            Number(
                workspace.owner_user_id
            ) === userId

        ){

            return next();

        }

        const lead =
        await prisma.workspace_members
        .findFirst({

            where:{

                domain_id:
                domainId,

                user_id:
                userId,

                role:
                "LEAD"

            }

        });

        if(lead){

            return next();

        }

        return res
        .status(403)
        .json({

            message:
            "Only workspace owner or domain lead can perform this action"

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



async function canUpdateDomainName(
    req,
    res,
    next
){

    try{

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

                message:
                "Domain not found"

            });

        }

        const lead =
        await prisma.workspace_members
        .findFirst({

            where:{

                domain_id:
                domainId,

                user_id:
                userId,

                role:
                "LEAD"

            }

        });

        if(!lead){

            return res
            .status(403)
            .json({

                message:
                "Only domain lead can update domain name"

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




async function canInviteDevelopers(
    req,
    res,
    next
){

    try{

        const userId = req.user.userId;

        const lead =
        await prisma.workspace_members.findFirst({

            where:{

                user_id:Number(userId),

                role:"LEAD"

            }

        });

        if(!lead){

            return res.status(403).json({

                message:
                "Only domain leads can invite developers or remove them."

            });

        }

        next();

    }
    catch(error){

        return res.status(500).json({

            message:error.message

        });

    }

}


module.exports = {

    canManageDomain,
    canUpdateDomainName,
    canInviteDevelopers

};
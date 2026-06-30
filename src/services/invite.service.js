// services/invite.service.js

const prisma =
require("../config/prisma");


async function getLeadInviteCode(
    workspaceId
){

    const invite =
    await prisma.workspace_invites
    .findFirst({

        where:{

            workspace_id:
            Number(workspaceId),

            role:
            "LEAD"

        }

    });

    if(!invite){

        throw new Error(
            "Lead invite code not found"
        );

    }

    return {

        invite_code:
        invite.invite_code

    };

}



async function getDeveloperInviteCode(
    domainId
){

    const domain =
    await prisma.domains.findUnique({

        where:{
            id:Number(domainId)
        }

    });

    if(!domain){

        throw new Error(
            "Domain not found"
        );

    }

    const invite =
    await prisma.workspace_invites
    .findFirst({

        where:{

            workspace_id:
            domain.workspace_id,

            role:

            `${domain.domain_name}-DEVELOPER`

        }

    });

    if(!invite){

        throw new Error(
            "Developer invite code not found"
        );

    }

    return {

        invite_code:
        invite.invite_code

    };

}


module.exports = {

    getLeadInviteCode,
    getDeveloperInviteCode

};
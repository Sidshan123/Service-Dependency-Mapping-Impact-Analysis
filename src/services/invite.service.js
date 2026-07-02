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

    const invite =
    await prisma.workspace_invites
    .findFirst({

        where:{

            domain_id:
            Number(domainId)

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
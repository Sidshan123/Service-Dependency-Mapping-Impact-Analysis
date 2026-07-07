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



async function getDeveloperInviteCodes(

    workspaceId,
    userId

){

    const domains =
    await prisma.domains.findMany({

        where:{

            workspace_id:
            Number(workspaceId),

            lead_user_id:
            Number(userId)

        },

        select:{

            id:true,

            domain_name:true

        },

        orderBy:{

            domain_name:"asc"

        }

    });

    if(domains.length === 0){

        throw new Error(

            "No domains assigned to this lead"

        );

    }

    const result = [];

    for(const domain of domains){

        const invites =
        await prisma.workspace_invites.findMany({

            where:{

                workspace_id:
                Number(workspaceId),

                domain_id:
                Number(domain.id),

                role:
                "DEVELOPER"

            },

            select:{

                invite_code:true

            }

        });

        result.push({

            domain_id:
            Number(domain.id),

            domain_name:
            domain.domain_name,

            invite_code:
            invites[0]?.invite_code || null

        });

    }

    return result;

}





module.exports = {

    getLeadInviteCode,
    getDeveloperInviteCodes

};
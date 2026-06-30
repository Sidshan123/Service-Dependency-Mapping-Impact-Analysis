// services/workspace-member.service.js

const prisma =
require("../config/prisma");


async function joinAsDeveloper(
    data,
    userId
){

    const {

        workspace_id,
        invite_code

    } = data;

    const invite =
    await prisma.workspace_invites
    .findFirst({

        where:{

            workspace_id:
            Number(
                workspace_id
            ),

            invite_code

        }

    });

    if(!invite){

        throw new Error(
            "Invalid invite code"
        );

    }

    //----------------------------------
    // Extract domain name
    //----------------------------------

    const domainName =

        invite.role.replace(

            "-DEVELOPER",
            ""

        );

    const domain =
    await prisma.domains.findFirst({

        where:{

            workspace_id:
            Number(
                workspace_id
            ),

            domain_name:
            domainName

        }

    });

    if(!domain){

        throw new Error(
            "Domain not found"
        );

    }

    //----------------------------------
    // Already a member?
    //----------------------------------

    const existingMember =
    await prisma.workspace_members
    .findFirst({

        where:{

            workspace_id:
            Number(
                workspace_id
            ),

            domain_id:
            domain.id,

            user_id:
            userId

        }

    });

    if(existingMember){

        throw new Error(
            "User already exists in this domain"
        );

    }

    //----------------------------------
    // Add developer
    //----------------------------------

    await prisma.workspace_members
    .create({

        data:{

            workspace_id:
            Number(
                workspace_id
            ),

            domain_id:
            domain.id,

            user_id:
            userId,

            role:
            "DEVELOPER"

        }

    });

    return {

        message:

        `Joined ${domainName} as developer successfully`

    };

}


module.exports = {
    joinAsDeveloper
};
const prisma =
require("../config/prisma");


async function joinAsDeveloper(
    data,
    userId,
    invite
){

    const {
        workspace_id
    } = data;

    //----------------------------------
    // FETCH DOMAIN
    //----------------------------------

    const domain =
    await prisma.domains.findUnique({

        where:{

            id:
            invite.domain_id

        }

    });

    if(!domain){

        throw new Error(
            "Domain not found"
        );

    }

    //----------------------------------
    // ALREADY A MEMBER?
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
            invite.domain_id,

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
    // ADD DEVELOPER
    //----------------------------------

    await prisma.workspace_members
    .create({

        data:{

            workspace_id:
            Number(
                workspace_id
            ),

            domain_id:
            invite.domain_id,

            user_id:
            userId,

            role:
            "DEVELOPER"

        }

    });

    return {

        message:

        `Joined ${domain.domain_name} as developer successfully`

    };

}

module.exports = {
    joinAsDeveloper
};
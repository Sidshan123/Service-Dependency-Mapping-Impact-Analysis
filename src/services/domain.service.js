const prisma =
require("../config/prisma");

async function generateUniqueInviteCode(
    tx
){

    while(true){

        const inviteCode =

            Math.floor(

                100000 +
                Math.random() * 900000

            ).toString();

        const existingCode =
        await tx.workspace_invites.findUnique({

            where:{

                invite_code:
                inviteCode

            }

        });

        if(!existingCode){

            return inviteCode;

        }

    }

}


async function createDomain(
    data,
    userId
){

    let {

        workspace_id,
        domain_name

    } = data;

    workspace_id =
    Number(workspace_id);

    userId =
    Number(userId);

    if(
        !workspace_id ||
        !domain_name
    ){

        throw new Error(
            "Workspace id and domain name are required"
        );

    }

    const workspace =
    await prisma.workspaces.findUnique({

        where:{

            id:workspace_id

        },

        select:{

            workspace_type:true

        }

    });

    if(!workspace){

        throw new Error(
            "Workspace not found"
        );

    }

    const existingDomain =
await prisma.domains.findFirst({

    where:{

        workspace_id,

        domain_name

    }

});

console.log("workspace_id:", workspace_id);
console.log("domain_name:", domain_name);
console.log("existingDomain:", existingDomain);

if(existingDomain){

    throw new Error(
        "Domain already exists in this workspace"
    );

}

    return await prisma.$transaction(

        async(tx)=>{

            //----------------------------------
            // CREATE DOMAIN
            //----------------------------------

            const domain =
            await tx.domains.create({

                data:{

                    workspace_id,

                    domain_name,

                    lead_user_id:
                    userId

                }

            });

            //----------------------------------
            // ADD DOMAIN LEAD
            //----------------------------------

            await tx.workspace_members.create({

                data:{

                    workspace_id,

                    domain_id:
                    domain.id,

                    user_id:
                    userId,

                    role:
                    "LEAD"

                }

            });

            //----------------------------------
            // PERSONAL WORKSPACE
            //----------------------------------

            if(

                workspace.workspace_type ===
                "PERSONAL"

            ){

                return{

                    message:
                    "Domain created successfully"

                };

            }

            //----------------------------------
            // TEAM WORKSPACE
            // GENERATE DEVELOPER INVITE
            //----------------------------------

            const developerInviteCode =
            await generateUniqueInviteCode(
                tx
            );

            //----------------------------------
            // STORE DEVELOPER INVITE
            //----------------------------------

            await tx.workspace_invites.create({

                data:{

                    workspace_id,

                    domain_id:
                    domain.id,

                    role:
                    "DEVELOPER",

                    invite_code:
                    developerInviteCode

                }

            });

            return{

                message:
                "Domain created successfully",

                developer_invite_code:
                developerInviteCode

            };

        }

    );

}



async function updateDomainName(
    domainId,
    data
){

    const {
        domain_name
    } = data;

    if(!domain_name){

        throw new Error(
            "Domain name is required"
        );

    }

    const currentDomain =
    await prisma.domains.findUnique({

        where:{
            id:Number(domainId)
        }

    });

    if(!currentDomain){

        throw new Error(
            "Domain not found"
        );

    }

    const existingDomain =
    await prisma.domains.findFirst({

        where:{

            workspace_id:
            currentDomain.workspace_id,

            domain_name:
            domain_name,

            NOT:{
                id:Number(domainId)
            }

        }

    });

    if(existingDomain){

        throw new Error(
            "Domain name already exists in this workspace"
        );

    }

    await prisma.domains.update({

        where:{
            id:Number(domainId)
        },

        data:{
            domain_name
        }

    });

    return {

        message:
        "Domain name updated successfully"

    };

}




async function deleteDomain(
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

    const serviceCount =
    await prisma.services.count({

        where:{

            domain_id:
            Number(domainId)

        }

    });

    if(serviceCount > 0){

        throw new Error(
            "Cannot delete domain. Services exist under this domain."
        );

    }

    await prisma.$transaction(

    async(tx)=>{

        await tx.workspace_members
        .deleteMany({

            where:{

                domain_id:
                Number(domainId)

            }

        });

        await tx.workspace_invites
        .deleteMany({

            where:{

                domain_id:
                Number(domainId)

            }

        });

        await tx.domains
        .delete({

            where:{
                id:Number(domainId)
            }

        });

    }

);

    return {

        message:
        "Domain deleted successfully"

    };

}









async function getDomains(

    workspaceId,
    userId

){

    const domains =
    await prisma.domains.findMany({

        where:{

            workspace_id:
            Number(workspaceId)

        },

        select:{

            id:true,

            domain_name:true,

            lead_user_id:true,

            users:{

                select:{

                    name:true

                }

            }

        },

        orderBy:{

            domain_name:
            "asc"

        }

    });

    const my_domains = [];
    const other_domains = [];

    domains.forEach(

        domain => {

            const domainData = {

                id:
                Number(domain.id),

                domain_name:
                domain.domain_name,

                lead_user_id:
                Number(domain.lead_user_id),

                lead_name:
                domain.users?.name
                ||

                "Unknown User"

            };

            if(

                Number(domain.lead_user_id) ===
                Number(userId)

            ){

                my_domains.push(domainData);

            }

            else{

                other_domains.push(domainData);

            }

        }

    );

    return{

        my_domains,

        other_domains

    };

}











module.exports = {

    createDomain,
    updateDomainName,
    deleteDomain,
    getDomains,

};
const prisma =
require("../config/prisma");

async function createDomain(
    data,
    userId
){

    const {
        workspace_id,
        domain_name
    } = data;

    if(
        !workspace_id ||
        !domain_name
    ){

        throw new Error(
            "Workspace id and domain name are required"
        );

    }

    const existingDomain =
    await prisma.domains.findFirst({

        where:{

            workspace_id:
            workspace_id,

            domain_name:
            domain_name

        }

    });

    if(existingDomain){

        throw new Error(
            "Domain already exists in this workspace"
        );

    }

    const domain =
    await prisma.domains.create({

        data:{

            workspace_id:
            workspace_id,

            domain_name:
            domain_name,

            lead_user_id:
            userId

        }

    });

    await prisma.workspace_members.create({

        data:{

            workspace_id:
            workspace_id,

            domain_id:
            domain.id,

            user_id:
            userId,

            role:
            "LEAD"

        }

    });

    return {

        message:
        "Domain created successfully"

    };

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
    workspaceId
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

            lead_user_id:true

        },

        orderBy:{

            domain_name:
            "asc"

        }

    });

    return domains;

}



    











module.exports = {

    createDomain,
    updateDomainName,
    deleteDomain,
    getDomains,

};
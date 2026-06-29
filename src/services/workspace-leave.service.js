const prisma =
require("../config/prisma");



async function developerExit(
    workspaceId,
    userId
){

    workspaceId =
    Number(workspaceId);

    userId =
    Number(userId);

    const lead =
    await prisma.workspace_members
    .findFirst({

        where:{

            workspace_id:
            workspaceId,

            user_id:
            userId,

            role:
            "LEAD"

        }

    });

    if(lead){

        throw new Error(
            "Domain leads cannot use developer exit"
        );

    }

    await prisma.workspace_members
    .deleteMany({

        where:{

            workspace_id:
            workspaceId,

            user_id:
            userId

        }

    });

    return {

        message:
        "Developer exited workspace successfully"

    };

}



async function getDomainLeadExitOptions(
    workspaceId,
    userId
){

    workspaceId =
    Number(workspaceId);

    userId =
    Number(userId);

    const domains =
    await prisma.domains.findMany({

        where:{

            workspace_id:
            workspaceId,

            lead_user_id:
            userId

        }

    });

    if(
        domains.length === 0
    ){

        throw new Error(
            "User is not a domain lead"
        );

    }

    const domainTransfers = [];

    for(
        const domain
        of domains
    ){

        const developers =
        await prisma.workspace_members
        .findMany({

            where:{

                workspace_id:
                workspaceId,

                domain_id:
                domain.id,

                role:
                "DEVELOPER"

            },

            include:{
                users:true
            }

        });

        if(
            developers.length === 0
        ){

            throw new Error(

                `Cannot leave. Domain '${domain.domain_name}' has no developers.`

            );

        }

        domainTransfers.push({

            domain_id:
            domain.id,

            domain_name:
            domain.domain_name,

            developer_candidates:

            developers.map(

                developer => ({

                    id:
                    developer.user_id,

                    name:
                    developer.users.name

                })

            )

        });

    }

    return {

        domain_transfers:
        domainTransfers

    };

}

async function domainLeadExit(
    workspaceId,
    userId,
    data
){

    workspaceId =
    Number(workspaceId);

    userId =
    Number(userId);

    const {
        domain_transfers
    } = data;

    if(
        !domain_transfers ||
        domain_transfers.length === 0
    ){

        throw new Error(
            "Domain transfers are required"
        );

    }

    await prisma.$transaction(

        async(tx)=>{

            for(
                const transfer
                of domain_transfers
            ){

                const {
                    domain_id,
                    new_lead_user_id
                } = transfer;

                const domain =
                await tx.domains.findUnique({

                    where:{
                        id:Number(domain_id)
                    }

                });

                if(!domain){

                    throw new Error(
                        "Domain not found"
                    );

                }

                if(
                    Number(
                        domain.lead_user_id
                    ) !== userId
                ){

                    throw new Error(
                        "You are not the lead of this domain"
                    );

                }

                const developer =
                await tx.workspace_members
                .findFirst({

                    where:{

                        workspace_id:
                        workspaceId,

                        domain_id:
                        Number(domain_id),

                        user_id:
                        Number(
                            new_lead_user_id
                        ),

                        role:
                        "DEVELOPER"

                    }

                });

                if(!developer){

                    throw new Error(
                        "New lead must be a developer of this domain"
                    );

                }

                //----------------------------------
                // Promote developer to LEAD
                //----------------------------------

                await tx.workspace_members
                .update({

                    where:{

                        workspace_id_domain_id_user_id:{

                            workspace_id:
                            workspaceId,

                            domain_id:
                            Number(domain_id),

                            user_id:
                            Number(
                                new_lead_user_id
                            )

                        }

                    },

                    data:{
                        role:"LEAD"
                    }

                });

                //----------------------------------
                // Remove old lead
                //----------------------------------

                await tx.workspace_members
                .delete({

                    where:{

                        workspace_id_domain_id_user_id:{

                            workspace_id:
                            workspaceId,

                            domain_id:
                            Number(domain_id),

                            user_id:
                            userId

                        }

                    }

                });

                //----------------------------------
                // Update domain table
                //----------------------------------

                await tx.domains.update({

                    where:{
                        id:Number(domain_id)
                    },

                    data:{

                        lead_user_id:
                        Number(
                            new_lead_user_id
                        )

                    }

                });

            }

        }

    );

    return {

        message:
        "Domain lead exited successfully"

    };

}




async function getChangeLeadOptions(
    domainId
){

    domainId =
    Number(domainId);

    const domain =
    await prisma.domains.findUnique({

        where:{
            id:domainId
        }

    });

    if(!domain){

        throw new Error(
            "Domain not found"
        );

    }

    const developers =
    await prisma.workspace_members
    .findMany({

        where:{

            domain_id:
            domainId,

            role:
            "DEVELOPER"

        },

        include:{
            users:true
        }

    });

    if(
        developers.length === 0
    ){

        throw new Error(
            "Cannot change lead. No developers available."
        );

    }

    return {

        developer_candidates:

        developers.map(

            developer => ({

                id:
                developer.user_id,

                name:
                developer.users.name

            })

        )

    };

}


async function changeDomainLead(
    domainId,
    data
){

    domainId =
    Number(domainId);

    const {

        new_lead_user_id,
        remove_old_lead

    } = data;

    if(
        !new_lead_user_id
    ){

        throw new Error(
            "New lead user id is required"
        );

    }

    if(
        typeof remove_old_lead !==
        "boolean"
    ){

        throw new Error(
            "remove_old_lead must be true or false"
        );

    }

    await prisma.$transaction(

        async(tx)=>{

            const domain =
            await tx.domains.findUnique({

                where:{
                    id:domainId
                }

            });

            if(!domain){

                throw new Error(
                    "Domain not found"
                );

            }

            const currentLeadId =
            Number(
                domain.lead_user_id
            );

            if(
                currentLeadId ===
                Number(
                    new_lead_user_id
                )
            ){

                throw new Error(
                    "New lead cannot be the current lead"
                );

            }

            const developer =
            await tx.workspace_members
            .findFirst({

                where:{

                    workspace_id:
                    domain.workspace_id,

                    domain_id:
                    domainId,

                    user_id:
                    Number(
                        new_lead_user_id
                    ),

                    role:
                    "DEVELOPER"

                }

            });

            if(!developer){

                throw new Error(
                    "Selected user must be a developer of this domain"
                );

            }

            //----------------------------------
            // Promote developer to LEAD
            //----------------------------------

            await tx.workspace_members
            .update({

                where:{

                    workspace_id_domain_id_user_id:{

                        workspace_id:
                        domain.workspace_id,

                        domain_id:
                        domainId,

                        user_id:
                        Number(
                            new_lead_user_id
                        )

                    }

                },

                data:{
                    role:"LEAD"
                }

            });

            //----------------------------------
            // Remove OR Demote old lead
            //----------------------------------

            if(remove_old_lead){

                await tx.workspace_members
                .delete({

                    where:{

                        workspace_id_domain_id_user_id:{

                            workspace_id:
                            domain.workspace_id,

                            domain_id:
                            domainId,

                            user_id:
                            currentLeadId

                        }

                    }

                });

            }
            else{

                await tx.workspace_members
                .update({

                    where:{

                        workspace_id_domain_id_user_id:{

                            workspace_id:
                            domain.workspace_id,

                            domain_id:
                            domainId,

                            user_id:
                            currentLeadId

                        }

                    },

                    data:{
                        role:
                        "DEVELOPER"
                    }

                });

            }

            //----------------------------------
            // Update domain table
            //----------------------------------

            await tx.domains.update({

                where:{
                    id:domainId
                },

                data:{

                    lead_user_id:
                    Number(
                        new_lead_user_id
                    )

                }

            });

        }

    );

    return {

        message:

        remove_old_lead

        ? "New domain lead assigned successfully and previous lead removed from the domain"

        : "New domain lead assigned successfully and previous lead demoted to developer"

    };

}





async function getOwnerExitOptions(
    workspaceId,
    userId
){

    workspaceId =
    Number(workspaceId);

    userId =
    Number(userId);

    //----------------------------------
    // CHECK IF OWNER IS DOMAIN LEAD
    //----------------------------------

    const ownerDomains =
    await prisma.domains.findMany({

        where:{

            workspace_id:
            workspaceId,

            lead_user_id:
            userId

        }

    });

    //----------------------------------
    // OWNER + DOMAIN LEAD
    //----------------------------------

    if(
        ownerDomains.length > 0
    ){

        const domainTransfers = [];

        for(
            const domain
            of ownerDomains
        ){

            const developers =
            await prisma.workspace_members
            .findMany({

                where:{

                    workspace_id:
                    workspaceId,

                    domain_id:
                    domain.id,

                    role:
                    "DEVELOPER"

                },

                include:{
                    users:true
                }

            });

            if(
                developers.length === 0
            ){

                throw new Error(

                    `Cannot exit workspace. Domain '${domain.domain_name}' has no developers to become lead.`

                );

            }

            domainTransfers.push({

                domain_id:
                domain.id,

                domain_name:
                domain.domain_name,

                developer_candidates:

                developers.map(

                    developer => ({

                        id:
                        developer.user_id,

                        name:
                        developer.users.name

                    })

                )

            });

        }

        return {

            type:
            "OWNER_AND_LEAD",

            domain_transfers:
            domainTransfers

        };

    }

    //----------------------------------
    // OWNER ONLY
    //----------------------------------

    const leads =
    await prisma.workspace_members
    .findMany({

        where:{

            workspace_id:
            workspaceId,

            role:
            "LEAD",

            NOT:{

                user_id:
                userId

            }

        },

        include:{
            users:true
        }

    });

    if(
        leads.length === 0
    ){

        throw new Error(
            "Cannot exit workspace. No domain leads available to become owner."
        );

    }

    return {

        type:
        "OWNER_ONLY",

        owner_candidates:

        leads.map(

            lead => ({

                id:
                lead.user_id,

                name:
                lead.users.name,

                domain_id:
                lead.domain_id

            })

        )

    };

}




async function ownerExit(
    workspaceId,
    userId,
    data
){

    workspaceId =
    Number(workspaceId);

    userId =
    Number(userId);

    const {
        new_owner_user_id
    } = data;

    if(
        !new_owner_user_id
    ){

        throw new Error(
            "New owner user id is required"
        );

    }

    //----------------------------------
    // OWNER SHOULD NO LONGER
    // BE A DOMAIN LEAD
    //----------------------------------

    const ownerDomains =
    await prisma.domains.findMany({

        where:{

            workspace_id:
            workspaceId,

            lead_user_id:
            userId

        }

    });

    if(
        ownerDomains.length > 0
    ){

        throw new Error(

            "Transfer all domain leadership responsibilities before transferring workspace ownership."

        );

    }

    //----------------------------------
    // NEW OWNER MUST BE A LEAD
    //----------------------------------

    const lead =
    await prisma.workspace_members
    .findFirst({

        where:{

            workspace_id:
            workspaceId,

            user_id:
            Number(
                new_owner_user_id
            ),

            role:
            "LEAD"

        }

    });

    if(!lead){

        throw new Error(
            "New owner must be a domain lead"
        );

    }

    //----------------------------------
    // TRANSFER OWNERSHIP
    //----------------------------------

    await prisma.workspaces
    .update({

        where:{
            id:workspaceId
        },

        data:{

            owner_user_id:
            Number(
                new_owner_user_id
            )

        }

    });

    return {

        message:
        "Workspace ownership transferred successfully"

    };

}






module.exports = {

    developerExit,
    getDomainLeadExitOptions,
    domainLeadExit,
    getChangeLeadOptions,
    changeDomainLead,
    getOwnerExitOptions,
    ownerExit 
};
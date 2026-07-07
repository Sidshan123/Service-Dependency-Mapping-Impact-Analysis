const prisma =
require("../config/prisma");





async function getExitOptions(
    workspaceId,
    userId
){

    workspaceId =
    Number(workspaceId);

    userId =
    Number(userId);

    //----------------------------------
    // FIND WORKSPACE
    //----------------------------------

    const workspace =
    await prisma.workspaces.findUnique({

        where:{
            id:workspaceId
        }

    });

    if(!workspace){

        throw new Error(
            "Workspace not found"
        );

    }

    const isOwner =

        Number(
            workspace.owner_user_id
        ) === userId;

    //----------------------------------
    // FIND DOMAINS
    // WHERE USER IS LEAD
    //----------------------------------

    const domains =
    await prisma.domains.findMany({

        where:{

            workspace_id:
            workspaceId,

            lead_user_id:
            userId

        }

    });

    const isLead =
    domains.length > 0;

    //----------------------------------
    // DEVELOPER
    //----------------------------------

    if(
        !isOwner &&
        !isLead
    ){

        return {

            type:
            "DEVELOPER",

            message:
            "You can directly exit this workspace"

        };

    }

    //----------------------------------
    // DOMAIN TRANSFERS
    //----------------------------------

    const domainTransfers = [];

    if(isLead){

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

                    `Domain '${domain.domain_name}' has no developers to become lead`

                );

            }

            domainTransfers.push({

                domain_id:
                Number(
                    domain.id
                ),

                domain_name:
                domain.domain_name,

                developer_candidates:

                developers.map(

                    developer => ({

                        id:
                        Number(
                            developer.user_id
                        ),

                        name:
                        developer.users.name

                    })

                )

            });

        }

    }

    //----------------------------------
    // OWNER CANDIDATES
    //----------------------------------

    let ownerCandidates = [];

    if(isOwner){

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

                "No domain leads available to become workspace owner"

            );

        }

        ownerCandidates =

        leads.map(

            lead => ({

                id:
                Number(
                    lead.user_id
                ),

                name:
                lead.users.name

            })

        );

    }

    //----------------------------------
    // RETURN
    //----------------------------------

    if(
        isOwner &&
        isLead
    ){

        return {

            type:
            "OWNER_AND_LEAD",

            owner_candidates:
            ownerCandidates,

            domain_transfers:
            domainTransfers

        };

    }

    if(isOwner){

        return {

            type:
            "OWNER",

            owner_candidates:
            ownerCandidates

        };

    }

    return {

        type:
        "LEAD",

        domain_transfers:
        domainTransfers

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
                    Number(
                        developer.user_id
                    ),

                name:
                developer.users.name

            })

        )

    };

}



async function exitWorkspace(
    workspaceId,
    userId,
    data
){

    workspaceId =
    Number(workspaceId);

    userId =
    Number(userId);

    const options =
    await getExitOptions(
        workspaceId,
        userId
    );

    //----------------------------------
    // DEVELOPER
    //----------------------------------

    if(
        options.type ===
        "DEVELOPER"
    ){

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
            "Exited workspace successfully"

        };

    }

    //----------------------------------
    // LEAD
    //----------------------------------

    if(
        options.type ===
        "LEAD"
    ){

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

        for(
            const transfer
            of domain_transfers
        ){

            await changeDomainLead(

                transfer.domain_id,

                {

                    new_lead_user_id:
                    transfer.new_lead_user_id,

                    remove_old_lead:
                    true

                }

            );

        }

        return {

            message:
            "Exited workspace successfully"

        };

    }

    //----------------------------------
    // OWNER
    //----------------------------------

    if(
        options.type ===
        "OWNER"
    ){

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

    //----------------------------------
    // OWNER + LEAD
    //----------------------------------

    if(
        options.type ===
        "OWNER_AND_LEAD"
    ){

        const {

            new_owner_user_id,

            domain_transfers

        } = data;

        if(
            !new_owner_user_id
        ){

            throw new Error(
                "New owner user id is required"
            );

        }

        if(
            !domain_transfers ||
            domain_transfers.length === 0
        ){

            throw new Error(
                "Domain transfers are required"
            );

        }

        //----------------------------------
        // CHANGE DOMAIN LEADS
        //----------------------------------

        for(
            const transfer
            of domain_transfers
        ){

            await changeDomainLead(

                transfer.domain_id,

                {

                    new_lead_user_id:
                    transfer.new_lead_user_id,

                    remove_old_lead:
                    true

                }

            );

        }

        //----------------------------------
        // CHANGE OWNER
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

            "Workspace ownership and domain leadership transferred successfully"

        };

    }

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









async function getDomainLeads(
    workspaceId
){

    const domains =
    await prisma.domains.findMany({

        where:{

            workspace_id:
            Number(workspaceId)

        },

        include:{

            users:true
        },

        orderBy:{

            domain_name:
            "asc"

        }

    });

    return domains.map(

        domain => ({

            domain_id:
            Number(
                domain.id
            ),

            domain_name:
            domain.domain_name,

            lead_id:
            Number(
                domain.lead_user_id
            ),

            lead_name:
            domain.users.name

        })

    );

}



async function getMyDevelopers(
    workspaceId,
    userId
){

    // Step 1:
    // Find all domains where the user is the lead

    const domains =
    await prisma.domains.findMany({

        where:{

            workspace_id:
            Number(workspaceId),

            lead_user_id:
            userId

        },

        select:{

            id:true,
            domain_name:true

        }

    });

    // If the lead doesn't own any domains

    if(domains.length===0){

        return [];

    }

    const domainIds =
    domains.map(

        domain=>domain.id

    );

    // Step 2:
    // Fetch all developers from those domains

    const developers =
    await prisma.workspace_members.findMany({

        where:{

            workspace_id:
            Number(workspaceId),

            domain_id:{
                in:domainIds
            },

            role:"DEVELOPER"

        },

        include:{

            users:{

                select:{

                    id:true,
                    name:true,
                    email:true

                }

            },

            domains:{

                select:{

                    domain_name:true

                }

            }

        }

    });

    // Step 3:
    // Return a flat list

    return developers.map(

        developer=>({

            id:
            Number(developer.users.id),

            name:
            developer.users.name,

            email:
            developer.users.email,

            domain:
            developer.domains.domain_name

        })

    );

}




async function removeDeveloper(
    domainId,
    developerId
){

    const member =
    await prisma.workspace_members
    .findFirst({

        where:{

            domain_id:
            Number(domainId),

            user_id:
            Number(developerId),

            role:
            "DEVELOPER"

        }

    });

    if(!member){

        throw new Error(
            "Developer not found"
        );

    }

    await prisma.workspace_members
    .delete({

        where:{

            workspace_id_domain_id_user_id:{

                workspace_id:
                member.workspace_id,

                domain_id:
                Number(domainId),

                user_id:
                Number(developerId)

            }

        }

    });

    return {

        message:
        "Developer removed successfully"

    };

}






module.exports = {

    
    getChangeLeadOptions,
    changeDomainLead,
    getDomainLeads,
    getMyDevelopers,
    removeDeveloper,
    getExitOptions,
    exitWorkspace
};
const prisma =
require("../config/prisma");



async function getExitOptions(
    workspaceId,
    userId,
    exitType
){

    workspaceId =
    Number(workspaceId);

    userId =
    Number(userId);

    //----------------------------------
    // VALIDATE WORKSPACE
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

    //----------------------------------
    // DEVELOPER
    //----------------------------------

    if(

        exitType ===
        "DEVELOPER"

    ){

        return{

            type:
            "DEVELOPER",

            message:
            "You can directly exit this workspace."

        };

    }

    //----------------------------------
    // LEAD / OWNER+LEAD
    //----------------------------------

    let domainTransfers = [];

    if(

        exitType === "LEAD"

        ||

        exitType === "OWNER_AND_LEAD"

    ){

        const leadDomains =
        await prisma.domains.findMany({

            where:{

                workspace_id:
                workspaceId,

                lead_user_id:
                userId

            }

        });

        if(

            leadDomains.length===0

        ){

            throw new Error(

                "You are not a lead of any domain."

            );

        }

        for(

            const domain

            of leadDomains

        ){

            //----------------------------------
            // DEVELOPERS
            //----------------------------------

            const developers =
            await prisma.workspace_members.findMany({

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

            //----------------------------------
            // EXISTING LEADS
            //----------------------------------

            const leads =
            await prisma.workspace_members.findMany({

                where:{

                    workspace_id:
                    workspaceId,

                    role:
                    "LEAD",

                    user_id:{
                        not:userId
                    }

                },

                include:{

                    users:true,

                    domains:true

                }

            });

            const uniqueLeads =
            new Map();

            for(

                const lead

                of leads

            ){

                if(

                    !uniqueLeads.has(

                        Number(
                            lead.user_id
                        )

                    )

                ){

                    uniqueLeads.set(

                        Number(
                            lead.user_id
                        ),

                        {

                            id:
                            Number(
                                lead.user_id
                            ),

                            name:
                            lead.users.name,

                            domain_name:
                            lead.domains.domain_name,

                            user_type:
                            "LEAD"

                        }

                    );

                }

            }

            if(

                developers.length===0

                &&

                uniqueLeads.size===0

            ){

                throw new Error(

                    `Domain '${domain.domain_name}' has no eligible replacement lead.`

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

                    developer=>({

                        id:
                        Number(
                            developer.user_id
                        ),

                        name:
                        developer.users.name,

                        user_type:
                        "DEVELOPER"

                    })

                ),

                existing_lead_candidates:

                [

                    ...uniqueLeads.values()

                ]

            });

        }

    }

    //----------------------------------
    // OWNER / OWNER+LEAD
    //----------------------------------

    let ownerCandidates = [];

    if(

        exitType === "OWNER"

        ||

        exitType === "OWNER_AND_LEAD"

    ){

        const leads =
        await prisma.workspace_members.findMany({

            where:{

                workspace_id:
                workspaceId,

                role:
                "LEAD",

                user_id:{
                    not:userId
                }

            },

            include:{
                users:true
            }

        });

        if(

            leads.length===0

        ){

            throw new Error(

                "No domain leads available to become workspace owner."

            );

        }

        const uniqueOwnerCandidates =
        new Map();

        for(

            const lead

            of leads

        ){

            if(

                !uniqueOwnerCandidates.has(

                    Number(
                        lead.user_id
                    )

                )

            ){

                uniqueOwnerCandidates.set(

                    Number(
                        lead.user_id
                    ),

                    {

                        id:
                        Number(
                            lead.user_id
                        ),

                        name:
                        lead.users.name

                    }

                );

            }

        }

        ownerCandidates =

        [

            ...uniqueOwnerCandidates.values()

        ];

    }

    //----------------------------------
    // RESPONSE
    //----------------------------------

    if(

        exitType ===
        "OWNER"

    ){

        return{

            type:
            "OWNER",

            owner_candidates:
            ownerCandidates

        };

    }

    if(

        exitType ===
        "LEAD"

    ){

        return{

            type:
            "LEAD",

            domain_transfers:
            domainTransfers

        };

    }

    if(

        exitType ===
        "OWNER_AND_LEAD"

    ){

        return{

            type:
            "OWNER_AND_LEAD",

            owner_candidates:
            ownerCandidates,

            domain_transfers:
            domainTransfers

        };

    }

    throw new Error(

        "Invalid exit type."

    );

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

    //----------------------------------
    // GET EXIT TYPE
    //----------------------------------

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

        await prisma.workspace_members.deleteMany({

            where:{

                workspace_id:
                workspaceId,

                user_id:
                userId

            }

        });

        return{

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

        const{

            domain_transfers

        } = data;

        if(

            !domain_transfers ||

            domain_transfers.length===0

        ){

            throw new Error(

                "Domain transfers are required."

            );

        }

        //----------------------------------
        // CHANGE EVERY DOMAIN LEAD
        //----------------------------------

        for(

            const transfer

            of domain_transfers

        ){

            if(

                !transfer.new_lead_user_id ||

                !transfer.user_type

            ){

                throw new Error(

                    `Please select a replacement lead for '${transfer.domain_name}'.`

                );

            }

            await changeDomainLead(

                transfer.domain_id,

                {

                    new_lead_user_id:
                    transfer.new_lead_user_id,

                    user_type:
                    transfer.user_type,

                    //----------------------------------
                    // USER IS EXITING
                    //----------------------------------

                    remove_old_lead:
                    true

                }

            );

        }

        //----------------------------------
        // REMOVE USER FROM WORKSPACE
        //----------------------------------

        await prisma.workspace_members.deleteMany({

            where:{

                workspace_id:
                workspaceId,

                user_id:
                userId

            }

        });

        return{

            message:
            "Exited workspace successfully"

        };

    }

    //----------------------------------
    // OWNER
    //----------------------------------
        //----------------------------------
    // OWNER
    //----------------------------------

    if(

        options.type ===
        "OWNER"

    ){

        const{

            new_owner_user_id

        } = data;

        if(

            !new_owner_user_id

        ){

            throw new Error(

                "New owner user id is required."

            );

        }

        //----------------------------------
        // TRANSFER OWNERSHIP
        //----------------------------------

        await prisma.workspaces.update({

            where:{

                id:
                workspaceId

            },

            data:{

                owner_user_id:
                Number(
                    new_owner_user_id
                )

            }

        });

        return{

            message:
            "Workspace ownership transferred successfully."

        };

    }

    //----------------------------------
    // OWNER + LEAD
    //----------------------------------

    if(

        options.type ===
        "OWNER_AND_LEAD"

    ){

        const{

            new_owner_user_id,

            domain_transfers

        } = data;

        //----------------------------------
        // VALIDATION
        //----------------------------------

        if(

            !new_owner_user_id

        ){

            throw new Error(

                "New owner user id is required."

            );

        }

        if(

            !domain_transfers ||

            domain_transfers.length===0

        ){

            throw new Error(

                "Domain transfers are required."

            );

        }

        //----------------------------------
        // CHANGE DOMAIN LEADS
        //----------------------------------

        for(

            const transfer

            of domain_transfers

        ){

            if(

                !transfer.new_lead_user_id ||

                !transfer.user_type

            ){

                throw new Error(

                    `Please select a replacement lead for '${transfer.domain_name}'.`

                );

            }

            await changeDomainLead(

                transfer.domain_id,

                {

                    new_lead_user_id:
                    transfer.new_lead_user_id,

                    user_type:
                    transfer.user_type,

                    //----------------------------------
                    // EXITING USER
                    //----------------------------------

                    remove_old_lead:
                    true

                }

            );

        }

        //----------------------------------
        // TRANSFER OWNER
        //----------------------------------

        await prisma.workspaces.update({

            where:{

                id:
                workspaceId

            },

            data:{

                owner_user_id:
                Number(
                    new_owner_user_id
                )

            }

        });

        //----------------------------------
        // CLEANUP
        //----------------------------------

        await prisma.workspace_members.deleteMany({

            where:{

                workspace_id:
                workspaceId,

                user_id:
                userId

            }

        });

        return{

            message:

            "Workspace ownership and domain leadership transferred successfully."

        };

    }

    //----------------------------------
    // INVALID TYPE
    //----------------------------------

    throw new Error(

        "Invalid exit option."

    );

}


















async function getChangeLeadOptions(
    domainId,
    currentLeadUserId 
){

    domainId =
    Number(domainId);

    currentLeadUserId =
    Number(currentLeadUserId);

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

    //----------------------------------
    // Current lead domain count
    //----------------------------------

    const currentLeadDomainCount =
    await prisma.workspace_members.count({

        where:{

            workspace_id:
            domain.workspace_id,

            role:
            "LEAD",

            user_id:
            Number(
                currentLeadUserId
            )

        }

    });

    //----------------------------------
    // Developers of THIS domain
    //----------------------------------

    const developers =
    await prisma.workspace_members.findMany({

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

    //----------------------------------
    // Existing Leads in other domains
    //----------------------------------

    const leads =
(
    await prisma.workspace_members.findMany({

        where:{

            workspace_id:
            domain.workspace_id,

            role:
            "LEAD",

            NOT:{

                domain_id:
                domainId

            }

        },

        include:{

            users:true,

            domains:true

        }

    })

).filter(

    lead=>

    Number(
        lead.user_id
    )

    !==

    Number(
        currentLeadUserId
    )

);

    if(

        developers.length === 0
        &&

        leads.length === 0

    ){

        throw new Error(

            "No eligible users available to become lead."

        );

    }

    return{

        current_lead:{

            id:
            currentLeadUserId,

            lead_domain_count:
            currentLeadDomainCount,

            is_multi_domain_lead:
            currentLeadDomainCount > 1

        },

        developers:

        developers.map(

            developer=>({

                id:
                Number(
                    developer.user_id
                ),

                name:
                developer.users.name

            })

        ),

        existing_leads:

        leads.map(

            lead=>({

                id:
                Number(
                    lead.user_id
                ),

                name:
                lead.users.name,

                domain_name:
                lead.domains.domain_name

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

    const{

        new_lead_user_id,
        user_type,
        remove_old_lead

    } = data;

    //----------------------------------
    // VALIDATION
    //----------------------------------

    if(!new_lead_user_id){

        throw new Error(
            "New lead user id is required"
        );

    }

    if(

        user_type !==
        "DEVELOPER"

        &&

        user_type !==
        "LEAD"

    ){

        throw new Error(
            "Invalid user type"
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
    console.log("domainId before Number:", domainId);

    domainId = Number(domainId);

    console.log("domainId after Number:", domainId);
    console.log("isNaN:", Number.isNaN(domainId));

    await prisma.$transaction(

        async(tx)=>{

            //----------------------------------
            // FETCH DOMAIN
            //----------------------------------

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

            //----------------------------------
            // NEW LEAD IS A DEVELOPER
            //----------------------------------

            if(

                user_type ===
                "DEVELOPER"

            ){

                const developer =
                await tx.workspace_members.findFirst({

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
                // PROMOTE TO LEAD
                //----------------------------------

                await tx.workspace_members.update({

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

                        role:
                        "LEAD"

                    }

                });

            }

            //----------------------------------
            // NEW LEAD IS AN EXISTING LEAD
            //----------------------------------

            else{

                const lead =
                await tx.workspace_members.findFirst({

                    where:{

                        workspace_id:
                        domain.workspace_id,

                        user_id:
                        Number(
                            new_lead_user_id
                        ),

                        role:
                        "LEAD"

                    }

                });

                if(!lead){

                    throw new Error(

                        "Selected user is not an existing lead"

                    );

                }

                //----------------------------------
                // ADD LEAD TO THIS DOMAIN
                //----------------------------------

                await tx.workspace_members.create({

                    data:{

                        workspace_id:
                        domain.workspace_id,

                        domain_id:
                        domainId,

                        user_id:
                        Number(
                            new_lead_user_id
                        ),

                        role:
                        "LEAD"

                    }

                });

            }

            //----------------------------------
            // HANDLE PREVIOUS LEAD
            //----------------------------------
                        if(remove_old_lead){

                await tx.workspace_members.delete({

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

                await tx.workspace_members.update({

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
            // UPDATE DOMAIN
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

    //----------------------------------
    // RESPONSE
    //----------------------------------

    return{

        message:

        remove_old_lead

        ?

        "New domain lead assigned successfully and previous lead removed from the domain"

        :

        "New domain lead assigned successfully and previous lead demoted to developer"

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
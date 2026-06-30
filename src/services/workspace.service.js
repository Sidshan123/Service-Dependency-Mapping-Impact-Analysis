const prisma =
require("../config/prisma");

async function createWorkspace(
    data,
    userId
){

    const {
        workspace_name,
        workspace_type
    } = data;

    if(
        !workspace_name ||
        !workspace_type
    ){

        throw new Error(
            "Workspace name and type are required"
        );

    }

    if(
        workspace_type !== "TEAM" &&
        workspace_type !== "PERSONAL"
    ){

        throw new Error(
            "Invalid workspace type"
        );

    }

    let existingWorkspace;

    //----------------------------------
    // TEAM WORKSPACE
    //----------------------------------

    if(
        workspace_type === "TEAM"
    ){

        existingWorkspace =
        await prisma.workspaces.findFirst({

            where:{

                workspace_name,

                workspace_type:
                "TEAM"

            }

        });

        if(existingWorkspace){

            throw new Error(
                "Team workspace name already exists"
            );

        }

    }

    //----------------------------------
    // PERSONAL WORKSPACE
    //----------------------------------

    else{

        existingWorkspace =
        await prisma.workspaces.findFirst({

            where:{

                owner_user_id:
                userId,

                workspace_name,

                workspace_type:
                "PERSONAL"

            }

        });

        if(existingWorkspace){

            throw new Error(
                "Personal workspace name already exists"
            );

        }

    }

    return await prisma.$transaction(

        async(tx)=>{

            //----------------------------------
            // CREATE WORKSPACE
            //----------------------------------

            const workspace =
            await tx.workspaces.create({

                data:{

                    workspace_name,

                    workspace_type,

                    owner_user_id:
                    userId

                }

            });

            //----------------------------------
            // CREATE DOMAIN LEAD
            // INVITE CODE
            //----------------------------------

            if(
                workspace_type ===
                "TEAM"
            ){

                const inviteCode =
                await generateUniqueInviteCode(
                    tx
                );

                await tx.workspace_invites
                .create({

                    data:{

                        workspace_id:
                        workspace.id,

                        domain_id:
                        null,

                        role:
                        "LEAD",

                        invite_code:
                        inviteCode

                    }

                });

                return {

                    message:
                    "Workspace created successfully",

                    lead_invite_code:
                    inviteCode

                };

            }

            return {

                message:
                "Workspace created successfully"

            };

        }

    );

}





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
        await tx.workspace_invites
        .findUnique({

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








async function getWorkspaces(
    userId
){

    const personalWorkspaces =
    await prisma.workspaces.findMany({

        where:{

            owner_user_id:
            userId,

            workspace_type:
            "PERSONAL"

        }

    });

    const memberships =
    await prisma.workspace_members.findMany({

        where:{
            user_id:userId
        },

        include:{
            workspaces:true
        }

    });

    const teamWorkspaces =
    memberships
    .map(

        member =>
        member.workspaces

    )
    .filter(

        workspace =>

        workspace.workspace_type ===
        "TEAM"

    );

    return {

        PERSONAL:
        personalWorkspaces,

        TEAM:
        teamWorkspaces

    };

}



async function deleteWorkspace(
    workspaceId
){

    const workspace =
    await prisma.workspaces.findUnique({

        where:{
            id:Number(workspaceId)
        }

    });

    if(!workspace){

        throw new Error(
            "Workspace not found"
        );

    }

    if(
        workspace.workspace_type !==
        "TEAM"
    ){

        throw new Error(
            "Only TEAM workspaces can be deleted"
        );

    }

    const domainExists =
    await prisma.domains.findFirst({

        where:{

            workspace_id:
            Number(workspaceId)

        }

    });

    if(domainExists){

        throw new Error(
            "Cannot delete workspace. Domains exist."
        );

    }

    await prisma.workspaces.delete({

        where:{
            id:Number(workspaceId)
        }

    });

    return {

        message:
        "Workspace deleted successfully"

    };

}




async function updatePersonalWorkspaceName(
    workspaceId,
    data
){

    workspaceId =
    Number(workspaceId);

    const {
        workspace_name
    } = data;

    if(!workspace_name){

        throw new Error(
            "Workspace name is required"
        );

    }

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

    if(
        workspace.workspace_type !==
        "PERSONAL"
    ){

        throw new Error(
            "Only PERSONAL workspaces can be updated here"
        );

    }

    //----------------------------------
    // PERSONAL UNIQUENESS CHECK
    //----------------------------------

    const existingWorkspace =
    await prisma.workspaces.findFirst({

        where:{

            owner_user_id:
            workspace.owner_user_id,

            workspace_type:
            "PERSONAL",

            workspace_name,

            NOT:{
                id:workspaceId
            }

        }

    });

    if(existingWorkspace){

        throw new Error(
            "Personal workspace name already exists"
        );

    }

    await prisma.workspaces.update({

        where:{
            id:workspaceId
        },

        data:{
            workspace_name
        }

    });

    return {

        message:
        "Personal workspace updated successfully"

    };

}





async function cloneWorkspaceToPersonal(
    workspaceId,
    userId
){

    workspaceId =
    Number(workspaceId);

    return await prisma.$transaction(

        async(tx)=>{

            //------------------------------------------------
            // GET TEAM WORKSPACE
            //------------------------------------------------

            const workspace =
            await tx.workspaces.findUnique({

                where:{
                    id:workspaceId
                }

            });

            if(!workspace){

                throw new Error(
                    "Workspace not found"
                );

            }

            if(
                workspace.workspace_type !==
                "TEAM"
            ){

                throw new Error(
                    "Only TEAM workspaces can be cloned"
                );

            }

            //------------------------------------------------
            // PERSONAL WORKSPACE NAME
            //------------------------------------------------

            const personalWorkspaceName =

                `${workspace.workspace_name} - Personal`;

            //------------------------------------------------
            // DELETE OLD PERSONAL CLONE IF EXISTS
            //------------------------------------------------

            const existingWorkspace =
            await tx.workspaces.findFirst({

                where:{

                    owner_user_id:
                    userId,

                    workspace_name:
                    personalWorkspaceName,

                    workspace_type:
                    "PERSONAL"

                }

            });

            if(existingWorkspace){

                await tx.dependencies.deleteMany({

                    where:{

                        workspace_id:
                        existingWorkspace.id

                    }

                });

                await tx.services.deleteMany({

                    where:{

                        workspace_id:
                        existingWorkspace.id

                    }

                });

                await tx.domains.deleteMany({

                    where:{

                        workspace_id:
                        existingWorkspace.id

                    }

                });

                await tx.workspaces.delete({

                    where:{

                        id:
                        existingWorkspace.id

                    }

                });

            }

            //------------------------------------------------
            // CREATE PERSONAL WORKSPACE
            //------------------------------------------------

            const newWorkspace =
            await tx.workspaces.create({

                data:{

                    workspace_name:
                    personalWorkspaceName,

                    workspace_type:
                    "PERSONAL",

                    owner_user_id:
                    userId

                }

            });

            //------------------------------------------------
            // CLONE DOMAINS
            //------------------------------------------------

            const domains =
            await tx.domains.findMany({

                where:{

                    workspace_id:
                    workspaceId

                }

            });

            const domainMap =
            new Map();

            for(
                const domain
                of domains
            ){

                const newDomain =
                await tx.domains.create({

                    data:{

                        workspace_id:
                        newWorkspace.id,

                        domain_name:
                        domain.domain_name,

                        lead_user_id:
                        userId

                    }

                });

                domainMap.set(

                    Number(domain.id),

                    Number(newDomain.id)

                );

            }

            //------------------------------------------------
            // CLONE SERVICES
            //------------------------------------------------

            const services =
            await tx.services.findMany({

                where:{

                    workspace_id:
                    workspaceId

                }

            });

            const serviceMap =
            new Map();

            for(
                const service
                of services
            ){

                const newService =
                await tx.services.create({

                    data:{

                        workspace_id:
                        newWorkspace.id,

                        domain_id:

                        domainMap.get(

                            Number(
                                service.domain_id
                            )

                        ),

                        service_name:
                        service.service_name,

                        status:
                        service.status

                    }

                });

                serviceMap.set(

                    Number(service.id),

                    Number(newService.id)

                );

            }

            //------------------------------------------------
            // CLONE DEPENDENCIES
            //------------------------------------------------

            const dependencies =
            await tx.dependencies.findMany({

                where:{

                    workspace_id:
                    workspaceId

                }

            });

            for(
                const dependency
                of dependencies
            ){

                await tx.dependencies.create({

                    data:{

                        workspace_id:
                        newWorkspace.id,

                        source_service_id:

                        serviceMap.get(

                            Number(
                                dependency
                                .source_service_id
                            )

                        ),

                        target_service_id:

                        serviceMap.get(

                            Number(
                                dependency
                                .target_service_id
                            )

                        )

                    }

                });

            }

            return {

                message:
                "Workspace cloned successfully",

                workspace_id:
                newWorkspace.id

            };

        }

    );

}



async function updateWorkspaceName(
    workspaceId,
    data
){

    workspaceId =
    Number(workspaceId);

    const {
        workspace_name
    } = data;

    if(!workspace_name){

        throw new Error(
            "Workspace name is required"
        );

    }

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

    if(
        workspace.workspace_type !==
        "TEAM"
    ){

        throw new Error(
            "Only TEAM workspaces can be updated here"
        );

    }

    //----------------------------------
    // GLOBAL CHECK FOR TEAM WORKSPACES
    //----------------------------------

    const existingWorkspace =
    await prisma.workspaces.findFirst({

        where:{

            workspace_type:
            "TEAM",

            workspace_name,

            NOT:{
                id:workspaceId
            }

        }

    });

    if(existingWorkspace){

        throw new Error(
            "Team workspace name already exists"
        );

    }

    await prisma.workspaces.update({

        where:{
            id:workspaceId
        },

        data:{
            workspace_name
        }

    });

    return {

        message:
        "Workspace updated successfully"

    };

}




async function deletePersonalWorkspace(
    workspaceId
){

    const workspace =
    await prisma.workspaces.findUnique({

        where:{
            id:Number(workspaceId)
        }

    });

    if(!workspace){

        throw new Error(
            "Workspace not found"
        );

    }

    if(
        workspace.workspace_type !==
        "PERSONAL"
    ){

        throw new Error(
            "Not a personal workspace"
        );

    }

    await prisma.$transaction(

        async(tx)=>{

            //----------------------------------
            // DELETE DEPENDENCIES
            //----------------------------------

            await tx.dependencies.deleteMany({

                where:{

                    workspace_id:
                    Number(workspaceId)

                }

            });

            //----------------------------------
            // DELETE SERVICES
            //----------------------------------

            await tx.services.deleteMany({

                where:{

                    workspace_id:
                    Number(workspaceId)

                }

            });

            //----------------------------------
            // DELETE DOMAINS
            //----------------------------------

            await tx.domains.deleteMany({

                where:{

                    workspace_id:
                    Number(workspaceId)

                }

            });

            //----------------------------------
            // DELETE WORKSPACE
            //----------------------------------

            await tx.workspaces.delete({

                where:{
                    id:Number(workspaceId)
                }

            });

        }

    );

    return {

        message:
        "Personal workspace deleted successfully"

    };

}




async function getWorkspaceGraph(
    workspaceId
){

    workspaceId =
    Number(workspaceId);

    const services =
    await prisma.services.findMany({

        where:{
            workspace_id:
            workspaceId
        },

        orderBy:{
            service_name:
            "asc"
        }

    });

    //----------------------------------
    // EMPTY GRAPH
    //----------------------------------

    if(
        services.length === 0
    ){

        return {

            graph_exists:
            false,

            message:
            "No services found in this workspace",

            nodes:[],

            edges:[]

        };

    }

    const dependencies =
    await prisma.dependencies.findMany({

        where:{
            workspace_id:
            workspaceId
        }

    });

    const nodes =
    services.map(

        service => ({

            id:
            String(service.id),

            type:
            "default",

            data:{

                label:
                service.service_name,

                domain_id:
                String(
                    service.domain_id
                ),

                status:
                service.status

            }

        })

    );

    const edges =
    dependencies.map(

        dependency => ({

            id:

            `e${dependency.source_service_id}-${dependency.target_service_id}`,

            source:
            String(
                dependency.source_service_id
            ),

            target:
            String(
                dependency.target_service_id
            )

        })

    );

    return {

        graph_exists:
        true,

        nodes,

        edges

    };

}




async function generateImpactReport(
    workspaceId,
    data
){

    workspaceId =
    Number(workspaceId);

    const {
        root_service_id
    } = data;

    if(!root_service_id){

        throw new Error(
            "Root service id is required"
        );

    }

    //--------------------------------------------------
    // CHECK ROOT SERVICE
    //--------------------------------------------------

    const rootService =
    await prisma.services.findFirst({

        where:{

            id:Number(root_service_id),

            workspace_id:
            workspaceId

        }

    });

    if(!rootService){

        throw new Error(
            "Root service not found in workspace"
        );

    }

    //--------------------------------------------------
    // GET ALL SERVICES
    //--------------------------------------------------

    const services =
    await prisma.services.findMany({

        where:{

            workspace_id:
            workspaceId

        }

    });

    //--------------------------------------------------
    // GET ALL DEPENDENCIES
    //--------------------------------------------------

    const dependencies =
    await prisma.dependencies.findMany({

        where:{

            workspace_id:
            workspaceId

        }

    });

    //--------------------------------------------------
    // SERVICE -> DOMAIN MAP
    //--------------------------------------------------

    const serviceDomainMap =
    new Map();

    const serviceNameMap =
    new Map();

    for(
        const service
        of services
    ){

        serviceDomainMap.set(

            Number(service.id),

            Number(service.domain_id)

        );

        serviceNameMap.set(

            Number(service.id),

            service.service_name

        );

    }

    //--------------------------------------------------
    // ADJACENCY LIST
    //--------------------------------------------------

    const graph =
    new Map();

    for(
        const service
        of services
    ){

        graph.set(

            Number(service.id),

            []

        );

    }

    for(
        const dependency
        of dependencies
    ){

        graph.get(

            Number(
                dependency
                .source_service_id
            )

        ).push(

            Number(
                dependency
                .target_service_id
            )

        );

    }

    //--------------------------------------------------
    // DFS
    //--------------------------------------------------

    const visited =
    new Set();

    const affectedDomains =
    new Set();

    function dfs(
        serviceId
    ){

        if(
            visited.has(
                serviceId
            )
        ){

            return;

        }

        visited.add(
            serviceId
        );

        affectedDomains.add(

            serviceDomainMap.get(
                serviceId
            )

        );

        const neighbours =
        graph.get(
            serviceId
        ) || [];

        for(
            const neighbour
            of neighbours
        ){

            dfs(
                neighbour
            );

        }

    }

    dfs(
        Number(root_service_id)
    );

    //--------------------------------------------------
    // CALCULATE METRICS
    //--------------------------------------------------

    const affectedServicesCount =
    visited.size;

    const affectedDomainsCount =
    affectedDomains.size;

    const totalServices =
    services.length;

    const severityScore =
    Math.round(

        (
            affectedServicesCount
            /
            totalServices
        ) * 100

    );

    //--------------------------------------------------
    // RETURN REPORT
    //--------------------------------------------------

    return {

        root_service_id:
        Number(root_service_id),

        root_service_name:
        rootService.service_name,

        affected_services_count:
        affectedServicesCount,

        affected_domains_count:
        affectedDomainsCount,

        severity_score:
        severityScore,

        affected_services:

        Array.from(
            visited
        ).map(

            serviceId => ({

                id:
                serviceId,

                service_name:
                serviceNameMap.get(
                    serviceId
                )

            })

        )

    };

}






async function searchWorkspace(
    workspaceName
){

    if(!workspaceName){

        throw new Error(
            "Workspace name is required"
        );

    }

    //----------------------------------
    // SEARCH ONLY TEAM WORKSPACES
    //----------------------------------

    const workspace =
    await prisma.workspaces
    .findFirst({

        where:{

            workspace_name:
            workspaceName,

            workspace_type:
            "TEAM"

        },

        select:{

            id:true,

            workspace_name:true,

            workspace_type:true

        }

    });

    if(!workspace){

        throw new Error(
            "Workspace not found"
        );

    }

    return workspace;

}


 





module.exports = {

    createWorkspace,
    getWorkspaces,
    updateWorkspaceName,
    deleteWorkspace,
    updatePersonalWorkspaceName,
    deletePersonalWorkspace,
    cloneWorkspaceToPersonal,
    getWorkspaceGraph,
    generateImpactReport,
    searchWorkspace

};
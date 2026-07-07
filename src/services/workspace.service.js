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


    const ownedTeamWorkspaces =
    await prisma.workspaces.findMany({

        where:{

            owner_user_id:
            userId,

            workspace_type:
            "TEAM"

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


    //----------------------------------
    // GROUP MEMBERSHIPS BY WORKSPACE
    //----------------------------------

    const membershipMap =
    new Map();


    for(
        const member
        of memberships
    ){

        const workspaceId =
        Number(
            member.workspace_id
        );


        if(

            !membershipMap.has(
                workspaceId
            )

        ){

            membershipMap.set(

                workspaceId,

                []

            );

        }


        membershipMap
        .get(workspaceId)
        .push(
            member.role
        );

    }


    //----------------------------------
    // JOINED TEAM WORKSPACES
    //----------------------------------

    const joinedTeamWorkspaces =
    memberships
    .map(

        member => ({

            ...member.workspaces,

            roles:

            membershipMap.get(

                Number(
                    member.workspace_id
                )

            )

        })

    )
    .filter(

        workspace =>

        workspace.workspace_type ===
        "TEAM"

    );


    const teamWorkspaceMap =
    new Map();


    //----------------------------------
    // OWNED TEAM WORKSPACES
    //----------------------------------

    for(
        const workspace
        of ownedTeamWorkspaces
    ){

        const roles =

            membershipMap.get(

                Number(workspace.id)

            )

            ||

            [];


        teamWorkspaceMap.set(

            Number(workspace.id),

            {

                ...workspace,

                id:
                Number(workspace.id),

                owner_user_id:
                Number(
                    workspace.owner_user_id
                ),

                roles:[

                    "OWNER",

                    ...roles.filter(

                        role =>

                        role !==
                        "OWNER"

                    )

                ]

            }

        );

    }


    //----------------------------------
    // JOINED TEAM WORKSPACES
    //----------------------------------

    for(
        const workspace
        of joinedTeamWorkspaces
    ){

        if(

            !teamWorkspaceMap.has(

                Number(workspace.id)

            )

        ){

            teamWorkspaceMap.set(

                Number(workspace.id),

                {

                    ...workspace,

                    id:
                    Number(workspace.id),

                    owner_user_id:
                    Number(
                        workspace.owner_user_id
                    )

                }

            );

        }

    }


    return {

        PERSONAL:

            await Promise.all(

                personalWorkspaces.map(

                    async workspace => {

                        const leadDomains =
                        await prisma.domains.count({

                            where:{

                                workspace_id:
                                workspace.id,

                                lead_user_id:
                                userId

                            }

                        });


                        const roles = ["OWNER"];


                        if(

                            leadDomains > 0

                        ){

                            roles.push(
                                "LEAD"
                            );

                        }


                        return {

                            ...workspace,

                            id:
                            Number(workspace.id),

                            owner_user_id:
                            Number(
                                workspace.owner_user_id
                            ),

                            roles

                        };

                    }

                )

            ),


        TEAM:

        Array.from(
            teamWorkspaceMap.values()
        )

    };

}


async function deleteWorkspace(
    workspaceId
){

    workspaceId =
    Number(workspaceId);

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

    //--------------------------------------------------
    // TEAM WORKSPACE
    //--------------------------------------------------

    if(

        workspace.workspace_type ===
        "TEAM"

    ){

        const domainExists =
        await prisma.domains.findFirst({

            where:{
                workspace_id:
                workspaceId
            }

        });

        if(domainExists){

            throw new Error(
                "Cannot delete workspace. Domains exist."
            );

        }

        await prisma.$transaction(

            async(tx)=>{

                //----------------------------------
                // DELETE MEMBERS
                //----------------------------------

                await tx.workspace_members.deleteMany({

                    where:{
                        workspace_id:
                        workspaceId
                    }

                });

                //----------------------------------
                // DELETE INVITES
                //----------------------------------

                await tx.workspace_invites.deleteMany({

                    where:{
                        workspace_id:
                        workspaceId
                    }

                });

                //----------------------------------
                // DELETE WORKSPACE
                //----------------------------------

                await tx.workspaces.delete({

                    where:{
                        id:workspaceId
                    }

                });

            }

        );

        return {

            message:
            "Workspace deleted successfully"

        };

    }

    //--------------------------------------------------
    // PERSONAL WORKSPACE
    //--------------------------------------------------

    if(

        workspace.workspace_type ===
        "PERSONAL"

    ){

        await prisma.$transaction(

            async(tx)=>{

                //----------------------------------
                // DELETE DEPENDENCIES
                //----------------------------------

                await tx.dependencies.deleteMany({

                    where:{
                        workspace_id:
                        workspaceId
                    }

                });

                //----------------------------------
                // DELETE SERVICES
                //----------------------------------

                await tx.services.deleteMany({

                    where:{
                        workspace_id:
                        workspaceId
                    }

                });

                //----------------------------------
                // DELETE MEMBERS
                //----------------------------------

                await tx.workspace_members.deleteMany({

                    where:{
                        workspace_id:
                        workspaceId
                    }

                });

                //----------------------------------
                // DELETE INVITES
                //----------------------------------

                await tx.workspace_invites.deleteMany({

                    where:{
                        workspace_id:
                        workspaceId
                    }

                });

                //----------------------------------
                // DELETE DOMAINS
                //----------------------------------

                await tx.domains.deleteMany({

                    where:{
                        workspace_id:
                        workspaceId
                    }

                });

                //----------------------------------
                // DELETE WORKSPACE
                //----------------------------------

                await tx.workspaces.delete({

                    where:{
                        id:workspaceId
                    }

                });

            }

        );

        return {

            message:
            "Personal workspace deleted successfully"

        };

    }

    throw new Error(
        "Invalid workspace type"
    );

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
            Number(newWorkspace.id)

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


    //----------------------------------
    // FETCH WORKSPACE
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


    let existingWorkspace;


    //----------------------------------
    // TEAM WORKSPACE
    //----------------------------------

    if(

        workspace.workspace_type ===
        "TEAM"

    ){

        existingWorkspace =
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

    }


    //----------------------------------
    // PERSONAL WORKSPACE
    //----------------------------------

    else if(

        workspace.workspace_type ===
        "PERSONAL"

    ){

        existingWorkspace =
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

    }


    //----------------------------------
    // INVALID TYPE
    //----------------------------------

    else{

        throw new Error(
            "Invalid workspace type"
        );

    }


    //----------------------------------
    // UPDATE NAME
    //----------------------------------

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









async function getWorkspaceGraph(
    workspaceId,
    userId
){

    workspaceId =
    Number(workspaceId);


    //----------------------------------
    // GET WORKSPACE DETAILS
    //----------------------------------

    const workspace =
    await prisma.workspaces.findUnique({

        where:{
            id:workspaceId
        },

        select:{

            id:true,

            workspace_name:true,

            workspace_type:true,

            owner_user_id:true

        }

    });


    if(!workspace){

        throw new Error(
            "Workspace not found"
        );

    }


    //----------------------------------
    // BUILD USER ROLES
    //----------------------------------

    const roles = [];


    if(

        Number(
            workspace.owner_user_id
        ) === Number(userId)

    ){

        roles.push(
            "OWNER"
        );

    }


    const leadDomains =
    await prisma.domains.count({

        where:{

            workspace_id:
            workspaceId,

            lead_user_id:
            userId

        }

    });


    if(

        leadDomains > 0

    ){

        roles.push(
            "LEAD"
        );

    }


    const memberships =
    await prisma.workspace_members.findMany({

        where:{

            workspace_id:
            workspaceId,

            user_id:
            userId

        },

        select:{
            role:true
        }

    });


    for(
        const member
        of memberships
    ){

        if(

            !roles.includes(
                member.role
            )

        ){

            roles.push(
                member.role
            );

        }

    }


    //----------------------------------
    // GET SERVICES
    //----------------------------------

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

            id:
            Number(workspace.id),

            workspace_name:
            workspace.workspace_name,

            workspace_type:
            workspace.workspace_type,

            roles,

            graph_exists:
            false,

            message:
            "No services found in this workspace",

            nodes:[],

            edges:[]

        };

    }


    //----------------------------------
    // GET DEPENDENCIES
    //----------------------------------

    const dependencies =
    await prisma.dependencies.findMany({

        where:{
            workspace_id:
            workspaceId
        }

    });


    //----------------------------------
    // BUILD NODES
    //----------------------------------

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


    //----------------------------------
    // BUILD EDGES
    //----------------------------------

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


    //----------------------------------
    // RETURN GRAPH
    //----------------------------------

    return {

        id:
        Number(workspace.id),

        workspace_name:
        workspace.workspace_name,

        workspace_type:
        workspace.workspace_type,

        roles,

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
    // GET ALL DOMAINS
    //--------------------------------------------------

    const domains =
    await prisma.domains.findMany({

        where:{

            workspace_id:
            workspaceId

        }

    });

    const totalDomains =
    domains.length;

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
    // DOMAIN -> NAME MAP
    //--------------------------------------------------

    const domainNameMap =
    new Map();

    for(
        const domain
        of domains
    ){

        domainNameMap.set(

            Number(domain.id),

            domain.domain_name

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
    // AFFECTED NAMES
    //--------------------------------------------------

    const affectedServices =
    [...visited].map(

        serviceId =>

        serviceNameMap.get(
            serviceId
        )

    );

    const affectedDomainNames =
    [...affectedDomains].map(

        domainId =>

        domainNameMap.get(
            domainId
        )

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

    const serviceImpactPercentage =
    totalServices > 0
    ? Math.round(
        (affectedServicesCount / totalServices) * 100
    )
    : 0;

    const domainImpactPercentage =
    totalDomains > 0
    ? Math.round(
        (affectedDomainsCount / totalDomains) * 100
    )
    : 0;

    const severityScore =
    serviceImpactPercentage;

    let severityLevel =
    "LOW";

    if(severityScore >= 75){

        severityLevel =
        "CRITICAL";

    }
    else if(severityScore >= 50){

        severityLevel =
        "HIGH";

    }
    else if(severityScore >= 25){

        severityLevel =
        "MEDIUM";

    }

    //--------------------------------------------------
    // RETURN REPORT
    //--------------------------------------------------

    return{

        rootService:{

            id:
            rootService.id,

            name:
            rootService.service_name

        },

        affectedServicesCount,

        affectedDomainsCount,

        affectedServices,

        affectedDomainNames,

        serviceImpactPercentage,

        domainImpactPercentage,

        severityScore,

        severityLevel

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

    const workspaces =
    await prisma.workspaces
    .findMany({

        where:{

            workspace_name:{

                contains:
                workspaceName

            },

            workspace_type:
            "TEAM"

        },

        select:{

            id:true,

            workspace_name:true,

            workspace_type:true,

            owner_user_id:true,

            created_at:true

        }

    });

    return workspaces.map(

        workspace => ({

            id:
            Number(workspace.id),

            owner_user_id:
            Number(
                workspace.owner_user_id
            ),

            workspace_name:
            workspace.workspace_name,

            workspace_type:
            workspace.workspace_type,

            created_at:
            workspace.created_at

        })

    );

}





 





module.exports = {

    createWorkspace,
    getWorkspaces,
    updateWorkspaceName,
    deleteWorkspace,
    cloneWorkspaceToPersonal,
    getWorkspaceGraph,
    generateImpactReport,
    searchWorkspace

};
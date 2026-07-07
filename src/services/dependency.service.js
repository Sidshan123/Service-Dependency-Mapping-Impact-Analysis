const prisma =
require("../config/prisma");

async function createDependencyService(
    data
){

    let {

        workspace_id,
        source_service_id,
        target_service_id

    } = data;

    workspace_id =
    Number(workspace_id);

    source_service_id =
    Number(source_service_id);

    target_service_id =
    Number(target_service_id);

    if(

        !workspace_id ||
        !source_service_id ||
        !target_service_id

    ){

        throw new Error(
            "Workspace id, source service id and target service id are required"
        );

    }

    if(
        source_service_id ===
        target_service_id
    ){

        throw new Error(
            "Source and target services cannot be the same"
        );

    }

    const sourceService =
    await prisma.services.findUnique({

        where:{
            id:source_service_id
        }

    });

    const targetService =
    await prisma.services.findUnique({

        where:{
            id:target_service_id
        }

    });

    if(
        !sourceService ||
        !targetService
    ){

        throw new Error(
            "Service not found"
        );

    }

    if(

        Number(sourceService.workspace_id) !==
        workspace_id

        ||

        Number(targetService.workspace_id) !==
        workspace_id

    ){

        throw new Error(
            "Services do not belong to this workspace"
        );

    }

    const existingDependency =
    await prisma.dependencies.findFirst({

        where:{

            workspace_id,

            source_service_id,

            target_service_id

        }

    });

    if(existingDependency){

        throw new Error(
            "Dependency already exists"
        );

    }

    await prisma.dependencies.create({

        data:{

            workspace_id,

            source_service_id,

            target_service_id

        }

    });

    return {

        message:
        "Dependency created successfully"

    };

}

async function deleteDependency(
    dependencyId
){

    const dependency =
    await prisma.dependencies
    .findUnique({

        where:{
            id:Number(
                dependencyId
            )
        }

    });

    if(!dependency){

        throw new Error(
            "Dependency not found"
        );

    }

    await prisma.dependencies
    .delete({

        where:{
            id:Number(
                dependencyId
            )
        }

    });

    return {

        message:
        "Dependency deleted successfully"

    };

}



async function getWorkspaceDependencies(

    workspaceId,
    userId

){

    const dependencies =
    await prisma.dependencies.findMany({

        where:{

            workspace_id:
            Number(workspaceId)

        },

        include:{

            services_dependencies_source_service_idToservices:{

                include:{

                    domains:true

                }

            },

            services_dependencies_target_service_idToservices:{

                include:{

                    domains:true

                }

            }

        },

        orderBy:{

            id:"asc"

        }

    });

    const my_dependencies = [];
    const other_dependencies = [];

    dependencies.forEach(

        dependency=>{

            const sourceService =

            dependency
            .services_dependencies_source_service_idToservices;

            const targetService =

            dependency
            .services_dependencies_target_service_idToservices;

            const dependencyData = {

                id:
                Number(dependency.id),

                source_service_id:
                Number(sourceService.id),

                target_service_id:
                Number(targetService.id),

                source_service_name:
                sourceService.service_name,

                target_service_name:
                targetService.service_name,

                source_domain_name:
                sourceService
                .domains
                .domain_name,

                target_domain_name:
                targetService
                .domains
                .domain_name

            };

            if(

                Number(

                    sourceService
                    .domains
                    .lead_user_id

                ) === Number(userId)

                ||

                Number(

                    targetService
                    .domains
                    .lead_user_id

                ) === Number(userId)

            ){

                my_dependencies.push(
                    dependencyData
                );

            }

            else{

                other_dependencies.push(
                    dependencyData
                );

            }

        }

    );

    return{

        my_dependencies,

        other_dependencies

    };

}


module.exports = {
    createDependencyService,
    deleteDependency,
    getWorkspaceDependencies
};
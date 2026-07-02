const prisma =
require("../config/prisma");

async function createService(
    data
){

    const {

        domain_id,
        service_name

    } = data;

    if(
        !domain_id ||
        !service_name
    ){

        throw new Error(
            "Domain id and service name are required"
        );

    }

    const domain =
    await prisma.domains.findUnique({

        where:{
            id:Number(domain_id)
        }

    });

    if(!domain){

        throw new Error(
            "Domain not found"
        );

    }

    const existingService =
    await prisma.services.findFirst({

        where:{

            workspace_id:
            domain.workspace_id,

            service_name

        }

    });

    if(existingService){

        throw new Error(
            "Service already exists in this workspace"
        );

    }

    await prisma.services.create({

        data:{

            workspace_id:
            domain.workspace_id,

            domain_id:
            Number(domain_id),

            service_name,
            status:"ACTIVE"

        }

    });

    return {

        message:
        "Service created successfully"

    };

}




async function updateServiceName(
    serviceId,
    data
){

    serviceId =
    Number(serviceId);

    const {
        service_name
    } = data;

    if(!service_name){

        throw new Error(
            "Service name is required"
        );

    }

    const currentService =
    await prisma.services.findUnique({

        where:{
            id:serviceId
        }

    });

    if(!currentService){

        throw new Error(
            "Service not found"
        );

    }

    const existingService =
    await prisma.services.findFirst({

        where:{

            workspace_id:
            currentService.workspace_id,

            service_name,

            NOT:{
                id:serviceId
            }

        }

    });

    if(existingService){

        throw new Error(
            "Service name already exists in this workspace"
        );

    }

    await prisma.services.update({

        where:{
            id:serviceId
        },

        data:{
            service_name
        }

    });

    return {

        message:
        "Service updated successfully"

    };

}


async function deleteService(
    serviceId
){

    const service =
    await prisma.services.findUnique({

        where:{
            id:Number(serviceId)
        }

    });

    if(!service){

        throw new Error(
            "Service not found"
        );

    }

    const dependency =
    await prisma.dependencies.findFirst({

        where:{

            OR:[

                {
                    source_service_id:
                    Number(serviceId)
                },

                {
                    target_service_id:
                    Number(serviceId)
                }

            ]

        }

    });

    if(dependency){

        throw new Error(
            "Cannot delete service. Dependencies exist."
        );

    }

    await prisma.services.delete({

        where:{
            id:Number(serviceId)
        }

    });

    return {

        message:
        "Service deleted successfully"

    };

}


async function getWorkspaceServices(
    workspaceId
){

    const services =
    await prisma.services.findMany({

        where:{

            workspace_id:
            Number(workspaceId)

        },

        select:{

            id:true,

            service_name:true,

            domain_id:true

        },

        orderBy:{

            service_name:
            "asc"

        }

    });

    return services.map(

        service => ({

            id:
            Number(service.id),

            service_name:
            service.service_name,

            domain_id:
            Number(service.domain_id)

        })

    );

}




module.exports = {

    createService,
    updateServiceName,
    deleteService,
    getWorkspaceServices

};
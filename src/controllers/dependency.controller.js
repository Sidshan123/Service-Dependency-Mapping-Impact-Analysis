const dependencyService =
require(
    "../services/dependency.service"
);

async function createDependency(
    req,
    res
){

    try{

        const result =
        await dependencyService
        .createDependencyService(
            req.body
        );

        return res
        .status(201)
        .json(result);

    }
    catch(error){

        return res
        .status(400)
        .json({

            message:
            error.message

        });

    }

}


async function deleteDependency(
    req,
    res
){

    try{

        const result =
        await dependencyService
        .deleteDependency(
            req.params.id
        );

        return res
        .status(200)
        .json(result);

    }
    catch(error){

        return res
        .status(400)
        .json({

            message:
            error.message

        });

    }

}


async function getWorkspaceDependencies(
    req,
    res
){

    try{

        const result =
        await dependencyService
        .getWorkspaceDependencies(

            req.params.workspaceId,

            req.user.userId

        );

        return res
        .status(200)
        .json(result);

    }

    catch(error){

        return res
        .status(400)
        .json({

            message:
            error.message

        });

    }

};

module.exports = {
    createDependency,
    deleteDependency,
    getWorkspaceDependencies
};
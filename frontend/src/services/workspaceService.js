import api from "./api";

export async function getWorkspaces() {

    const response =
    await api.get(
        "/workspaces/all"
    );

    return response.data;

}



export async function searchWorkspace(
    workspaceName
){

    const response =
    await api.get(

        `/workspaces/search?name=${workspaceName}`

    );

    return response.data;

}




export async function createWorkspace(
    workspaceName
) {

    const response =
    await api.post(

        "/workspaces",

        {

            workspace_name:
            workspaceName,

            workspace_type:
            "TEAM"

        }

    );

    return response.data;

}

export async function renameWorkspace(
    workspace
){

    const endpoint =

        workspace.workspace_type ===
        "TEAM"

        ?

        `/workspaces/${workspace.id}/name`

        :

        `/workspaces/${workspace.id}/personal-name`;

    return api.patch(

        endpoint,

        {

            workspace_name:
            workspace.workspace_name

        }

    );

}


export async function deleteWorkspace(
    workspace
){

    const endpoint =

        workspace.workspace_type ===
        "TEAM"

        ?

        `/workspaces/${workspace.id}`

        :

        `/workspaces/${workspace.id}/personal`;

    return api.delete(
        endpoint
    );

}
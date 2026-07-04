import api from "./api";

//--------------------------------------------------
// GET ALL WORKSPACES
//--------------------------------------------------

export async function getWorkspaces(){

    const response =
    await api.get(
        "/workspaces/all"
    );

    return response.data;

}


//--------------------------------------------------
// SEARCH WORKSPACE
//--------------------------------------------------

export async function searchWorkspace(
    workspaceName
){

    const response =
    await api.get(

        `/workspaces/search?name=${workspaceName}`

    );

    return response.data;

}


//--------------------------------------------------
// CREATE WORKSPACE
//--------------------------------------------------

export async function createWorkspace(
    workspaceName
){

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


//--------------------------------------------------
// RENAME WORKSPACE
//--------------------------------------------------

//--------------------------------------------------
// RENAME WORKSPACE
//--------------------------------------------------

export async function renameWorkspace(
    workspaceId,
    workspaceName
){

    const response =
    await api.patch(

        `/workspaces/${workspaceId}/name`,

        {

            workspace_name:
            workspaceName

        }

    );

    return response.data;

}


//--------------------------------------------------
// DELETE WORKSPACE
//--------------------------------------------------

export async function deleteWorkspace(
    workspaceId
){

    const response =
    await api.delete(

        `/workspaces/${workspaceId}`

    );

    return response.data;

}


//--------------------------------------------------
// CLONE WORKSPACE
//--------------------------------------------------

export async function cloneWorkspace(
    workspaceId
){

    const response =
    await api.post(

        `/workspaces/${workspaceId}/clone`

    );

    return response.data;

}


//--------------------------------------------------
// GET WORKSPACE GRAPH
//--------------------------------------------------

export async function getWorkspaceGraph(
    workspaceId
){

    const response =
    await api.get(

        `/workspaces/${workspaceId}/graph`

    );

    return response.data;

}


//--------------------------------------------------
// GENERATE IMPACT REPORT
//--------------------------------------------------

export async function generateImpactReport(
    workspaceId,
    rootServiceId
){

    const response =
    await api.post(

        `/workspaces/${workspaceId}/impact-report`,

        {

            root_service_id:
            rootServiceId

        }

    );

    return response.data;

}


//--------------------------------------------------
// JOIN AS LEAD
//--------------------------------------------------

export async function joinAsLead(
    workspaceId,
    domainName,
    inviteCode
){

    const response =
    await api.post(

        "/domains",

        {

            workspace_id:
            workspaceId,

            domain_name:
            domainName,

            invite_code:
            inviteCode

        }

    );

    return response.data;

}


//--------------------------------------------------
// JOIN AS DEVELOPER
//--------------------------------------------------

export async function joinAsDeveloper(
    inviteCode
){

    const response =
    await api.post(

        "/workspace-members/join-developer",

        {

            invite_code:
            inviteCode

        }

    );

    return response.data;

}


//--------------------------------------------------
// INVITE DOMAIN LEAD
//--------------------------------------------------

export async function getLeadInviteCode(
    workspaceId
){

    const response =
    await api.get(

        `/invites/workspace/${workspaceId}/lead-code`

    );

    return response.data;

}


//--------------------------------------------------
// GET DOMAIN LEADS
//--------------------------------------------------

export async function getDomains(
    workspaceId
){

    const response =
    await api.get(

        `/domains/${workspaceId}`

    );

    return response.data;

}
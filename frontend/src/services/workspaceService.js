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
    workspaceId,
    inviteCode
){

    const response =
    await api.post(

        "/workspace-members/join-developer",

        {

            workspace_id:
            workspaceId,

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


export async function getDomainLeads(
    workspaceId
){

    const response = await api.get(

        `/workspace-leave/${workspaceId}/domain-leads`

    );

    return response.data;

}

export async function getDeveloperInviteCodes(

    workspaceId

){

    const response =
    await api.get(

        `/invites/workspace/${workspaceId}/invite-codes/developer`

    );

    return response.data;

}

//--------------------------------------------------
// GET MY DEVELOPERS
//--------------------------------------------------


export async function getMyDevelopers(workspaceId){

    const response = await api.get(

        `/workspace-leave/${workspaceId}/developers`

    );

    return response.data;

}



//--------------------------------------------------
// GET DOMAINS
//--------------------------------------------------


export async function getDomains(workspaceId){

    const response = await api.get(

        `/domains/${workspaceId}`

    );

    return response.data;

}



export async function createService(
    data
){

    const response =
    await api.post(

        "/services",

        data

    );

    return response.data;

}


export async function getWorkspaceServices(
    workspaceId
){

    const response =
    await api.get(

        `/services/workspace/${workspaceId}`

    );

    return response.data;

}





export async function createDependency(
    data
){

    const response =
    await api.post(

        "/dependencies",

        data

    );

    return response.data;

}


export async function getWorkspaceDependencies(
    workspaceId
){

    const response =
    await api.get(

        `/dependencies/workspace/${workspaceId}`

    );

    return response.data;

}



export async function removeDeveloper(

    workspaceId,
    developerId

){

    const response =
    await api.delete(

        `/workspace-leave/${workspaceId}/developers/${developerId}`

    );

    return response.data;

}


export async function updateDomainName(

    domainId,
    domain_name

){

    const response =
    await api.patch(

        `/domains/${domainId}/name`,

        {

            domain_name

        }

    );

    return response.data;

}




export async function updateServiceName(

    serviceId,
    service_name

){

    const response =
    await api.patch(

        `/services/${serviceId}/name`,

        {

            service_name

        }

    );

    return response.data;

}


export async function deleteDependency(dependencyId){

    const response = await api.delete(

        `/dependencies/${dependencyId}`

    );

    return response.data;

}




export async function deleteService(
    serviceId
){

    const response =
        await api.delete(

            `/services/${serviceId}`

        );

    return response.data;

}





export async function deleteDomain(
    domainId
){

    const response =
        await api.delete(

            `/domains/${domainId}`

        );

    return response.data;

}


//--------------------------------------------------
// GET CHANGE LEAD OPTIONS
//--------------------------------------------------

export async function getChangeLeadOptions(

    domainId,
    currentLeadUserId

){

    const response =
    await api.get(

        `/workspace-leave/${domainId}/change-lead-options`,

        {

            params:{

                current_lead_user_id:
                currentLeadUserId

            }

        }

    );

    return response.data;

}


//--------------------------------------------------
// CHANGE DOMAIN LEAD
//--------------------------------------------------

export async function changeDomainLead(

    domainId,
    data

){

    const response =
    await api.post(

        `/workspace-leave/${domainId}/change-lead`,

        data

    );

    return response.data;

}
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    UserPlus,
    Users,
    FolderKanban,
    Plus,
    Boxes,
    GitBranch,
    Copy,
    LogOut,
    Trash2
} from "lucide-react";

import {
    cloneWorkspace,
    deleteWorkspace
} from "../services/workspaceService";

import InviteLeadModal from "./InviteLeadModal";
import DomainLeadsModal from "./DomainLeadsModal";
import InviteDeveloperModal from "./InviteDeveloperModal";
import ManageDevelopersModal from "./ManageDevelopersModal";
import CreateDomainModal from "./CreateDomainModal";
import ManageDomainsModal from "./ManageDomainsModal";
import CreateServiceModal from "./CreateServiceModal";
import ManageServicesModal from "./ManageServicesModal";
import CreateDependencyModal from "./CreateDependencyModal";
import ManageDependenciesModal from "./ManageDependenciesModal";
import DeleteWorkspaceModal from "./DeleteWorkspaceModal";

function OwnerLeadActions({

    workspace,
    roles,
    refreshWorkspace

}){

    const navigate = useNavigate();

    const isPersonal =
        workspace?.workspace_type === "PERSONAL";

    const [

        showInviteLeadModal,
        setShowInviteLeadModal

    ] = useState(false);

    const [

        showDomainLeadsModal,
        setShowDomainLeadsModal

    ] = useState(false);

    const [

        showInviteDeveloperModal,
        setShowInviteDeveloperModal

    ] = useState(false);

    const [

        showManageDeveloperModal,
        setShowManageDeveloperModal

    ] = useState(false);

    const [

        showCreateDomainModal,
        setShowCreateDomainModal

    ] = useState(false);

    const [

        showManageDomainsModal,
        setShowManageDomainsModal

    ] = useState(false);

    const [

        showCreateServiceModal,
        setShowCreateServiceModal

    ] = useState(false);

    const [

        showManageServicesModal,
        setShowManageServicesModal

    ] = useState(false);

    const [

        showCreateDependencyModal,
        setShowCreateDependencyModal

    ] = useState(false);

    const [

        showManageDependenciesModal,
        setShowManageDependenciesModal

    ] = useState(false);

    const [

        showDeleteModal,
        setShowDeleteModal

    ] = useState(false);

    async function handleCloneWorkspace(){

        try{

            const response =
                await cloneWorkspace(workspace.id);

            if(

                response.message ===
                "Workspace cloned successfully"

            ){

                navigate(
                    `/workspace/${response.workspace_id}`
                );

                return;

            }

            alert(response.message);

        }
        catch(error){

            alert(

                error.response?.data?.message ||

                "Failed to clone workspace"

            );

        }

    }

    async function handleDeleteWorkspace(){

        try{

            const response =
                await deleteWorkspace(workspace.id);

            if(

                response.message ===
                "Workspace deleted successfully"

                ||

                response.message ===
                "Personal workspace deleted successfully"

            ){

                navigate("/dashboard");

                return;

            }

            alert(response.message);

        }
        catch(error){

            alert(

                error.response?.data?.message ||

                "Failed to delete workspace"

            );

        }

    }

    function handleExitWorkspace(){

        alert(
            "Exit Workspace functionality coming soon!"
        );

    }

    return(

        <>

            <div className="mt-8">

                <h2 className="text-lg font-semibold mb-4">

                    Quick Actions

                </h2>

                <div className="flex flex-wrap gap-4">

                    {!isPersonal && (

                        <>

                            <button
                                onClick={() => setShowInviteLeadModal(true)}
                                className="btn-primary h-14 px-6 rounded-2xl flex items-center gap-3"
                            >
                                <UserPlus size={18}/>
                                Invite Lead
                            </button>

                            <button
                                onClick={() => setShowDomainLeadsModal(true)}
                                className="btn-secondary h-14 px-6 rounded-2xl flex items-center gap-3"
                            >
                                <FolderKanban size={18}/>
                                Manage Domain Leads
                            </button>

                            <button
                                onClick={() => setShowInviteDeveloperModal(true)}
                                className="btn-primary h-14 px-6 rounded-2xl flex items-center gap-3"
                            >
                                <UserPlus size={18}/>
                                Invite Developer
                            </button>

                            <button
                                onClick={() => setShowManageDeveloperModal(true)}
                                className="btn-secondary h-14 px-6 rounded-2xl flex items-center gap-3"
                            >
                                <Users size={18}/>
                                Manage Developers
                            </button>

                        </>

                    )}

                    <button
                        onClick={() => setShowCreateDomainModal(true)}
                        className="btn-secondary h-14 px-6 rounded-2xl flex items-center gap-3"
                    >
                        <Plus size={18}/>
                        Create Domain
                    </button>

                    <button
                        onClick={() => setShowManageDomainsModal(true)}
                        className="btn-secondary h-14 px-6 rounded-2xl flex items-center gap-3"
                    >
                        <FolderKanban size={18}/>
                        Manage Domains
                    </button>


                                        <button
                        onClick={() => setShowCreateServiceModal(true)}
                        className="btn-secondary h-14 px-6 rounded-2xl flex items-center gap-3"
                    >
                        <Plus size={18}/>
                        Create Service
                    </button>

                    <button
                        onClick={() => setShowManageServicesModal(true)}
                        className="btn-secondary h-14 px-6 rounded-2xl flex items-center gap-3"
                    >
                        <Boxes size={18}/>
                        Manage Services
                    </button>

                    <button
                        onClick={() => setShowCreateDependencyModal(true)}
                        className="btn-secondary h-14 px-6 rounded-2xl flex items-center gap-3"
                    >
                        <Plus size={18}/>
                        Create Dependency
                    </button>

                    <button
                        onClick={() => setShowManageDependenciesModal(true)}
                        className="btn-secondary h-14 px-6 rounded-2xl flex items-center gap-3"
                    >
                        <GitBranch size={18}/>
                        Manage Dependencies
                    </button>

                    {!isPersonal && (

                        <>

                            <button
                                onClick={handleCloneWorkspace}
                                className="btn-secondary h-14 px-6 rounded-2xl flex items-center gap-3"
                            >
                                <Copy size={18}/>
                                Clone Workspace
                            </button>

                            <button
                                onClick={handleExitWorkspace}
                                className="btn-secondary h-14 px-6 rounded-2xl flex items-center gap-3"
                            >
                                <LogOut size={18}/>
                                Exit Workspace
                            </button>

                        </>

                    )}

                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="
                            h-14
                            px-6
                            rounded-2xl
                            flex
                            items-center
                            gap-3
                            bg-red-500/15
                            text-red-400
                            hover:bg-red-500/25
                            transition
                        "
                    >
                        <Trash2 size={18}/>
                        Delete Workspace
                    </button>

                </div>

            </div>

            {showInviteLeadModal && (

                <InviteLeadModal
                    workspaceId={workspace.id}
                    onClose={() => setShowInviteLeadModal(false)}
                />

            )}

            {showDomainLeadsModal && (

                <DomainLeadsModal
                    workspaceId={workspace.id}
                    onClose={() => setShowDomainLeadsModal(false)}
                />

            )}

            {showInviteDeveloperModal && (

                <InviteDeveloperModal
                    workspaceId={workspace.id}
                    onClose={() => setShowInviteDeveloperModal(false)}
                />

            )}

            {showManageDeveloperModal && (

                <ManageDevelopersModal
                    workspaceId={workspace.id}
                    onClose={() => setShowManageDeveloperModal(false)}
                />

            )}

            {showCreateDomainModal && (

                <CreateDomainModal
                    workspace={workspace}
                    workspaceId={workspace.id}
                    onClose={() => setShowCreateDomainModal(false)}
                />

            )}

            {showManageDomainsModal && (

                <ManageDomainsModal
                    workspaceId={workspace.id}
                    roles={roles}
                    onClose={() => setShowManageDomainsModal(false)}
                />

            )}

            {showCreateServiceModal && (

                <CreateServiceModal
                    workspaceId={workspace.id}
                    refreshWorkspace={refreshWorkspace} 
                    onClose={() => setShowCreateServiceModal(false)}
                />

            )}

            {showManageServicesModal && (

                <ManageServicesModal

                    workspaceId={workspace.id}
                    refreshWorkspace={refreshWorkspace}
                    onClose={() => setShowManageServicesModal(false)}
                />

            )}

            {showCreateDependencyModal && (

                <CreateDependencyModal

                    workspaceId={workspace.id}

                    refreshWorkspace={refreshWorkspace}

                    onClose={()=>

                        setShowCreateDependencyModal(false)

                    }

                />

            )}

            {showManageDependenciesModal && (

                <ManageDependenciesModal

                    workspaceId={workspace.id}
                    refreshWorkspace={refreshWorkspace}
                    onClose={() => setShowManageDependenciesModal(false)}
                />

            )}

            {showDeleteModal && (

                <DeleteWorkspaceModal
                    workspace={workspace}
                    onClose={() => setShowDeleteModal(false)}
                    onDelete={handleDeleteWorkspace}
                />

            )}

        </>

    );

}

export default OwnerLeadActions;
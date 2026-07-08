import { useState } from "react";
import {
    UserPlus,
    Users,
    FolderKanban,
    Plus,
    Boxes,
    GitBranch,
    Copy,
    LogOut
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import {
    cloneWorkspace
} from "../services/workspaceService";

import CreateDomainModal from "./CreateDomainModal";
import InviteDeveloperModal from "./InviteDeveloperModal";
import ManageDevelopersModal from "./ManageDevelopersModal";
import ManageDomainsModal from "./ManageDomainsModal";
import CreateServiceModal from "./CreateServiceModal";
import ManageServicesModal from "./ManageServicesModal";
import CreateDependencyModal from "./CreateDependencyModal";
import ManageDependenciesModal from "./ManageDependenciesModal";

function LeadActions({
    
    workspace,
    roles,
    refreshWorkspace

}){

    const navigate = useNavigate();

    const isPersonal =
        workspace?.workspace_type === "PERSONAL";

    const [showCreateDomainModal,setShowCreateDomainModal] = useState(false);
    const [showManageDomainsModal,setShowManageDomainsModal] = useState(false);
    const [showInviteDeveloperModal,setShowInviteDeveloperModal] = useState(false);
    const [showManageDeveloperModal,setShowManageDeveloperModal] = useState(false);
    const [showCreateServiceModal,setShowCreateServiceModal] = useState(false);
    const [showManageServicesModal,setShowManageServicesModal] = useState(false);
    const [showCreateDependencyModal,setShowCreateDependencyModal] = useState(false);
    const [showManageDependenciesModal,setShowManageDependenciesModal] = useState(false);

    async function handleCloneWorkspace(){

        try{

            const response =
                await cloneWorkspace(workspace.id);

            if(response.message === "Workspace cloned successfully"){

                navigate(`/workspace/${response.workspace_id}`);
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

                </div>

            </div>

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
                    refreshWorkspace={refreshWorkspace}
                    onClose={() => setShowManageDomainsModal(false)}
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

            {showCreateServiceModal && (

                <CreateServiceModal
                workspaceId={workspace.id}
                refreshWorkspace={refreshWorkspace}
                onClose={() =>
                    setShowCreateServiceModal(false)
                }
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

        </>

    );

}

export default LeadActions;
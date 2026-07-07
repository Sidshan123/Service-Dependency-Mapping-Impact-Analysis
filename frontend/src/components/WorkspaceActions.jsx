import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    UserPlus,
    FolderKanban,
    Users,
    Plus,
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
import ManageDevelopersModal from "./ManageDevelopersModal";
import CreateDomainModal from "./CreateDomainModal";
import DeleteWorkspaceModal from "./DeleteWorkspaceModal";

function WorkspaceActions({

    workspace,
    workspaceId

}) {
    console.log("WorkspaceActions props:", {
    workspace,
    workspaceId
});

    const navigate = useNavigate();

    const isPersonal =
        workspace?.workspace_type === "PERSONAL";

    const [

        showInviteModal,
        setShowInviteModal

    ] = useState(false);

    const [

        showDomainLeadsModal,
        setShowDomainLeadsModal

    ] = useState(false);

    const [

        showManageDevelopersModal,
        setShowManageDevelopersModal

    ] = useState(false);

    const [

        showCreateDomainModal,
        setShowCreateDomainModal

    ] = useState(false);

    const [

        showDeleteModal,
        setShowDeleteModal

    ] = useState(false);

    async function handleCloneWorkspace() {

        try {

            const response =
                await cloneWorkspace(workspace.id);

            if (

                response.message ===
                "Workspace cloned successfully"

            ) {

                navigate(`/workspace/${response.workspace_id}`);
                return;

            }

            alert(response.message);

        }

        catch (error) {

            alert(

                error.response?.data?.message ||

                "Failed to clone workspace"

            );

        }

    }

    async function handleDeleteWorkspace() {

        try {

            const response =
                await deleteWorkspace(workspace.id);

            if (

                response.message ===
                "Workspace deleted successfully"

                ||

                response.message ===
                "Personal workspace deleted successfully"

            ) {

                navigate("/dashboard");
                return;

            }

            alert(response.message);

        }

        catch (error) {

            alert(

                error.response?.data?.message ||

                "Failed to delete workspace"

            );

        }

    }

    function handleExitWorkspace() {

        alert(
            "Exit Workspace functionality coming soon!"
        );

    }

    return (

        <>

            <div className="mt-6">

                <h2 className="text-lg font-semibold mb-4">

                    Quick Actions

                </h2>

                <div className="flex flex-wrap gap-4">

                    {!isPersonal && (

                        <>

                            <button
                                onClick={() => setShowInviteModal(true)}
                                className="btn-primary h-14 px-6 rounded-2xl flex items-center gap-3"
                            >
                                <UserPlus size={18} />
                                Invite Lead
                            </button>

                            <button
                                onClick={() => setShowDomainLeadsModal(true)}
                                className="btn-secondary h-14 px-6 rounded-2xl flex items-center gap-3"
                            >
                                <FolderKanban size={18} />
                                Manage Domain Leads
                            </button>

                            <button
                                onClick={() => setShowManageDevelopersModal(true)}
                                className="btn-secondary h-14 px-6 rounded-2xl flex items-center gap-3"
                            >
                                <Users size={18} />
                                Manage Developers
                            </button>

                            <button
                                onClick={() => setShowCreateDomainModal(true)}
                                className="btn-secondary h-14 px-6 rounded-2xl flex items-center gap-3"
                            >
                                <Plus size={18} />
                                Create Domain
                            </button>

                            <button
                                onClick={handleCloneWorkspace}
                                className="btn-secondary h-14 px-6 rounded-2xl flex items-center gap-3"
                            >
                                <Copy size={18} />
                                Clone Workspace
                            </button>

                            <button
                                onClick={handleExitWorkspace}
                                className="btn-secondary h-14 px-6 rounded-2xl flex items-center gap-3"
                            >
                                <LogOut size={18} />
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
                        <Trash2 size={18} />
                        Delete Workspace
                    </button>

                </div>

            </div>
                        {showInviteModal && (

                <InviteLeadModal
                    workspaceId={workspace.id}
                    onClose={() => setShowInviteModal(false)}
                />

            )}

            {showDomainLeadsModal && (

                <DomainLeadsModal
                    workspaceId={workspace.id}
                    onClose={() => setShowDomainLeadsModal(false)}
                />

            )}

            {showManageDevelopersModal && (

                <ManageDevelopersModal
                    workspaceId={workspaceId}
                    onClose={() =>
                        setShowManageDevelopersModal(false)
                    }
                />

            )}

            {showCreateDomainModal && (

                <CreateDomainModal
                    workspace={workspace}
                    workspaceId={workspace.id}
                    onClose={() => setShowCreateDomainModal(false)}
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

export default WorkspaceActions;
import {

    useEffect,
    useState

}
from "react";

import {

    Search,
    Plus,
    LogOut

}
from "lucide-react";
import toast from "react-hot-toast";

import {

    useNavigate

}
from "react-router-dom";

import WorkspaceCard
from "../components/WorkspaceCard";

import CreateWorkspaceModal
from "../components/CreateWorkspaceModal";

import RenameWorkspaceModal
from "../components/RenameWorkspaceModal";

import DeleteWorkspaceModal
from "../components/DeleteWorkspaceModal";

import {

    getWorkspaces,
    createWorkspace,
    renameWorkspace,
    deleteWorkspace,
    searchWorkspace

}
from "../services/workspaceService";

function Dashboard() {

    const navigate =
    useNavigate();

    const [workspaces, setWorkspaces] =
    useState([]);

    const [loading, setLoading] =
    useState(true);

    const [search, setSearch] =
    useState("");

    const [showCreateModal,
        setShowCreateModal] =
    useState(false);

    const [renameWorkspaceData,
        setRenameWorkspaceData] =
    useState(null);

    const [deleteWorkspaceData,
        setDeleteWorkspaceData] =
    useState(null);

    useEffect(() => {

        fetchWorkspaces();

    }, []);

    async function fetchWorkspaces() {

        try {

            setLoading(true);

            const data =
            await getWorkspaces();

            const merged = [

                ...data.PERSONAL,

                ...data.TEAM

            ];

            setWorkspaces(
                merged
            );

        }
        catch (error) {

            console.log(
                error
            );

            toast.error(

                error.response?.data?.message ||

                "Failed to fetch workspaces."

            );

        }
        finally {

            setLoading(false);

        }

    }

    async function handleSearch(
        event
    ) {

        const value =
        event.target.value;

        setSearch(value);

        if (!value.trim()) {

            fetchWorkspaces();

            return;

        }

        try {

            const result =
            await searchWorkspace(
                value
            );

            setWorkspaces(
                result
            );

        }
        catch {

            setWorkspaces([]);

        }

    }

    async function handleCreateWorkspace(
        workspaceName
    ) {

        await createWorkspace(
            workspaceName
        );

        await fetchWorkspaces();

    }

    async function handleRenameSave(
        workspace
    ){

        try{

            await renameWorkspace(

                workspace.id,

                workspace.workspace_name

            );

            setRenameWorkspaceData(null);

            await fetchWorkspaces();

        }
        catch(error){

            toast.error(

                error.response?.data?.message ||

                "Rename failed"

            );

        }

    }

    async function handleDeleteConfirm(
        workspace
    ) {

        try {

            await deleteWorkspace(
                workspace.id,
            );

            setDeleteWorkspaceData(
                null
            );

            await fetchWorkspaces();

        }
        catch (error) {

            toast.error(

                error.response
                ?.data
                ?.message ||

                "Delete failed"

            );

        }

    }

    function handleRename(
        workspace
    ) {

        setRenameWorkspaceData(
            workspace
        );

    }

    function handleDelete(
        workspace
    ) {

        setDeleteWorkspaceData(
            workspace
        );

    }

    function handleLogout() {

        localStorage.removeItem(
            "token"
        );

        navigate(
            "/"
        );

    }

    return (

        <div
        className="
        min-h-screen
        bg-[var(--bg-primary)]
        px-12
        py-8
        "
        >

            {/* HEADER */}

            <div
            className="
            flex
            items-center
            justify-between
            gap-8
            mb-14
            "
            >

                {/* LOGO */}

                <div
                className="
                flex
                items-center
                gap-5
                min-w-fit
                "
                >

                    <img

                        src="/logo.jpeg"

                        alt="Blast Radius"

                        className="
                        w-14
                        h-14
                        object-contain
                        "

                    />

                    <h2
                    className="
                    text-3xl
                    font-semibold
                    tracking-tight
                    text-[var(--text-primary)]
                    "
                    >

                        Blast Radius

                    </h2>

                </div>

                {/* SEARCH */}

                <div
                className="
                relative
                flex-1
                max-w-3xl
                "
                >

                    <Search
                    size={20}
                    className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-[var(--text-secondary)]
                    "
                    />

                    <input

                        type="text"

                        placeholder=
                        "Search workspaces..."

                        value={search}

                        onChange={handleSearch}

                        className="
                        w-full
                        pl-12
                        pr-4
                        py-3.5
                        rounded-2xl
                        bg-[var(--card-bg)]
                        border
                        border-[var(--border)]
                        text-[var(--text-primary)]
                        placeholder:text-[var(--text-secondary)]
                        font-normal
                        outline-none
                        focus:border-[var(--accent-primary)]
                        focus:ring-2
                        focus:ring-cyan-500/20
                        transition
                        "

                    />

                </div>

                {/* CREATE */}

                <button

                    onClick={() =>

                        setShowCreateModal(
                            true
                        )

                    }

                    className="
                    flex
                    items-center
                    gap-3
                    px-7
                    py-4
                    rounded-2xl
                    bg-[var(--accent-primary)]
                    text-[var(--text-primary)]
                    font-medium
                    tracking-wide
                    hover:bg-[var(--accent-hover)]
                    transition-all
                    duration-200
                    cursor-pointer
                    shadow-lg
                    shadow-cyan-500/20
                    "

                >

                    <Plus size={18} />

                    Create Workspace

                </button>

                {/* LOGOUT */}

                <button

                    onClick={handleLogout}

                    className="
                    flex
                    items-center
                    gap-3
                    px-7
                    py-4
                    rounded-2xl
                    bg-[var(--card-bg)]
                    border
                    border-[var(--border)]
                    text-[var(--text-secondary)]
                    font-medium
                    tracking-wide
                    hover:bg-[var(--bg-secondary)]
                    hover:text-[var(--text-primary)]
                    transition-all
                    duration-200
                    cursor-pointer
                    "

                >

                    <LogOut size={18} />

                    Logout

                </button>

            </div>

            {/* TITLE */}

            <h1
            className="
            text-5xl
            font-semibold
            tracking-tight
            mb-10
            text-[var(--text-primary)]
            "
            >

                My Workspaces

            </h1>

            {

                    loading

                    ?

                    (

                        <div
                        className="
                        font-mono
                        text-[11px]
                        uppercase
                        tracking-[0.2em]
                        text-[var(--text-secondary)]
                        "
                        >

                            Loading Workspaces...

                        </div>

                    )

                    :

                    workspaces.length===0

                    ?

                    (

                        <div
                        className="
                        flex
                        flex-col
                        items-center
                        justify-center
                        rounded-3xl
                        border
                        border-[var(--border)]
                        bg-[var(--card-bg)]
                        py-24
                        px-8
                        text-center
                        "
                        >

                            <h2
                            className="
                            text-3xl
                            font-bold
                            text-[var(--text-primary)]
                            "
                            >

                                No Workspaces Found

                            </h2>

                            <p
                            className="
                            mt-3
                            text-[var(--text-secondary)]
                            "
                            >

                                Create your first workspace to get started.

                            </p>


                        </div>

                    )

                    :

                    (

                        <div
                        className="
                        grid
                        grid-cols-1
                        md:grid-cols-2
                        lg:grid-cols-3
                        gap-8
                        "
                        >

                            {

                                workspaces.map(

                                    workspace=>(

                                        <WorkspaceCard

                                            key={workspace.id}

                                            workspace={workspace}

                                            onRename={handleRename}

                                            onDelete={handleDelete}

                                        />

                                    )

                                )

                            }

                        </div>

                    )

                }

            {

                showCreateModal && (

                    <CreateWorkspaceModal

                        onClose={() =>

                            setShowCreateModal(
                                false
                            )

                        }

                        onCreate={
                            handleCreateWorkspace
                        }

                    />

                )

            }

            {

                renameWorkspaceData && (

                    <RenameWorkspaceModal

                        workspace={
                            renameWorkspaceData
                        }

                        onClose={() =>

                            setRenameWorkspaceData(
                                null
                            )

                        }

                        onSave={
                            handleRenameSave
                        }

                    />

                )

            }

            {

                deleteWorkspaceData && (

                    <DeleteWorkspaceModal

                        workspace={
                            deleteWorkspaceData
                        }

                        onClose={() =>

                            setDeleteWorkspaceData(
                                null
                            )

                        }

                        onDelete={
                            handleDeleteConfirm
                        }

                    />

                )

            }

        </div>

    );

}

export default Dashboard;
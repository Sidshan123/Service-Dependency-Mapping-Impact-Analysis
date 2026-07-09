import {

    useEffect,
    useState

}
from "react";

import {

    X,
    Trash2

}
from "lucide-react";

import toast from "react-hot-toast";

import ConfirmationModal
from "./ConfirmationModal";

import {

    getWorkspaceDependencies,
    deleteDependency

}
from "../services/workspaceService";

function ManageDependenciesModal({

    workspaceId,
    refreshWorkspace,
    onClose

}){

    const [

        myDependencies,
        setMyDependencies

    ] = useState([]);

    const [

        otherDependencies,
        setOtherDependencies

    ] = useState([]);

    const [

        loading,
        setLoading

    ] = useState(true);

    const [

        deleteModalOpen,
        setDeleteModalOpen

    ] = useState(false);

    const [

        selectedDependency,
        setSelectedDependency

    ] = useState(null);

    const [

        actionLoading,
        setActionLoading

    ] = useState(false);

    //--------------------------------------------------
    // FETCH DEPENDENCIES
    //--------------------------------------------------

    useEffect(()=>{

        loadDependencies();

    },[]);

    async function loadDependencies(){

        try{

            const response =

            await getWorkspaceDependencies(

                workspaceId

            );

            setMyDependencies(

                response.my_dependencies

            );

            setOtherDependencies(

                response.other_dependencies

            );

        }

        catch(error){

            toast.error(

                error.response?.data?.message ||

                "Failed to load dependencies."

            );

        }

        finally{

            setLoading(

                false

            );

        }

    }

    //--------------------------------------------------
    // OPEN DELETE MODAL
    //--------------------------------------------------

    function openDeleteModal(

        dependency

    ){

        setSelectedDependency(

            dependency

        );

        setDeleteModalOpen(

            true

        );

    }

    //--------------------------------------------------
    // DELETE DEPENDENCY
    //--------------------------------------------------

    async function handleDelete(){

        if(

            !selectedDependency

        ){

            return;

        }

        setActionLoading(

            true

        );

        try{

            const response =

            await deleteDependency(

                selectedDependency.id

            );

            toast.success(

                response.message ||

                "Dependency deleted successfully."

            );

            await refreshWorkspace?.();

            setMyDependencies(

                previousDependencies =>

                    previousDependencies.filter(

                        dependency =>

                            dependency.id !==

                            selectedDependency.id

                    )

            );

            setDeleteModalOpen(

                false

            );

            setSelectedDependency(

                null

            );

        }

        catch(error){

            toast.error(

                error.response?.data?.message ||

                "Failed to delete dependency."

            );

        }

        finally{

            setActionLoading(

                false

            );

        }

    }

    //--------------------------------------------------
    // RETURN
    //--------------------------------------------------
    return(

    <>

        <div

            className="

                fixed
                inset-0

                z-50

                flex
                items-center
                justify-center

                bg-black/60

            "

        >

            <div

                className="

                    w-[760px]
                    max-h-[80vh]

                    overflow-y-auto

                    rounded-3xl

                    border
                    border-[var(--border)]

                    bg-[var(--card-bg)]

                    p-8

                "

            >

                {/* HEADER */}

                <div

                    className="

                        flex
                        items-center
                        justify-between

                    "

                >

                    <h2

                        className="

                            text-2xl
                            font-bold

                        "

                    >

                        Manage Dependencies

                    </h2>

                    <button

                        onClick={onClose}

                        className="

                            rounded-lg

                            p-2

                            transition

                            hover:bg-zinc-800

                        "

                    >

                        <X size={20}/>

                    </button>

                </div>

                <div

                    className="

                        mt-8

                        space-y-4

                    "

                >

                    {

                        loading

                        ?

                        (

                            <p

                                className="

                                    py-12

                                    text-center

                                    text-[var(--text-secondary)]

                                "

                            >

                                Loading...

                            </p>

                        )

                        :

                        myDependencies.length===0 &&

                        otherDependencies.length===0

                        ?

                        (

                            <p

                                className="

                                    py-12

                                    text-center

                                    text-[var(--text-secondary)]

                                "

                            >

                                No dependencies found.

                            </p>

                        )

                        :

                        <>

                            {

                                myDependencies.length>0

                                &&

                                <>

                                    <h3

                                        className="

                                            mx-auto

                                            mb-3

                                            max-w-[550px]

                                            text-sm
                                            font-semibold

                                            uppercase

                                            tracking-wider

                                            text-[var(--text-secondary)]

                                        "

                                    >

                                        My Dependencies

                                    </h3>

                                    {

                                        myDependencies.map(

                                            dependency=>(

                                                <div

                                                    key={dependency.id}

                                                    className="

                                                        mx-auto

                                                        mb-4

                                                        flex

                                                        max-w-[600px]

                                                        items-center

                                                        justify-between

                                                        rounded-2xl

                                                        border
                                                        border-[var(--border)]

                                                        bg-[var(--bg-primary)]

                                                        px-6
                                                        py-5

                                                    "

                                                >

                                                    <h3

                                                        className="

                                                            text-lg

                                                            font-semibold

                                                        "

                                                    >

                                                        {

                                                            dependency.source_service_name

                                                        }

                                                        {" → "}

                                                        {

                                                            dependency.target_service_name

                                                        }

                                                    </h3>

                                                    <button

                                                        onClick={()=>{

                                                            openDeleteModal(

                                                                dependency

                                                            );

                                                        }}

                                                        className="

                                                            rounded-xl

                                                            bg-red-500/15

                                                            p-3

                                                            text-red-400

                                                            transition

                                                            hover:bg-red-500/25

                                                        "

                                                    >

                                                        <Trash2

                                                            size={18}

                                                        />

                                                    </button>

                                                </div>

                                            )

                                        )

                                    }

                                </>

                            }

                            {

                                otherDependencies.length>0

                                &&

                                <>

                                    <h3

                                        className="

                                            mx-auto

                                            mt-6
                                            mb-3

                                            max-w-[550px]

                                            text-sm
                                            font-semibold

                                            uppercase

                                            tracking-wider

                                            text-[var(--text-secondary)]

                                        "

                                    >

                                        Other Dependencies

                                    </h3>

                                    {

                                        otherDependencies.map(

                                            dependency=>(

                                                <div

                                                    key={dependency.id}

                                                    className="

                                                        mx-auto

                                                        mb-4

                                                        max-w-[600px]

                                                        rounded-2xl

                                                        border
                                                        border-[var(--border)]

                                                        bg-[var(--bg-primary)]

                                                        px-6
                                                        py-5

                                                    "

                                                >

                                                    <h3

                                                        className="

                                                            text-lg

                                                            font-semibold

                                                        "

                                                    >

                                                        {

                                                            dependency.source_service_name

                                                        }

                                                        {" → "}

                                                        {

                                                            dependency.target_service_name

                                                        }

                                                    </h3>

                                                </div>

                                            )

                                        )

                                    }

                                </>

                            }

                        </>

                    }

                </div>

                <button

                    onClick={onClose}

                    className="

                        mt-8

                        w-full

                        rounded-xl

                        border
                        border-[var(--border)]

                        py-3

                        transition

                        hover:bg-zinc-800

                    "

                >

                    Close

                </button>

            </div>

        </div>

        <ConfirmationModal

            isOpen={deleteModalOpen}

            title="Delete Dependency"

            message={`Are you sure you want to delete the dependency "${selectedDependency?.source_service_name} → ${selectedDependency?.target_service_name}"? This action cannot be undone.`}

            confirmText="Delete"

            confirmColor="red"

            loading={actionLoading}

            onConfirm={handleDelete}

            onCancel={()=>{

                setDeleteModalOpen(false);

                setSelectedDependency(null);

            }}

        />

    </>

);

}

export default ManageDependenciesModal;
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

    getMyDevelopers,
    removeDeveloper

}
from "../services/workspaceService";

function ManageDevelopersModal({

    workspaceId,
    onClose

}){

    const [

        developers,
        setDevelopers

    ] = useState([]);

    const [

        loading,
        setLoading

    ] = useState(true);

    const [

        selectedDeveloper,
        setSelectedDeveloper

    ] = useState(null);

    const [

        removeModalOpen,
        setRemoveModalOpen

    ] = useState(false);

    const [

        actionLoading,
        setActionLoading

    ] = useState(false);

    //--------------------------------------------------
    // LOAD DEVELOPERS
    //--------------------------------------------------

    useEffect(()=>{

        loadDevelopers();

    },[]);

    async function loadDevelopers(){

        try{

            const response =

            await getMyDevelopers(

                workspaceId

            );

            setDevelopers(

                response

            );

        }

        catch(error){

            toast.error(

                error.response?.data?.message ||

                "Failed to load developers."

            );

        }

        finally{

            setLoading(

                false

            );

        }

    }

    //--------------------------------------------------
    // OPEN REMOVE MODAL
    //--------------------------------------------------

    function openRemoveModal(

        developer

    ){

        setSelectedDeveloper(

            developer

        );

        setRemoveModalOpen(

            true

        );

    }

    //--------------------------------------------------
    // REMOVE DEVELOPER
    //--------------------------------------------------

    async function handleRemove(){

        if(

            !selectedDeveloper

        ){

            return;

        }

        setActionLoading(

            true

        );

        try{

            const response =

            await removeDeveloper(

                workspaceId,

                selectedDeveloper.id

            );

            toast.success(

                response.message ||

                "Developer removed successfully."

            );

            setDevelopers(

                previousDevelopers=>

                    previousDevelopers.filter(

                        developer=>

                            developer.id !==

                            selectedDeveloper.id

                    )

            );

            setRemoveModalOpen(

                false

            );

            setSelectedDeveloper(

                null

            );

        }

        catch(error){

            toast.error(

                error.response?.data?.message ||

                "Failed to remove developer."

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

                bg-black/60

                flex
                items-center
                justify-center

                z-50

            "

        >

            <div

                className="

                    w-[700px]
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

                        Manage Developers

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

                        developers.length===0

                        ?

                        (

                            <p

                                className="

                                    py-12

                                    text-center

                                    text-[var(--text-secondary)]

                                "

                            >

                                No developers found.

                            </p>

                        )

                        :

                        developers.map(

                            developer=>(

                                <div

                                    key={developer.id}

                                    className="

                                        mx-auto

                                        flex

                                        max-w-[550px]

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

                                    <div>

                                        <h3

                                            className="

                                                text-lg

                                                font-semibold

                                            "

                                        >

                                            {

                                                developer.name

                                            }

                                        </h3>

                                        <p

                                            className="

                                                mt-1

                                                text-sm

                                                text-[var(--text-secondary)]

                                            "

                                        >

                                            Domain:

                                            {" "}

                                            {

                                                developer.domain

                                            }

                                        </p>

                                    </div>

                                    <button

                                        onClick={()=>{

                                            openRemoveModal(

                                                developer

                                            );

                                        }}

                                        className="

                                            flex

                                            items-center

                                            gap-2

                                            rounded-xl

                                            bg-red-500/15

                                            px-4
                                            py-2

                                            text-red-400

                                            transition

                                            hover:bg-red-500/25

                                        "

                                    >

                                        <Trash2

                                            size={18}

                                        />

                                        Remove

                                    </button>

                                </div>

                            )

                        )

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

            isOpen={removeModalOpen}

            title="Remove Developer"

            message={`Are you sure you want to remove "${selectedDeveloper?.name}" from this domain?`}

            confirmText="Remove"

            confirmColor="red"

            loading={actionLoading}

            onConfirm={handleRemove}

            onCancel={()=>{

                setRemoveModalOpen(false);

                setSelectedDeveloper(null);

            }}

        />

    </>

);

}

export default ManageDevelopersModal;
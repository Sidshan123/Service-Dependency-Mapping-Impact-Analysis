import {

    useEffect,
    useState

}
from "react";

import {

    X,
    Pencil,
    Trash2

}
from "lucide-react";

import toast from "react-hot-toast";

import InputModal
from "./InputModal";

import ConfirmationModal
from "./ConfirmationModal";

import {

    getWorkspaceServices,
    updateServiceName,
    deleteService

}
from "../services/workspaceService";

function ManageServicesModal({

    refreshWorkspace,
    workspaceId,
    onClose

}){

    const [

        myServices,
        setMyServices

    ] = useState([]);

    const [

        otherServices,
        setOtherServices

    ] = useState([]);

    const [

        loading,
        setLoading

    ] = useState(true);

    const [

        selectedService,
        setSelectedService

    ] = useState(null);

    const [

        renameModalOpen,
        setRenameModalOpen

    ] = useState(false);

    const [

        deleteModalOpen,
        setDeleteModalOpen

    ] = useState(false);

    const [

        actionLoading,
        setActionLoading

    ] = useState(false);

    //--------------------------------------------------
    // LOAD SERVICES
    //--------------------------------------------------

    useEffect(()=>{

        loadServices();

    },[]);

    async function loadServices(){

        try{

            const response =

            await getWorkspaceServices(

                workspaceId

            );

            setMyServices(

                response.my_services

            );

            setOtherServices(

                response.other_services

            );

        }

        catch(error){

            toast.error(

                error.response?.data?.message ||

                "Failed to load services."

            );

        }

        finally{

            setLoading(

                false

            );

        }

    }

    //--------------------------------------------------
    // OPEN RENAME MODAL
    //--------------------------------------------------

    function openRenameModal(

        service

    ){

        setSelectedService(

            service

        );

        setRenameModalOpen(

            true

        );

    }

    //--------------------------------------------------
    // RENAME SERVICE
    //--------------------------------------------------

    async function handleRename(

        newName

    ){

        if(

            !selectedService

        ){

            return;

        }

        setActionLoading(

            true

        );

        try{

            const response =

            await updateServiceName(

                selectedService.id,

                newName

            );

            toast.success(

                response.message ||

                "Service updated successfully."

            );

            await refreshWorkspace?.();

            await loadServices();

            setRenameModalOpen(

                false

            );

            setSelectedService(

                null

            );

        }

        catch(error){

            toast.error(

                error.response?.data?.message ||

                "Failed to update service."

            );

        }

        finally{

            setActionLoading(

                false

            );

        }

    }

    //--------------------------------------------------
    // OPEN DELETE MODAL
    //--------------------------------------------------

    function openDeleteModal(

        service

    ){

        setSelectedService(

            service

        );

        setDeleteModalOpen(

            true

        );

    }

    //--------------------------------------------------
    // DELETE SERVICE
    //--------------------------------------------------

    async function handleDelete(){

        if(

            !selectedService

        ){

            return;

        }

        setActionLoading(

            true

        );

        try{

            const response =

            await deleteService(

                selectedService.id

            );

            toast.success(

                response.message ||

                "Service deleted successfully."

            );

            setMyServices(

                previousServices=>

                    previousServices.filter(

                        service=>

                            service.id !==

                            selectedService.id

                    )

            );

            await refreshWorkspace?.();

            setDeleteModalOpen(

                false

            );

            setSelectedService(

                null

            );

        }

        catch(error){

            toast.error(

                error.response?.data?.message ||

                "Failed to delete service."

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

                        Manage Services

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

                        myServices.length===0 &&

                        otherServices.length===0

                        ?

                        (

                            <p

                                className="

                                    py-12

                                    text-center

                                    text-[var(--text-secondary)]

                                "

                            >

                                No services found.

                            </p>

                        )

                        :

                        <>

                            {/* MY SERVICES */}

                            {

                                myServices.length>0

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

                                        My Services

                                    </h3>

                                    {

                                        myServices.map(

                                            service=>(

                                                <div

                                                    key={service.id}

                                                    className="

                                                        mx-auto

                                                        mb-4

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

                                                                service.service_name

                                                            }

                                                        </h3>

                                                    </div>

                                                    <div

                                                        className="

                                                            flex

                                                            gap-3

                                                        "

                                                    >

                                                        <button

                                                            onClick={()=>{

                                                                openRenameModal(

                                                                    service

                                                                );

                                                            }}

                                                            className="

                                                                rounded-xl

                                                                bg-cyan-500/15

                                                                p-3

                                                                text-cyan-400

                                                                transition

                                                                hover:bg-cyan-500/25

                                                            "

                                                        >

                                                            <Pencil

                                                                size={18}

                                                            />

                                                        </button>

                                                        <button

                                                            onClick={()=>{

                                                                openDeleteModal(

                                                                    service

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

                                                </div>

                                            )

                                        )

                                    }

                                </>
}
                                                            {/* OTHER SERVICES */}

                            {

                                otherServices.length>0

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

                                        Other Services

                                    </h3>

                                    {

                                        otherServices.map(

                                            service=>(

                                                <div

                                                    key={service.id}

                                                    className="

                                                        mx-auto

                                                        mb-4

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

                                                                service.service_name

                                                            }

                                                        </h3>

                                                    </div>

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

        <InputModal

            isOpen={renameModalOpen}

            title="Rename Service"

            label="Service Name"

            placeholder="Enter service name"

            defaultValue={

                selectedService?.service_name || ""

            }

            confirmText="Save"

            loading={actionLoading}

            onConfirm={handleRename}

            onCancel={()=>{

                setRenameModalOpen(false);

                setSelectedService(null);

            }}

        />

        <ConfirmationModal

            isOpen={deleteModalOpen}

            title="Delete Service"

            message={`Are you sure you want to delete "${selectedService?.service_name}"? This action cannot be undone.`}

            confirmText="Delete"

            confirmColor="red"

            loading={actionLoading}

            onConfirm={handleDelete}

            onCancel={()=>{

                setDeleteModalOpen(false);

                setSelectedService(null);

            }}

        />

    </>

);

}

export default ManageServicesModal;
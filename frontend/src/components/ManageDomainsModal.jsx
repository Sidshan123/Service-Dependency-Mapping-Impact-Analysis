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

    getDomains,
    updateDomainName,
    deleteDomain

}
from "../services/workspaceService";

function ManageDomainsModal({

    workspaceId,
    refreshWorkspace,
    roles,
    onClose

}){

    const [

        domains,
        setDomains

    ] = useState({

        my_domains:[],

        other_domains:[]

    });

    const [

        loading,
        setLoading

    ] = useState(true);

    const [

        selectedDomain,
        setSelectedDomain

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
    // FETCH DOMAINS
    //--------------------------------------------------

    useEffect(

        ()=>{

            fetchDomains();

        },

        []

    );

    async function fetchDomains(){

        try{

            const data =

            await getDomains(

                workspaceId

            );

            setDomains(

                data

            );

        }

        catch(error){

            toast.error(

                error.response?.data?.message ||

                "Failed to fetch domains."

            );

            onClose();

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

    function handleEdit(

        domain

    ){

        setSelectedDomain(

            domain

        );

        setRenameModalOpen(

            true

        );

    }

    //--------------------------------------------------
    // SAVE DOMAIN NAME
    //--------------------------------------------------

    async function handleRename(

        newName

    ){

        if(

            !selectedDomain

        ){

            return;

        }

        setActionLoading(

            true

        );

        try{

            const response =

            await updateDomainName(

                selectedDomain.id,

                newName

            );

            toast.success(

                response.message ||

                "Domain updated successfully."

            );

            setRenameModalOpen(

                false

            );

            setSelectedDomain(

                null

            );

            await fetchDomains();

            await refreshWorkspace?.();

        }

        catch(error){

            toast.error(

                error.response?.data?.message ||

                "Failed to update domain."

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

        domain

    ){

        setSelectedDomain(

            domain

        );

        setDeleteModalOpen(

            true

        );

    }

    //--------------------------------------------------
    // DELETE DOMAIN
    //--------------------------------------------------

    async function handleDelete(){

        if(

            !selectedDomain

        ){

            return;

        }

        setActionLoading(

            true

        );

        try{

            const response =

            await deleteDomain(

                selectedDomain.id

            );

            toast.success(

                response.message ||

                "Domain deleted successfully."

            );

            setDomains(

                previousDomains => ({

                    ...previousDomains,

                    my_domains:

                        previousDomains.my_domains.filter(

                            domain =>

                                domain.id !==

                                selectedDomain.id

                        )

                })

            );

            setDeleteModalOpen(

                false

            );

            setSelectedDomain(

                null

            );

            await refreshWorkspace?.();

        }

        catch(error){

            toast.error(

                error.response?.data?.message ||

                "Failed to delete domain."

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

                z-40

                flex
                items-center
                justify-center

                bg-black/60

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

                        Manage Domains

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

                {

                    loading

                    ?

                    (

                        <div

                            className="

                                py-20

                                text-center

                                text-[var(--text-secondary)]

                            "

                        >

                            Loading domains...

                        </div>

                    )

                    :

                    (

                        <div

                            className="

                                mt-8

                                space-y-8

                            "

                        >

                            {/* MY DOMAINS */}

                            <div>

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

                                    My Domains

                                </h3>

                                {

                                    domains.my_domains.map(

                                        domain=>(

                                            <div

                                                key={domain.id}

                                                className="

                                                    mx-auto
                                                    mb-4
                                                    max-w-[550px]

                                                    rounded-2xl

                                                    border
                                                    border-[var(--border)]

                                                    bg-[var(--bg-primary)]

                                                    px-6
                                                    py-5

                                                    flex
                                                    items-center
                                                    justify-between

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

                                                            domain.domain_name

                                                        }

                                                    </h3>

                                                    <p

                                                        className="

                                                            mt-1

                                                            text-sm

                                                            text-[var(--text-secondary)]

                                                        "

                                                    >

                                                        Lead:

                                                        {" "}

                                                        {

                                                            domain.lead_name

                                                        }

                                                    </p>

                                                </div>

                                                <div

                                                    className="

                                                        flex
                                                        items-center
                                                        gap-3

                                                    "

                                                >

                                                    <button

                                                        onClick={()=>{

                                                            handleEdit(

                                                                domain

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

                                                                domain

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

                            </div>
                                                        {/* OTHER DOMAINS */}

                            <div>

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

                                    Other Domains

                                </h3>

                                {

                                    domains.other_domains.map(

                                        domain=>(

                                            <div

                                                key={domain.id}

                                                className="

                                                    mx-auto
                                                    mb-4
                                                    max-w-[550px]

                                                    rounded-2xl

                                                    border
                                                    border-[var(--border)]

                                                    bg-[var(--bg-primary)]

                                                    px-6
                                                    py-5

                                                    flex
                                                    items-center
                                                    justify-between

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

                                                            domain.domain_name

                                                        }

                                                    </h3>

                                                    <p

                                                        className="

                                                            mt-1

                                                            text-sm

                                                            text-[var(--text-secondary)]

                                                        "

                                                    >

                                                        Lead:

                                                        {" "}

                                                        {

                                                            domain.lead_name

                                                        }

                                                    </p>

                                                </div>

                                            </div>

                                        )

                                    )

                                }

                            </div>

                        </div>

                    )

                }

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

        {/* Rename Domain */}

        <InputModal

            isOpen={renameModalOpen}

            title="Rename Domain"

            label="Domain Name"

            placeholder="Enter domain name"

            defaultValue={

                selectedDomain?.domain_name || ""

            }

            confirmText="Save"

            loading={actionLoading}

            onConfirm={handleRename}

            onCancel={()=>{

                setRenameModalOpen(false);

                setSelectedDomain(null);

            }}

        />

        {/* Delete Domain */}

        <ConfirmationModal

            isOpen={deleteModalOpen}

            title="Delete Domain"

            message={`Are you sure you want to delete "${selectedDomain?.domain_name}"? This action cannot be undone.`}

            confirmText="Delete"

            confirmColor="red"

            loading={actionLoading}

            onConfirm={handleDelete}

            onCancel={()=>{

                setDeleteModalOpen(false);

                setSelectedDomain(null);

            }}

        />

    </>

);

}

export default ManageDomainsModal;
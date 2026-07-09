import {

    useEffect,
    useState

}
from "react";

import toast from "react-hot-toast";

import {

    X

}
from "lucide-react";

import {

    getWorkspaceServices,
    createDependency

}
from "../services/workspaceService";


function CreateDependencyModal({

    workspaceId,
    refreshWorkspace,
    onClose

}){

    const [

        services,
        setServices

    ] = useState([]);

    const [

        sourceServiceId,
        setSourceServiceId

    ] = useState("");

    const [

        targetServiceId,
        setTargetServiceId

    ] = useState("");

    const [

        creating,
        setCreating

    ] = useState(false);


    useEffect(()=>{

        loadServices();

    },[]);


    async function loadServices(){

        try{

            const response =
            await getWorkspaceServices(
                workspaceId
            );

            setServices([

                ...response.my_services,

                ...response.other_services

            ]);

        }

        catch(error){

            console.error(error);

            toast.error(

            error.response?.data?.message ||

            "Failed to load domains."

        );

        }

    }


    async function handleCreateDependency(){

        if(

            !sourceServiceId ||

            !targetServiceId

        ){

            toast.success(

                "Please select both services"

            );

            return;

        }


        if(

            sourceServiceId ===
            targetServiceId

        ){

            toast.success(

                "Source and Target services cannot be the same"

            );

            return;

        }


        try{

            setCreating(true);

            const response =
            await createDependency({

                workspace_id:
                Number(workspaceId),

                source_service_id:
                Number(sourceServiceId),

                target_service_id:
                Number(targetServiceId)

            });

            toast.success(

                response.message ||

                "Dependency created successfully."

            );

            await refreshWorkspace();

            onClose();

        }

        catch(error){

            console.error(error);

            toast.error(

                error.response?.data?.message || error.message ||

                "Failed to create dependency."

            );

        }

        finally{

            setCreating(false);

        }

    }


    return(

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

                    w-[520px]

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

                        Create Dependency

                    </h2>

                    <button

                        onClick={onClose}

                        className="

                            p-2

                            rounded-lg

                            hover:bg-zinc-800

                        "

                    >

                        <X size={20}/>

                    </button>

                </div>


                {/* FORM */}

                <div

                    className="

                        mt-8
                        space-y-6

                    "

                >

                    <div>

                        <label

                            className="text-sm"

                        >

                            Source Service

                        </label>

                        <select

                            value={sourceServiceId}

                            onChange={event=>{

                                setSourceServiceId(

                                    event.target.value

                                );

                            }}

                            className="

                                mt-2

                                w-full

                                px-4
                                py-3

                                rounded-xl

                                bg-[var(--bg-primary)]

                                border
                                border-[var(--border)]

                                outline-none

                            "

                        >

                            <option value="">

                                Select Source Service

                            </option>

                            {

                                services.map(

                                    service=>(

                                        <option

                                            key={service.id}

                                            value={service.id}

                                        >

                                            {

                                                service.service_name

                                            }

                                        </option>

                                    )

                                )

                            }

                        </select>

                    </div>
                                        <div>

                        <label

                            className="text-sm"

                        >

                            Target Service

                        </label>

                        <select

                            value={targetServiceId}

                            onChange={event=>{

                                setTargetServiceId(

                                    event.target.value

                                );

                            }}

                            className="

                                mt-2

                                w-full

                                px-4
                                py-3

                                rounded-xl

                                bg-[var(--bg-primary)]

                                border
                                border-[var(--border)]

                                outline-none

                            "

                        >

                            <option value="">

                                Select Target Service

                            </option>

                            {

                                services.map(

                                    service=>(

                                        <option

                                            key={service.id}

                                            value={service.id}

                                        >

                                            {

                                                service.service_name

                                            }

                                        </option>

                                    )

                                )

                            }

                        </select>

                    </div>

                </div>


                <button

                    onClick={

                        handleCreateDependency

                    }

                    disabled={creating}

                    className="

                        btn-primary

                        mt-8

                        w-full

                        py-3

                        rounded-xl

                        flex
                        items-center
                        justify-center
                        gap-2

                        disabled:opacity-60
                        disabled:cursor-not-allowed

                    "

                >

                    {

                        creating

                        ?

                        <>

                            <svg

                                className="

                                    h-5
                                    w-5

                                    animate-spin

                                "

                                xmlns="http://www.w3.org/2000/svg"

                                fill="none"

                                viewBox="0 0 24 24"

                            >

                                <circle

                                    className="opacity-25"

                                    cx="12"

                                    cy="12"

                                    r="10"

                                    stroke="currentColor"

                                    strokeWidth="4"

                                />

                                <path

                                    className="opacity-75"

                                    fill="currentColor"

                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"

                                />

                            </svg>

                            Creating...

                        </>

                        :

                        "Create Dependency"

                    }

                </button>

            </div>

        </div>

    );

}

export default CreateDependencyModal;
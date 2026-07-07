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

import {

    getWorkspaceServices,
    updateServiceName

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

            console.error(error);

            alert(
                "Failed to load services."
            );

        }

        finally{

            setLoading(false);

        }

    }


    async function handleEdit(
    service
        ){

            const newName =
            prompt(

                "Enter new service name:",

                service.service_name

            );

            if(

                !newName ||

                newName.trim() === "" ||

                newName === service.service_name

            ){

                return;

            }

            try{

                const response =
                await updateServiceName(

                    service.id,

                    newName.trim()

                );

                alert(

                    response.message ||

                    "Service updated successfully."

                );

                if(refreshWorkspace){

                    await refreshWorkspace();

                }
                onClose();

            }

            catch(error){

                alert(

                    error.response?.data?.message ||

                    "Failed to update service."

                );

            }

        }


    function handleDelete(
        id
    ){

        alert(
            `Delete ${id} coming soon!`
        );

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

                            p-2
                            rounded-lg

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

                            loading ?

                            (

                                <p>

                                    Loading...

                                </p>

                            )

                            :

                            myServices.length===0 &&

                            otherServices.length===0 ?

                            (

                                <p>

                                    No services found.

                                </p>

                            )

                            :

                            <>

                                {/* MY SERVICES */}

                                {

                                    myServices.length>0 &&

                                    <>

                                        <h3

                                            className="

                                                max-w-[550px]
                                                mx-auto

                                                mb-3

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

                                                            max-w-[550px]
                                                            mx-auto

                                                            rounded-2xl

                                                            border
                                                            border-[var(--border)]

                                                            bg-[var(--bg-primary)]

                                                            px-6
                                                            py-5

                                                            mb-4

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

                                                                    service
                                                                    .service_name

                                                                }

                                                            </h3>

                                                            <p

                                                                className="

                                                                    text-sm

                                                                    text-[var(--text-secondary)]

                                                                "

                                                            >

                                                                

                                                            </p>

                                                        </div>

                                                        <div

                                                            className="

                                                                flex
                                                                gap-3

                                                            "

                                                        >

                                                            <button

                                                                onClick={()=>{

                                                                    handleEdit(

                                                                        service

                                                                    );

                                                                }}

                                                                className="

                                                                    p-3

                                                                    rounded-xl

                                                                    bg-cyan-500/15

                                                                    text-cyan-400

                                                                    hover:bg-cyan-500/25

                                                                "

                                                            >

                                                                <Pencil
                                                                    size={18}
                                                                />

                                                            </button>

                                                            <button

                                                                onClick={()=>{

                                                                    handleDelete(

                                                                        service.id

                                                                    );

                                                                }}

                                                                className="

                                                                    p-3

                                                                    rounded-xl

                                                                    bg-red-500/15

                                                                    text-red-400

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

                                    otherServices.length>0 &&

                                    <>

                                        <h3

                                            className="

                                                max-w-[550px]
                                                mx-auto

                                                mt-6
                                                mb-3

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

                                                            max-w-[550px]
                                                            mx-auto

                                                            rounded-2xl

                                                            border
                                                            border-[var(--border)]

                                                            bg-[var(--bg-primary)]

                                                            px-6
                                                            py-5

                                                            mb-4

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

                                                                    service
                                                                    .service_name

                                                                }

                                                            </h3>

                                                            <p

                                                                className="

                                                                    text-sm

                                                                    text-[var(--text-secondary)]

                                                                "

                                                            >

                                                            </p>

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

                        py-3

                        rounded-xl

                        border
                        border-[var(--border)]

                        hover:bg-zinc-800

                    "

                >

                    Close

                </button>

            </div>

        </div>

    );

}

export default ManageServicesModal;
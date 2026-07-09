import {

    useEffect,
    useState

}
from "react";

import {

    X,
    Copy,
    Check

}
from "lucide-react";

import {

    getDeveloperInviteCodes

}
from "../services/workspaceService";

import toast from "react-hot-toast";


function InviteDeveloperModal({

    workspaceId,
    onClose

}){
    console.log("workspaceId:", workspaceId);

    const [

        inviteCodes,
        setInviteCodes

    ] = useState([]);


    const [

        loading,
        setLoading

    ] = useState(true);


    const [

        copiedCode,
        setCopiedCode

    ] = useState(null);


    useEffect(

        ()=>{

            fetchInviteCodes();

        },

        []

    );


    async function fetchInviteCodes(){

        try{

            const data =
            await getDeveloperInviteCodes(

                workspaceId

            );

            setInviteCodes(

                data

            );

        }

        catch(error){

            toast.error(

                error.response?.data?.message

                ||

                "Failed to fetch invite codes"

            );

            onClose();

        }

        finally{

            setLoading(false);

        }

    }


    async function handleCopy(

        inviteCode

    ){

        await navigator
        .clipboard
        .writeText(
            inviteCode
        );

        setCopiedCode(
            inviteCode
        );

        setTimeout(

            ()=>{

                setCopiedCode(
                    null
                );

            },

            2000

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

                    w-[650px]
                    max-h-[80vh]

                    overflow-y-auto

                    rounded-3xl

                    border
                    border-[var(--border)]

                    bg-[var(--card-bg)]

                    p-8

                "

            >

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

                        Invite Developers

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

                <p

                    className="

                        mt-4

                        text-sm

                        text-[var(--text-secondary)]

                    "

                >

                    Share the invite code for the required domain with developers.

                </p>

                {

                    loading

                    ?

                    (

                        <div

                            className="

                                py-20

                                text-center

                            "

                        >

                            Loading invite codes...

                        </div>

                    )

                    :

                    (

                        <div

                            className="

                                mt-8

                                space-y-4

                            "

                        >

                            {

                                inviteCodes.map(

                                    invite=>(

                                        <div

                                            key={

                                                invite.domain_id

                                            }

                                            className="

                                            rounded-2xl

                                            border
                                            border-[var(--border)]

                                            bg-[var(--bg-primary)]

                                            px-6
                                            py-4

                                            flex
                                            items-center
                                            justify-between

                                        "

                                        >

                                            <div

                                                className="

                                                    space-y-2

                                                "

                                            >

                                                <h3

                                                    className="

                                                        text-xl
                                                        font-semibold

                                                    "

                                                >

                                                    {

                                                        invite.domain_name

                                                    }

                                                </h3>

                                                <p

                                                    className="

                                                        text-3xl

                                                        font-bold

                                                        tracking-[0.25em]

                                                    "

                                                >

                                                    {

                                                        invite.invite_code

                                                    }

                                                </p>

                                            </div>

                                            <button

                                                onClick={()=>{

                                                    handleCopy(

                                                        invite.invite_code

                                                    );

                                                }}

                                                className="

                                                    w-[120px]
                                                    h-12

                                                    rounded-xl

                                                    bg-cyan-600

                                                    hover:bg-cyan-500

                                                    text-white

                                                    flex
                                                    items-center
                                                    justify-center
                                                    gap-2

                                                    transition

                                                    shrink-0

                                                "

                                            >

                                                {

                                                    copiedCode ===

                                                    invite.invite_code

                                                    ?

                                                    <Check
                                                        size={18}
                                                    />

                                                    :

                                                    <Copy
                                                        size={18}
                                                    />

                                                }

                                                {

                                                    copiedCode ===

                                                    invite.invite_code

                                                    ?

                                                    "Copied"

                                                    :

                                                    "Copy"

                                                }

                                            </button>

                                        </div>

                                    )

                                )

                            }

                            {

                                inviteCodes.length === 0 && (

                                    <div

                                        className="

                                            py-12

                                            text-center

                                            text-[var(--text-secondary)]

                                        "

                                    >

                                        No invite codes found.

                                    </div>

                                )

                            }

                        </div>

                    )

                }

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

                        transition

                    "

                >

                    Close

                </button>

            </div>

        </div>

    );

}

export default InviteDeveloperModal;
import { useEffect, useState } from "react";

import {

    Copy,
    X,
    Check

}
from "lucide-react";

import {

    getLeadInviteCode

}
from "../services/workspaceService";


function InviteLeadModal({

    workspaceId,
    onClose

}){
    console.log(
    "Invite Modal workspaceId:",
    workspaceId
);

    const [

        inviteCode,
        setInviteCode

    ] = useState("");


    const [

        loading,
        setLoading

    ] = useState(true);


    const [

        copied,
        setCopied

    ] = useState(false);


    useEffect(

        ()=>{

            fetchInviteCode();

        },

        []

    );


    async function fetchInviteCode(){

        try{

            const data =

            await getLeadInviteCode(
                workspaceId
            );

            setInviteCode(
                data.invite_code
            );

        }
        catch(error){

            alert(

                error.response
                ?.data
                ?.message

                ||

                "Failed to fetch invite code"

            );

            onClose();

        }
        finally{

            setLoading(false);

        }

    }


    async function handleCopy(){

        await navigator
        .clipboard
        .writeText(inviteCode);

        setCopied(true);

        setTimeout(

            ()=>{

                setCopied(false);

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

                    w-[450px]

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

                        Invite Domain Lead

                    </h2>


                    <button

                        onClick={onClose}

                        className="

                            p-2

                            rounded-lg

                            hover:bg-zinc-800

                            transition

                        "

                    >

                        <X size={20}/>

                    </button>

                </div>


                {/* CONTENT */}

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

                            Loading invite code...

                        </div>

                    )

                    :

                    (

                        <>

                            <p
                                className="

                                    mt-6

                                    text-sm

                                    text-[var(--text-secondary)]

                                "
                            >

                                Share this code with the
                                Domain Lead.

                            </p>


                            <div
                                className="

                                    mt-6

                                    flex
                                    items-center
                                    justify-between

                                    rounded-2xl

                                    border
                                    border-[var(--border)]

                                    bg-[var(--bg-primary)]

                                    px-5
                                    py-4

                                "
                            >

                                <span
                                    className="

                                        text-3xl
                                        font-bold
                                        tracking-[0.3em]

                                    "
                                >

                                    {inviteCode}

                                </span>


                                <button

                                    onClick={
                                        handleCopy
                                    }

                                    className="

                                        flex
                                        items-center
                                        gap-2

                                        px-4
                                        py-2

                                        rounded-xl

                                        bg-cyan-600

                                        hover:bg-cyan-500

                                        transition

                                    "

                                >

                                    {

                                        copied

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

                                        copied

                                        ?

                                        "Copied"

                                        :

                                        "Copy"

                                    }

                                </button>

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

                                    transition

                                "

                            >

                                Close

                            </button>

                        </>

                    )

                }

            </div>

        </div>

    );

}


export default InviteLeadModal;
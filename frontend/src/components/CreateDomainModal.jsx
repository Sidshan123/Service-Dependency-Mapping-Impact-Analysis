import { useState } from "react";

import {
    X,
    Copy,
    Check
}
from "lucide-react";

import {
    joinAsLead
}
from "../services/workspaceService";


import toast from "react-hot-toast";

function CreateDomainModal({

    workspace,
    workspaceId,
    onClose

}){

    const [

        domainName,
        setDomainName

    ] = useState("");

    const [

        inviteCode,
        setInviteCode

    ] = useState("");

    const [

        loading,
        setLoading

    ] = useState(false);

    const [

        developerInviteCode,
        setDeveloperInviteCode

    ] = useState(null);

    const [

        copied,
        setCopied

    ] = useState(false);

    const isPersonal =
        workspace.workspace_type ===
        "PERSONAL";

    async function handleCreateDomain(){

        try{

            setLoading(true);

            const response =
            await joinAsLead(

                workspaceId,

                domainName,

                isPersonal
                    ? null
                    : inviteCode

            );

            if(

                response.message ===
                "Domain created successfully"

            ){

                if(isPersonal){

                    toast.success(
                        "Domain created successfully"
                    );

                    window.location.reload();

                    return;

                }

                setDeveloperInviteCode(

                    response.developer_invite_code

                );

                return;

            }

            toast.success(
                response.message
            );

        }
        catch(error){

            toast.error(

                error.response?.data?.message || error.message ||

                "Failed to create domain"

            );

        }
        finally{

            setLoading(false);

        }

    }

    async function handleCopy(){

        await navigator.clipboard.writeText(
            developerInviteCode
        );

        setCopied(true);

        setTimeout(()=>{

            setCopied(false);

        },2000);

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
                    w-[500px]
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
                        Create Domain
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

                {

                    !developerInviteCode

                    ?

                    (

                        <>

                            <div className="mt-8">

                                <label className="text-sm">
                                    Domain Name
                                </label>

                                <input
                                    value={domainName}
                                    onChange={event=>
                                        setDomainName(
                                            event.target.value
                                        )
                                    }
                                    className="
                                        mt-2
                                        w-full
                                        rounded-xl
                                        border
                                        border-[var(--border)]
                                        bg-[var(--bg-primary)]
                                        px-4
                                        py-3
                                        outline-none
                                    "
                                />

                            </div>

                            {

                                !isPersonal && (

                                    <div className="mt-6">

                                        <label className="text-sm">
                                            Lead Invite Code
                                        </label>

                                        <input
                                            value={inviteCode}
                                            onChange={event=>
                                                setInviteCode(
                                                    event.target.value
                                                )
                                            }
                                            className="
                                                mt-2
                                                w-full
                                                rounded-xl
                                                border
                                                border-[var(--border)]
                                                bg-[var(--bg-primary)]
                                                px-4
                                                py-3
                                                outline-none
                                            "
                                        />

                                    </div>

                                )

                            }

                            <button
                                onClick={handleCreateDomain}
                                disabled={loading}
                                className="
                                    mt-8
                                    w-full
                                    py-3
                                    rounded-xl
                                    bg-cyan-600
                                    hover:bg-cyan-500
                                    disabled:opacity-50
                                "
                            >

                                {

                                    loading

                                    ?

                                    "Creating..."

                                    :

                                    "Create Domain"

                                }

                            </button>

                        </>

                    )

                    :

                    (

                        <>

                            <p
                                className="
                                    mt-8
                                    text-center
                                    text-[var(--text-secondary)]
                                "
                            >
                                Domain created successfully.
                                Share this code with developers.
                            </p>

                            <div
                                className="
                                    mt-8
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
                                    {developerInviteCode}
                                </span>

                                <button
                                    onClick={handleCopy}
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        px-4
                                        py-2
                                        rounded-xl
                                        bg-cyan-600
                                        hover:bg-cyan-500
                                    "
                                >

                                    {

                                        copied

                                        ?

                                        <Check size={18}/>

                                        :

                                        <Copy size={18}/>

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
                                onClick={()=>{
                                    window.location.reload();
                                }}
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

                        </>

                    )

                }

            </div>

        </div>

    );

}

export default CreateDomainModal;
import { useState } from "react";

import {

    joinAsLead,
    joinAsDeveloper

}
from "../services/workspaceService";

import toast from "react-hot-toast";

function JoinWorkspaceCards({

    workspaceId

}){
    console.log(workspaceId);

    const [

        domainName,
        setDomainName

    ] = useState("");

    const [

        leadCode,
        setLeadCode

    ] = useState("");

    const [

        developerCode,
        setDeveloperCode

    ] = useState("");

    const [

        loading,
        setLoading

    ] = useState(false);


    async function handleLeadJoin(){

        try{

            setLoading(true);

            await joinAsLead(

                workspaceId,
                domainName,
                leadCode

            );

            window.location.reload();

        }
        catch(error){


    toast.error(

        error.response?.data?.message
        ||

        "Failed to join as lead"

    );

}
        finally{

            setLoading(false);

        }

    }


    async function handleDeveloperJoin(){

        try{

            setLoading(true);

            await joinAsDeveloper(

                workspaceId,
                developerCode

            );

            window.location.reload();

        }
        catch(error){

            toast.error(

                error.response?.data?.message
                ||

                "Failed to join as developer"

            );

        }
        finally{

            setLoading(false);

        }

    }


    return(

        <div
            className="min-h-screen flex items-center justify-center px-6"
        >

            <div
                className="w-full max-w-6xl rounded-3xl border border-[var(--border)] bg-[var(--card-bg)] p-8"
            >

                <div
                    className="grid grid-cols-3 gap-6"
                >

                    {/* LEFT CARD */}

                    <div
                        className="flex flex-col justify-center items-center text-center space-y-6"
                    >

                        <div
                            className="w-20 h-20 rounded-full bg-[var(--bg-primary)] flex items-center justify-center text-3xl"
                        >

                            🔒

                        </div>

                        <h1
                            className="text-4xl font-bold"
                        >

                            You are not a member
                            <br/>
                            of this workspace

                        </h1>

                        <p
                            className="text-[var(--text-secondary)]"
                        >

                            Join this workspace to collaborate
                            with your team and manage dependencies.

                        </p>

                    </div>


                    {/* JOIN AS LEAD */}

                    <div
                        className="rounded-2xl border border-[var(--border)] p-6 space-y-4"
                    >

                        <h2
                            className="text-2xl font-semibold"
                        >

                            Join as Domain Lead

                        </h2>

                        <p
                            className="text-sm text-[var(--text-secondary)]"
                        >

                            Leads can manage domains,
                            services and developers.

                        </p>


                        <input

                            value={domainName}

                            onChange={(event)=>{

                                setDomainName(
                                    event.target.value
                                );

                            }}

                            placeholder="Enter domain name"

                            className="

                                w-full
                                rounded-xl
                                border
                                border-[var(--border)]
                                bg-[var(--bg-primary)]
                                px-4
                                py-3
                                outline-none
                                focus:border-[var(--accent-primary)]

                            "

                        />


                        <input

                            value={leadCode}

                            onChange={(event)=>{

                                setLeadCode(
                                    event.target.value
                                );

                            }}

                            placeholder="Enter invite code"

                            className="

                                w-full
                                rounded-xl
                                border
                                border-[var(--border)]
                                bg-[var(--bg-primary)]
                                px-4
                                py-3
                                outline-none
                                focus:border-[var(--accent-primary)]

                            "

                        />


                        <button

                            onClick={handleLeadJoin}

                            disabled={loading}

                            className="

                                btn-primary
                                w-full
                                py-3
                                rounded-xl
                                font-medium

                            "

                        >

                            Join as Domain Lead

                        </button>

                    </div>


                    {/* JOIN AS DEVELOPER */}

                    <div
                        className="rounded-2xl border border-[var(--border)] p-6 space-y-4"
                    >

                        <h2
                            className="text-2xl font-semibold"
                        >

                            Join as Developer

                        </h2>

                        <p
                            className="text-sm text-[var(--text-secondary)]"
                        >

                            Developers can view services
                            and dependencies.

                        </p>


                        <input

                            value={developerCode}

                            onChange={(event)=>{

                                setDeveloperCode(
                                    event.target.value
                                );

                            }}

                            placeholder="Enter invite code"

                            className="

                                w-full
                                rounded-xl
                                border
                                border-[var(--border)]
                                bg-[var(--bg-primary)]
                                px-4
                                py-3
                                outline-none
                                focus:border-[var(--accent-primary)]

                            "

                        />


                        <button

                            onClick={handleDeveloperJoin}

                            disabled={loading}

                            className="

                                btn-primary
                                w-full
                                py-3
                                rounded-xl
                                font-medium

                            "

                        >

                            Join as Developer

                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default JoinWorkspaceCards;
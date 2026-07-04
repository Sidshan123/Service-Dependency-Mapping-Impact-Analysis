import {

    Ellipsis,
    Copy,
    Trash2,
    LogOut

}
from "lucide-react";

function MoreActionsDropdown(){

    return(

        <div
            className="relative group"
        >

            <button

                className="

                    h-16
                    w-16

                    rounded-xl

                    border
                    border-[var(--border)]

                    bg-[var(--card-bg)]

                    flex
                    items-center
                    justify-center

                    hover:border-cyan-500

                    transition

                "

            >

                <Ellipsis
                    size={22}
                />

            </button>


            <div

                className="

                    absolute
                    right-0
                    top-20

                    w-60

                    rounded-xl

                    border
                    border-[var(--border)]

                    bg-[var(--card-bg)]

                    p-2

                    opacity-0
                    invisible

                    group-hover:opacity-100
                    group-hover:visible

                    transition-all

                    z-50

                "

            >

                <button

                    className="

                        w-full

                        flex
                        items-center
                        gap-3

                        px-4
                        py-3

                        rounded-lg

                        hover:bg-zinc-800

                    "

                >

                    <Copy size={16}/>

                    Clone Workspace

                </button>


                <button

                    className="

                        w-full

                        flex
                        items-center
                        gap-3

                        px-4
                        py-3

                        rounded-lg

                        text-red-500

                        hover:bg-red-950/40

                    "

                >

                    <Trash2 size={16}/>

                    Delete Workspace

                </button>


                <button

                    className="

                        w-full

                        flex
                        items-center
                        gap-3

                        px-4
                        py-3

                        rounded-lg

                        hover:bg-zinc-800

                    "

                >

                    <LogOut size={16}/>

                    Exit Workspace

                </button>

            </div>

        </div>

    );

}

export default MoreActionsDropdown;
import {

    TriangleAlert

}
from "lucide-react";

function ConfirmationModal({

    isOpen,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    confirmColor = "red",
    loading = false,
    onConfirm,
    onCancel

}){

    if(!isOpen){

        return null;

    }

    const buttonStyles = {

        red:
        "bg-red-600 hover:bg-red-700",

        cyan:
        "bg-cyan-600 hover:bg-cyan-700",

        green:
        "bg-green-600 hover:bg-green-700"

    };

    return(

        <div

            className="

                fixed
                inset-0
                z-50

                flex
                items-center
                justify-center

                bg-black/60
                backdrop-blur-sm

            "

        >

            <div

                className="

                    w-full
                    max-w-md

                    rounded-3xl

                    border
                    border-[var(--border)]

                    bg-[var(--card-bg)]

                    p-8

                    shadow-2xl

                "

            >

                <div

                    className="

                        mx-auto

                        flex
                        h-16
                        w-16

                        items-center
                        justify-center

                        rounded-full

                        bg-red-500/10

                    "

                >

                    <TriangleAlert

                        size={34}

                        className="text-red-400"

                    />

                </div>

                <h2

                    className="

                        mt-5

                        text-center

                        text-2xl

                        font-bold

                    "

                >

                    {title}

                </h2>

                <p

                    className="

                        mt-3

                        text-center

                        text-sm

                        leading-6

                        text-[var(--text-secondary)]

                    "

                >

                    {message}

                </p>

                <div

                    className="

                        mt-8

                        flex

                        justify-end

                        gap-3

                    "

                >

                    <button

                        onClick={onCancel}

                        disabled={loading}

                        className="

                            rounded-xl

                            border
                            border-[var(--border)]

                            px-5
                            py-2.5

                            transition

                            hover:bg-zinc-800

                            disabled:opacity-50

                        "

                    >

                        {cancelText}

                    </button>

                    <button

                        onClick={onConfirm}

                        disabled={loading}

                        className={`

                            rounded-xl

                            px-5
                            py-2.5

                            font-medium

                            text-white

                            transition

                            disabled:opacity-50

                            ${

                                buttonStyles[confirmColor]

                            }

                        `}

                    >

                        {

                            loading

                            ?

                            "Please wait..."

                            :

                            confirmText

                        }

                    </button>

                </div>

            </div>

        </div>

    );

}

export default ConfirmationModal;
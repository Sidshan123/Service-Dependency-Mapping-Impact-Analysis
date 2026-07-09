import { useState } from "react";

import {
    Link,
    useNavigate
}
from "react-router-dom";

import toast from "react-hot-toast";

import api
from "../services/api";

function Register() {

    const navigate =
    useNavigate();

    const [formData, setFormData] =
    useState({

        name: "",
        email: "",
        password: ""

    });

    const [loading, setLoading] =
    useState(false);

    const handleChange =
    (event) => {

        setFormData({

            ...formData,

            [event.target.name]:
            event.target.value

        });

    };

    const handleSubmit =
    async (event) => {

        event.preventDefault();

        try {

            setLoading(true);

            await api.post(

                "/auth/register",

                formData

            );

            navigate(

                "/",

                {

                    state: {

                        message:
                        "Registration successful. Please login."

                    }

                }

            );

        }
        catch (error) {

            toast.error(

                error.response?.data?.message ||

                "Registration Failed"

            );

        }
        finally {

            setLoading(false);

        }

    };

    return (

        <div
        className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-[var(--bg-primary)]
        p-6
        "
        >

            <div
            className="
            w-full
            max-w-6xl
            h-[720px]
            bg-[var(--card-bg)]
            border
            border-[var(--border)]
            rounded-3xl
            overflow-hidden
            grid
            grid-cols-5
            shadow-2xl
            "
            >

            {/* LEFT PANEL */}

                <div
                className="
                col-span-2
                flex
                flex-col
                items-center
                justify-center
                px-10
                border-r
                border-[var(--border)]
                "
                >

                    <img

                        src="/logo.jpeg"

                        alt="Blast Radius"

                        className="
                        w-40
                        h-40
                        object-contain
                        mb-6
                        "

                    />

                    <h1
                    className="
                    text-6xl
                    font-semibold
                    tracking-tight
                    text-[var(--text-primary)]
                    "
                    >

                        Blast Radius

                    </h1>

                    <p
                    className="
                    mt-6
                    text-center
                    text-xl
                    font-medium
                    tracking-tight
                    text-[var(--accent-primary)]
                    leading-relaxed
                    max-w-xs
                    "
                    >

                        Understand the Ripple

                        <br />

                        Before It Happens

                    </p>

                    {/* DESCRIPTION */}

                    <div
                    className="
                    mt-12
                    max-w-[340px]
                    "
                    >

                        <p
                        className="
                        text-[14px]
                        leading-8
                        font-normal
                        text-[var(--text-secondary)]
                        text-center
                        "
                        >

                            Blast Radius provides

                            <span
                            className="
                            text-[var(--text-primary)]
                            font-medium
                            "
                            >

                                {" "}
                                role-based workspaces
                                {" "}

                            </span>

                            for managing service dependencies,
                            tracking domains and services, and
                            understanding the percentage of the
                            system affected when a service failure
                            occurs.

                        </p>

                    </div>

                    {/* TECHNICAL CAPABILITIES */}

                    <div
                    className="
                    mt-8
                    w-full
                    max-w-[320px]
                    space-y-4
                    "
                    >

                        <div
                        className="
                        flex
                        items-center
                        gap-3
                        text-sm
                        text-[var(--text-secondary)]
                        "
                        >

                            <span
                            className="
                            text-[var(--accent-primary)]
                            font-mono
                            "
                            >

                                /

                            </span>

                            <span>

                                RBAC Authorization

                            </span>

                        </div>

                        <div
                        className="
                        flex
                        items-center
                        gap-3
                        text-sm
                        text-[var(--text-secondary)]
                        "
                        >

                            <span
                            className="
                            text-[var(--accent-primary)]
                            font-mono
                            "
                            >

                                /

                            </span>

                            <span>

                                Service Dependency Mapping

                            </span>

                        </div>

                        <div
                        className="
                        flex
                        items-center
                        gap-3
                        text-sm
                        text-[var(--text-secondary)]
                        "
                        >

                            <span
                            className="
                            text-[var(--accent-primary)]
                            font-mono
                            "
                            >

                                /

                            </span>

                            <span>

                                Blast Radius Analysis

                            </span>

                        </div>

                    </div>

                    {/* FOOTER */}

                    <p
                    className="
                    mt-12
                    font-mono
                    text-[10px]
                    uppercase
                    tracking-[0.3em]
                    text-[var(--text-secondary)]
                    opacity-70
                    text-center
                    "
                    >

                        Dependency Mapping & Impact Analysis

                    </p>

                </div>

                {/* RIGHT PANEL */}

                <div
                className="
                col-span-3
                flex
                items-center
                justify-center
                "
                >

                    <div
                    className="
                    w-[450px]
                    "
                    >

                        <h2
                        className="
                        text-4xl
                        font-semibold
                        tracking-tight
                        mb-2
                        text-[var(--text-primary)]
                        "
                        >

                            Create Account

                        </h2>

                        <p
                        className="
                        text-[15px]
                        text-[var(--text-secondary)]
                        mb-8
                        "
                        >

                            Join Burst Radius today

                        </p>

                        <form

                            onSubmit={
                                handleSubmit
                            }

                            className="
                            space-y-6
                            "

                        >

                            <div>

                                <label
                                className="
                                block
                                mb-2
                                font-medium
                                text-[var(--text-primary)]
                                "
                                >

                                    Name

                                </label>

                                <input

                                    type="text"

                                    name="name"

                                    value={
                                        formData.name
                                    }

                                    onChange={
                                        handleChange
                                    }

                                    placeholder=
                                    "Enter your name"

                                    required

                                    className="
                                    w-full
                                    px-4
                                    py-3.5
                                    rounded-xl
                                    bg-[var(--bg-secondary)]
                                    border
                                    border-[var(--border)]
                                    outline-none
                                    text-[var(--text-primary)]
                                    placeholder:text-[var(--text-secondary)]
                                    focus:border-[var(--accent-primary)]
                                    transition
                                    "

                                />

                            </div>

                            <div>

                                <label
                                className="
                                block
                                mb-2
                                font-medium
                                text-[var(--text-primary)]
                                "
                                >

                                    Email

                                </label>

                                <input

                                    type="email"

                                    name="email"

                                    value={
                                        formData.email
                                    }

                                    onChange={
                                        handleChange
                                    }

                                    placeholder=
                                    "Enter your email"

                                    required

                                    className="
                                    w-full
                                    px-4
                                    py-3.5
                                    rounded-xl
                                    bg-[var(--bg-secondary)]
                                    border
                                    border-[var(--border)]
                                    outline-none
                                    text-[var(--text-primary)]
                                    placeholder:text-[var(--text-secondary)]
                                    focus:border-[var(--accent-primary)]
                                    transition
                                    "

                                />

                            </div>

                            <div>

                                <label
                                className="
                                block
                                mb-2
                                font-medium
                                text-[var(--text-primary)]
                                "
                                >

                                    Password

                                </label>

                                <input

                                    type="password"

                                    name="password"

                                    value={
                                        formData.password
                                    }

                                    onChange={
                                        handleChange
                                    }

                                    placeholder=
                                    "Enter your password"

                                    required

                                    className="
                                    w-full
                                    px-4
                                    py-3.5
                                    rounded-xl
                                    bg-[var(--bg-secondary)]
                                    border
                                    border-[var(--border)]
                                    outline-none
                                    text-[var(--text-primary)]
                                    placeholder:text-[var(--text-secondary)]
                                    focus:border-[var(--accent-primary)]
                                    transition
                                    "

                                />

                            </div>

                            <button

                                disabled={
                                    loading
                                }

                                className="
                                w-full
                                p-4
                                rounded-xl
                                bg-[var(--accent-primary)]
                                hover:bg-[var(--accent-hover)]
                                text-[var(--text-primary)]
                                font-medium
                                tracking-wide
                                transition-all
                                duration-200
                                cursor-pointer
                                shadow-lg
                                shadow-cyan-500/20
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                                "

                            >

                                {

                                    loading

                                    ?

                                    "Creating Account..."

                                    :

                                    "Sign Up"

                                }

                            </button>

                        </form>

                        <p
                        className="
                        mt-8
                        text-center
                        text-[var(--text-secondary)]
                        "
                        >

                            Already have an account?

                            {" "}

                            <Link

                                to="/"

                                className="
                                text-[var(--accent-primary)]
                                font-medium
                                border-b
                                border-transparent
                                hover:border-[var(--accent-primary)]
                                hover:text-[var(--accent-hover)]
                                transition-all
                                duration-200
                                "

                            >

                                Login

                            </Link>

                        </p>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Register;
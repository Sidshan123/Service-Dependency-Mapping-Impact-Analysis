const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// =========================
// REGISTER
// =========================

async function register(data) {

    const { name, email, password } = data;

    if (!name || !email || !password) {
        throw new Error(
            "Name, email and password are required"
        );
    }

    // Email Validation
    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        throw new Error(
            "Invalid email format"
        );
    }

    // Password Validation
    const passwordRegex =
        /^(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;

    if (!passwordRegex.test(password)) {
        throw new Error(
            "Password must be at least 6 characters and contain at least one special character"
        );
    }

    // Check Existing User
    const existingUser =
        await prisma.users.findUnique({
            where: {
                email
            }
        });

    if (existingUser) {
        throw new Error(
            "Email already registered"
        );
    }

    const hashedPassword =
        await bcrypt.hash(
            password,
            10
        );

    await prisma.users.create({
        data: {
            name,
            email,
            password_hash: hashedPassword
        }
    });

}

// =========================
// LOGIN
// =========================

async function login(data) {

    const { email, password } = data;

    if (!email || !password) {
        throw new Error(
            "Email and password are required"
        );
    }

    const user =
        await prisma.users.findUnique({
            where: {
                email
            }
        });

    if (!user) {
        throw new Error(
            "Invalid email or password"
        );
    }

    const isPasswordValid =
        await bcrypt.compare(
            password,
            user.password_hash
        );

    if (!isPasswordValid) {
        throw new Error(
            "Invalid email or password"
        );
    }

    const token =
        jwt.sign(
            {
                userId: Number(user.id)
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

    return {
        message: "Login successful",
        token
        
    };

}

module.exports = {
    register,
    login
};
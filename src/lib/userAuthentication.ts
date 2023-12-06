import { toast } from 'react-hot-toast';
import isValidEmail from './validateEmail';
import { signIn, signOut } from 'next-auth/react';
import { logEventToDB, getLogs } from './logger'

// try to sign user in with input sanitization and toasts  

export const login = async (e: FormData) => {
    const email = e.get('email')?.toString() || '';
    const password = e.get('password')?.toString() || '';

    if (!isValidEmail(email)) {
        return toast.error('Invalid email!');
    }

    const result = await signIn('credentials', {
        redirect: false,
        email,
        password
    });

    if (result?.error) {
        // Handle error - show an error toast or some other user feedback mechanism
        toast.error("Incorrect email or password please try again.");

        await logEventToDB({
            user: email,
            action: 'Login Attempt',
            success: false,
            module: 'User Authentication',
            message: 'Failed login attempt due to incorrect email or password.',
        });

        await getLogs();

    } else {
        // Optionally, redirect the user if the sign-in was successful
        toast.success("Success! Logging you in...");

        await logEventToDB({
            user: email,
            action: 'Login Success',
            success: true,
            module: 'User Authentication',
            message: 'User successfully logged in.',
        });


        await getLogs();
        window.location.href = "/";
    }
};

// try to create a new user for db with input sanitization and toasts  
export const signUp = async (e: FormData) => {
    const email = e.get("email")?.toString() || "";
    const passwordOne = e.get("passwordOne")?.toString() || "";
    const passwordTwo = e.get("passwordTwo")?.toString() || "";

    if (!isValidEmail(email)) {
        return toast.error("Invalid email");
    }

    if (passwordOne !== passwordTwo) {
        return toast.error("Passwords must match!");
    }

    if (passwordOne.length < 10) {
        return toast.error("Password must be at least 10 characters long!");
    }

    if (!/[A-Z]/.test(passwordOne)) {
        return toast.error("Password must contain at least one uppercase character!");
    }

    if (!/[!@#?]/.test(passwordOne)) {
        return toast.error("Password must contain at least one special character (e.g., ! @ # ?).");
    }

    try {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password: passwordOne }),
        });

        if (res.ok) {
            await logEventToDB({
                user: email,
                action: 'Sign Up Success',
                success: true,
                module: 'User Authentication',
                message: 'User successfully logged in.',
            });
            toast.success("Sign up successful!")
            signIn()
        }
        else {
            await logEventToDB({
                user: email,
                action: 'Sign Up failure',
                success: false,
                module: 'User Authentication',
                message: 'Failed login attempt due to email existing.',
            });
            toast.error("Sign up failed!\nEmail already exists...")
        }
    } catch (error) {
        toast.error("Sign up failed!\nEmail already exists...")
    }
}

export const logout = async () => {

    // simple try catch to log user out while also displaying a nice toast 
    try {
        toast.success("Logging you out!")
        signOut();

        await getLogs();
    } catch (error) {
        console.log("We got an oopsies...\n", error)
    }
} 
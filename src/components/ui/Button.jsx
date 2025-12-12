import React from 'react';

const Button = ({
    children,
    variant = 'primary',
    className = '',
    isLoading = false,
    ...props
}) => {
    const baseStyles = "px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5",
        secondary: "bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-500/20",
        outline: "bg-transparent border border-slate-600 text-slate-300 hover:border-indigo-400 hover:text-indigo-400",
        danger: "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20",
        ghost: "bg-transparent hover:bg-white/5 text-slate-300 hover:text-white"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? (
                <>
                    <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Loading...</span>
                </>
            ) : children}
        </button>
    );
};

export default Button;

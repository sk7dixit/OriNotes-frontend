import React, { useState } from 'react';

const FloatingLabelInput = ({
    label,
    value,
    onChange,
    type = 'text',
    icon: Icon,
    rightElement,
    required = false,
    name,
    error
}) => {
    const [isFocused, setIsFocused] = useState(false);
    // Check if input has content (value can be numeric 0 so check specifically for empty string/null)
    const hasContent = value !== '' && value !== null && value !== undefined;
    const isActive = isFocused || hasContent;

    return (
        <div className="relative mb-5 group">
            {/* Input Wrapper */}
            <div className={`
                relative flex items-center w-full
                bg-white/[0.03] backdrop-blur-sm
                border rounded-xl transition-all duration-300
                ${error
                    ? 'border-red-500/50 shadow-[0_0_0_1px_rgba(239,68,68,0.2)]'
                    : isFocused
                        ? 'border-indigo-500/50 shadow-[0_0_0_4px_rgba(99,102,241,0.1)] bg-white/[0.07]'
                        : 'border-white/10 hover:border-white/20 hover:bg-white/[0.05]'
                }
            `}>
                {/* Left Icon */}
                {Icon && (
                    <div className={`pl-4 pr-2 transition-colors duration-300 ${isFocused ? 'text-indigo-400' : 'text-slate-500'}`}>
                        <Icon size={20} />
                    </div>
                )}

                {/* Input Field */}
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    name={name}
                    required={required}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className={`
                        w-full bg-transparent border-none outline-none
                        text-white text-[15px] font-medium placeholder-transparent
                        px-0 py-4 ${!Icon ? 'pl-4' : ''} ${rightElement ? 'pr-2' : 'pr-4'}
                        h-[56px] focus:ring-0
                    `}
                    placeholder={label} // Needed for some floating label techniques, though we use custom logic
                />

                {/* Floating Label */}
                <label className={`
                    absolute left-0 pointer-events-none transition-all duration-200 ease-out
                    ${Icon ? 'ml-11' : 'ml-4'}
                    ${isActive
                        ? '-translate-y-3 scale-[0.85] text-indigo-300 origin-top-left'
                        : 'translate-y-0 scale-100 text-slate-400 origin-top-left'
                    }
                    ${isActive ? 'top-2' : 'top-4'}
                `}>
                    {label} {required && <span className="text-red-400 ml-0.5">*</span>}
                </label>

                {/* Right Element (Toggle, etc) */}
                {rightElement && (
                    <div className="pr-4 pl-2 flex items-center justify-center">
                        {rightElement}
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="absolute -bottom-5 left-1 text-[11px] font-medium text-red-400 animate-slide-down">
                    {error}
                </div>
            )}
        </div>
    );
};

export default FloatingLabelInput;

import React from 'react';

const Skeleton = ({ className, ...props }) => {
    return (
        <div
            className={`skeleton-shimmer bg-slate-800/50 rounded-lg ${className}`}
            {...props}
        />
    );
};

export default Skeleton;

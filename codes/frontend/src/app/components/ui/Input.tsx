interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string;
}

export const Input = ({ error, className = '', ...props }: InputProps) => {
    return (
        <div className="w-full">
            <input
                className={`w-full p-3 border border-[#C4A484] rounded-lg bg-inputBackground 
                    focus:outline-none focus:ring-2 focus:ring-primary
                    ${error ? 'border-red-500' : ''} 
                    ${className}`}
                {...props}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
}

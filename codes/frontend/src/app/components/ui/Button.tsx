interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline';
    fullWidth?: boolean;
    children: React.ReactNode;
}

export const Button = ({
    variant = 'primary',
    fullWidth = false,
    children,
    className = '',
    ...props
}: ButtonProps) => {
    const baseStyles = 'p-3 rounded-lg font-semibold transition duration-300';
    const variantStyles = {
        primary: 'bg-buttonBackground text-white hover:bg-[#6B3A1A]',
        secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
        outline: 'border border-[#C4A484] text-primary hover:bg-gray-50'
    };
    const widthStyle = fullWidth ? 'w-full' : '';

    return (
        <button
            className={`${baseStyles} ${variantStyles[variant]} ${widthStyle} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}

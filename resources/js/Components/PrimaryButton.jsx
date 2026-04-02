export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center rounded-lg border border-transparent bg-primary px-5 py-2.5 text-sm font-semibold uppercase tracking-wider text-white shadow-sm transition-all duration-200 ease-in-out hover:bg-primary-dark hover:shadow-md focus:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:opacity-90 disabled:opacity-25 cursor-pointer ${
                    disabled && 'opacity-25 cursor-not-allowed'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}

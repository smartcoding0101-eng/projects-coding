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
                `inline-flex items-center rounded-lg border border-transparent bg-fapclas-700 px-5 py-2.5 text-sm font-semibold uppercase tracking-wider text-white shadow-sm transition-all duration-200 ease-in-out hover:bg-fapclas-600 hover:shadow-md focus:bg-fapclas-600 focus:outline-none focus:ring-2 focus:ring-fapclas-400 focus:ring-offset-2 active:bg-fapclas-800 ${
                    disabled && 'opacity-25 cursor-not-allowed'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}

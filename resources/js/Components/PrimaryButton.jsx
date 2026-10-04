export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            style={{
                backgroundColor: 'var(--btn-primary-bg, var(--color-primary, #2B371D))',
                color: 'var(--btn-primary-text, #ffffff)',
                borderRadius: 'var(--btn-primary-radius, 0.5rem)'
            }}
            className={
                `inline-flex items-center justify-center border border-transparent px-5 py-2.5 text-sm font-semibold uppercase tracking-wider shadow-sm transition-all duration-200 ease-in-out hover:brightness-110 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:opacity-90 disabled:opacity-25 cursor-pointer ${
                    disabled && 'opacity-25 cursor-not-allowed'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}

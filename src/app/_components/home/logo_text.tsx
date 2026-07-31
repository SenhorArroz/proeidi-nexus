export default function LogoText() {
    return (
        <section id="logo_text">
            <div className="min-h-190 lg:min-h-190 flex items-center justify-center">
                <img
                    src="/logo.png"
                    alt="Logo"
                    className="w-full max-w-150 object-contain"
                />
            </div>
        </section>
    );
}
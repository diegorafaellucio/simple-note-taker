import AuthHeader from "../components/AuthHeader";
import AuthForm from "../components/AuthForm";

export default function LoginPage() {
    return (
        <div className="flex h-screen items-center justify-center px-6">
            <div>
                <AuthHeader title="Yay, You're Back!" imageSrc="/images/cactus.png" />
                <AuthForm
                    buttonText="Login"
                    redirectText="Oops! I've never been here before"
                    redirectUrl="/signup"
                />
            </div>
        </div>
    );
}

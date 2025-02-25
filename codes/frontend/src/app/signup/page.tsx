import AuthHeader from "../components/AuthHeader";
import AuthForm from "../components/AuthForm";

export default function SignupPage() {
    return (
        <div className="flex h-screen items-center justify-center px-6">
            <div>
                <AuthHeader title="Yay, New Friend!" imageSrc="/images/cute-cat.png" />
                <AuthForm
                    buttonText="Sign Up"
                    redirectText="We're already friends!"
                    redirectUrl="/login"
                    isRegister={true}
                />
            </div>
        </div>
    );
}

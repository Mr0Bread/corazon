import { SignIn } from "@clerk/nextjs";

const SignInPage = () => (
    <div
        className="min-h-screen flex justify-center mt-16"
    >
        <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
    </div>
);

export default SignInPage;

import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div
      className="flex justify-center mt-8"
    >
      <SignIn
        signUpUrl="http://localhost:4200/sign-up"
      />
    </div>
  );
}

import { SignIn } from "@clerk/nextjs";
import { dark } from '@clerk/themes';

export default function Page() {
  return (
    <div
      className="flex justify-center mt-8"
    >
      <SignIn
        signUpUrl="http://localhost:4200/sign-up"
        appearance={{
          baseTheme: dark
        }}
      />
    </div>
  );
}

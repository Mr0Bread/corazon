import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "8rem",
      }}
    >
      <SignIn
        appearance={{
          elements: {
            footer: {
              display: "none",
            }
          }
        }}
      />
    </div>
  );
}

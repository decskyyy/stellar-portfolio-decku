import type { ReactNode } from "react";
import type { Profile } from "@/lib/types";
import Footer from "./Footer";
import GlowField from "./GlowField";
import LiveInfo from "./LiveInfo";
import Nav from "./Nav";

export default function PublicShell({
  profile,
  children,
}: {
  profile: Profile;
  children: ReactNode;
}) {
  return (
    <>
      <GlowField />
      <Nav
        name={profile.full_name}
        profile={profile}
      />
      <LiveInfo />
      <main id="main-content" className="portfolio-main relative">
        {children}
      </main>
      <Footer profile={profile} />
    </>
  );
}

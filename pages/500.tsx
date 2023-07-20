import Custom500Component from "../components/common/custom500Component/custom500Component";
import { signOut } from "next-auth/react";

export default function Custom500() {
  const goBack = async (): Promise<void> => await signOut({ callbackUrl: "/" });

  return <Custom500Component goBack={goBack} />;
}

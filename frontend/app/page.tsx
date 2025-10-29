import { redirect } from "next/navigation";

export default function Home() {
  redirect("http://10.1.163.75:3001/auth/login?project=Aquiles");

}

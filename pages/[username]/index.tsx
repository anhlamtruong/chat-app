import { useRouter } from "next/router";

export default function UserProfilePage({}) {
  const router = useRouter();
  const { username } = router.query;
  // console.log(username);
  return (
    <main>
      <h1>User {username}</h1>
    </main>
  );
}

// pages/index.tsx
import Header from "@/components/Header";
import Form from "@/components/Form";
import PostFeed from "@/components/posts/PostFeed";
import AIForm from "@/components/form/aiForm";
import useCurrentUser from "@/hooks/useCurrentUser";


export default function Home() {
  const { data: currentUser } = useCurrentUser();

  return (
    <>
      <Header label="Home" />
      <Form placeholder="What's happening?" />
      {
        currentUser && <AIForm  />
      }
      
      <PostFeed />
    </>
  );
}

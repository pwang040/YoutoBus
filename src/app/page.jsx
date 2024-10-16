'use client'
import Image from "next/image";
import styles from "./page.module.css";
import { useRouter } from 'next/navigation'; // Next.js router
export default function Home() {
  const router = useRouter();
  const handleClick = (e) => {
    e.preventDefault();
    router.push('/login');
}
  return (

    <div>
      <div>YoutoBus Prototype</div>
      <button onClick={handleClick}>login</button>
    </div>
  );
}

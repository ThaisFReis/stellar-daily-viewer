"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
export default function HomeTheme(){const router=useRouter();useEffect(()=>{const id=setInterval(()=>router.refresh(),15000);return ()=>clearInterval(id)},[router]);return <button className="home-theme" aria-label="Alternar tema claro e escuro" onClick={()=>{const dark=document.documentElement.classList.toggle("dark");try{localStorage.setItem("sd-theme",dark?"dark":"light")}catch{}}}>◐ <span>Tema</span></button>}

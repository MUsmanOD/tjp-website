"use client";
import {useEffect,useRef} from 'react';
import {usePathname} from 'next/navigation';
import {api} from '@/lib/portal-api';
export function VisitorAnalytics(){const path=usePathname(),previous=useRef(null);useEffect(()=>{if(previous.current===path)return;previous.current=path;if(['/','/membership','/gallery','/contact'].includes(path))api('/analytics/events',{method:'POST',body:{path}}).catch(()=>{});},[path]);return null;}

import {Suspense} from 'react';
import {connection} from 'next/server';
import {AdminWorkspace} from '@/components/admin/workspace';
export const metadata={title:'TJP Admin',robots:{index:false,follow:false}};
export default async function Page(){await connection();return <Suspense><AdminWorkspace/></Suspense>;}

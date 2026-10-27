import {AdminSignIn} from '@/components/admin/sign-in';
import {connection} from 'next/server';
export const metadata={title:'TJP Admin',robots:{index:false,follow:false}};
export default async function Page(){await connection();return <AdminSignIn/>;}


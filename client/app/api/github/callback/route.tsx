import { redirect } from 'next/navigation';
import axios from 'axios';
const GITHUB_API_URL = process.env.NEXT_PUBLIC_GITHUB_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET;

export async function GET(req: Request) {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    console.log('code:', code); 

    if (!code) {
        redirect('/');
    }

    const response = await axios.post(`${GITHUB_API_URL}/login/oauth/access_token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${code}`);
    const data = response.data;
    const params = new URLSearchParams(data);

    const accessToken = params.get('access_token') || '';
    const refreshToken = params.get('refresh_token') || '';

    console.log('Access Token:', params.get('access_token'));
    console.log('Refresh Token:', params.get('refresh_token'));

    redirect(`/?accessToken=${accessToken}&refreshToken=${refreshToken}`);
}
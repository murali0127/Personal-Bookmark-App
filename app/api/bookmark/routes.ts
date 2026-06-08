// import {NextResponse} from "next/server";
// import { getBookmarksForOwner, getPublicBookmarksByHandle } from '@/lib/db/bookmark';
//
// export async function GET() {
//     try {
//         const bookmark = await getBookmarksForOwner(user_id);
//
//         return NextResponse.json(profile);
//     } catch (error) {
//         console.error('Error fetching user profile:', error);
//         return NextResponse.json(
//             { error: 'Internal server error' },
//             { status: 500 }
//         );
//     }
// }
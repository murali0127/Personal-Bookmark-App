// import {NextResponse} from "next/server";
// import { getBookmarksForOwner, getPublicBookmarksByHandle } from '@/lib/db/bookmark';
// import {createClient} from "@/lib/supabase/server";
//
// export async function GET() {
//     try {
//         const supabase = await createClient();
//         const bookmark = await getBookmarksForOwner()
//
//         return NextResponse.json(bookmark);
//     } catch (error) {
//         console.error('Error fetching user profile:', error);
//         return NextResponse.json(
//             { error: 'Internal server error' },
//             { status: 500 }
//         );
//     }
// }
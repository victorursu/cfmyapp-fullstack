// app/api/questions/delete/route.js
export const runtime = 'edge'

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../lib/supabaseAdmin'

export async function POST(req) {
    const { ids } = await req.json()
    const { error } = await supabaseAdmin
        .from('literacyQuestions')
        .delete()
        .in('id', ids)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ deleted: ids.length })
}

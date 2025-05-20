// app/api/submit/route.js
export const runtime = 'edge'

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../lib/supabaseAdmin'

export async function POST(request) {
    try {
        const { type, language, payload } = await request.json()

        const { data, error } = await supabaseAdmin
            .from('literacyQuestions')
            .insert([{ type, language, payload }])
            .select('id')
            .single()

        if (error) {
            console.error('Supabase insert error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json( {id: data.id })
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}

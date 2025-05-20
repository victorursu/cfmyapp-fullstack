// app/api/submit/route.js
export const runtime = 'edge'

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../lib/supabaseAdmin'

export async function POST(request) {
    try {
        const { email, jsonData } = await request.json()

        const { error } = await supabaseAdmin
            .from('test')
            .insert([{ email, jsonData }])

        if (error) {
            console.error('Supabase insert error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ message: 'Inserted' })
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}

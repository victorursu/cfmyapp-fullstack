// app/questions/page.js
export const dynamic = 'force-dynamic'

import { supabaseAdmin } from '../lib/supabaseAdmin'
import QuestionsTable from './QuestionsTable'

export default async function QuestionsPage() {
  const { data: questions, error } = await supabaseAdmin
    .from('literacyQuestions')
    .select('id, created_at, type, language, payload')
    .order('created_at', { ascending: false })

  if (error) {
        return (
                  <div className="error">
                        <h1>Error loading questions</h1>
                        <p>{error.message}</p>
                      </div>
                )
          }

      return <QuestionsTable initialQuestions={questions} />
}

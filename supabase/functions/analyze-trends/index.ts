import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { userId } = await req.json()

    if (!userId) {
      throw new Error('User ID is required')
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Fetch last 10 journal entries
    const { data: entries, error: entriesError } = await supabase
      .from('journal_entries')
      .select('entry_text, sentiment_data, created_at, pillar')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10)

    if (entriesError) throw entriesError

    // Analyze trends
    const trends = {
      sentiment_trend: calculateSentimentTrend(entries),
      pillar_frequency: calculatePillarFrequency(entries),
      entry_frequency: calculateEntryFrequency(entries),
    }

    return new Response(
      JSON.stringify(trends),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

function calculateSentimentTrend(entries: any[]) {
  return entries.map(entry => ({
    date: entry.created_at,
    sentiment: entry.sentiment_data?.sentiment || 'neutral'
  }))
}

function calculatePillarFrequency(entries: any[]) {
  const frequency: Record<string, number> = {}
  entries.forEach(entry => {
    if (entry.pillar) {
      frequency[entry.pillar] = (frequency[entry.pillar] || 0) + 1
    }
  })
  return frequency
}

function calculateEntryFrequency(entries: any[]) {
  const dates = entries.map(entry => {
    const date = new Date(entry.created_at)
    return date.toISOString().split('T')[0]
  })
  
  const frequency: Record<string, number> = {}
  dates.forEach(date => {
    frequency[date] = (frequency[date] || 0) + 1
  })
  
  return frequency
}
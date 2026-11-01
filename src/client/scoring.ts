import questionBank from '../../skill/questions.json' with { type: 'json' }

export type Answer = 'A' | 'B' | 'skip' | null
export interface Question { id: string; dimension: string; a_value: -1 | 1; a: string; b: string; a_en: string; b_en: string; scenario: string; scenario_en: string }
export interface DimensionResult { id: string; pole: 'low' | 'high' | 'mixed' | 'unknown'; answered: number }
interface Bank { dimensions: { id: string; name: string; name_en: string; low: string; high: string; low_en: string; high_en: string }[]; questions: { id: string; dimension: string; a_value: number; a: string; b: string; a_en: string; b_en: string; scenario: string; scenario_en: string }[] }

const bank = questionBank as Bank
export const QUESTIONS: Question[] = bank.questions.map(q => ({ ...q, a_value: q.a_value === 1 ? 1 : -1 }))
export const DIMENSIONS = bank.dimensions.map(d => d.id)
export const DIMENSION_NAMES: Record<string,string> = Object.fromEntries(bank.dimensions.map(d => [d.id,d.name]))
export const DIMENSION_NAMES_EN: Record<string,string> = Object.fromEntries(bank.dimensions.map(d => [d.id,d.name_en]))
export const LABELS: Record<string, [string,string]> = Object.fromEntries(bank.dimensions.map(d => [d.id,[d.low,d.high]]))
export const LABELS_EN: Record<string, [string,string]> = Object.fromEntries(bank.dimensions.map(d => [d.id,[d.low_en,d.high_en]]))

export function score(answers: Record<string, Answer>): DimensionResult[] {
  return DIMENSIONS.map(id => {
    const values = QUESTIONS.filter(q => q.dimension === id).flatMap(q => {
      const answer = answers[q.id]
      return answer === 'A' ? [q.a_value] : answer === 'B' ? [-q.a_value] : []
    })
    const mean = values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0
    const pole = values.length < 2 ? 'unknown' : mean <= -1/3 + 1e-9 ? 'low' : mean >= 1/3 - 1e-9 ? 'high' : 'mixed'
    return { id, pole, answered: values.length }
  })
}

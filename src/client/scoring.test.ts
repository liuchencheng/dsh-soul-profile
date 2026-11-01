import { describe, expect, it } from 'vitest'
import { DIMENSIONS, QUESTIONS, score, type Answer } from './scoring.ts'

describe('Soul Profile scoring', () => {
  it('does not infer a preference from a single answer', () => {
    const answers: Record<string, Answer> = { Q01: 'A' }
    expect(score(answers).find(row => row.id === 'structure')).toMatchObject({ pole: 'unknown', answered: 1 })
  })

  it('represents a two-to-one majority as a directional preference', () => {
    const answers: Record<string, Answer> = { Q01: 'A', Q02: 'A', Q03: 'B' }
    const structure = score(answers).find(row => row.id === 'structure')
    expect(structure?.answered).toBe(3)
    expect(['low', 'high']).toContain(structure?.pole)
  })

  it('keeps an even split across two answers mixed', () => {
    const qs = QUESTIONS.filter(q => q.dimension === 'structure')
    const answers: Record<string, Answer> = { [qs[0].id]: 'A', [qs[1].id]: qs[0].a_value === qs[1].a_value ? 'B' : 'A' }
    expect(score(answers).find(row => row.id === 'structure')).toMatchObject({ pole: 'mixed', answered: 2 })
  })

  it('returns all dimensions as unknown for a blank questionnaire', () => {
    expect(score({})).toEqual(DIMENSIONS.map(id => ({ id, pole: 'unknown', answered: 0 })))
  })

  it('has exactly three items per dimension and no raw answer fields in results', () => {
    for (const dimension of DIMENSIONS) expect(QUESTIONS.filter(q => q.dimension === dimension)).toHaveLength(3)
    expect(JSON.stringify(score({ Q01: 'A' }))).not.toContain('Q01')
  })
})

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { Context } from '@deepseek-ai/cordis'
import type { InjectFace, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import type { ConfigForm } from '@deepseek-ai/dsh-client-ui-settings/client'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import { Button, Modal } from '@deepseek-ai/dsh-client-ui-primitives'
import { createSnapshotStore, type SnapshotStore } from '@deepseek-ai/dsh-client-store'
import { QUESTIONS, score, LABELS, LABELS_EN, DIMENSION_NAMES, DIMENSION_NAMES_EN, type Answer } from './scoring.ts'

const STYLE = `.soul-profile{display:grid;gap:16px;max-width:680px;line-height:1.55}.soul-profile p{margin:0}.soul-profile p.sp-hint{color:var(--muted-color,#657080);font-size:13px;margin:2px 0 6px}.soul-profile label{display:flex;align-items:flex-start;gap:10px}.soul-profile input[type=checkbox]{margin-top:5px}.sp-actions{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:8px;margin-top:8px}.sp-progress{display:grid;gap:8px;font-size:13px}.sp-progress progress{width:100%}.soul-profile h3{margin:8px 0;font-size:20px}.sp-choice{border:1px solid var(--border-color,#d7dce2);border-radius:10px;background:var(--surface-color,#fff);color:inherit;padding:14px 16px;text-align:left;cursor:pointer;font:inherit}.sp-choice:hover,.sp-choice.selected{border-color:var(--accent-color,#4d7cfe);background:color-mix(in srgb,var(--accent-color,#4d7cfe) 8%,transparent)}.sp-skip,.sp-language button{border:0;background:transparent;color:var(--muted-color,#657080);cursor:pointer;font:inherit;padding:5px}.sp-language{display:flex;justify-content:flex-end;gap:8px}.sp-results{display:grid;gap:10px;max-height:48vh;overflow:auto}.sp-results label{display:grid;grid-template-columns:minmax(120px,1fr) minmax(150px,1fr) auto;align-items:center;gap:10px}.sp-results select{min-width:0;padding:8px}.sp-results small{color:var(--muted-color,#657080);white-space:nowrap}@media(max-width:600px){.sp-results label{grid-template-columns:1fr 1fr}.sp-results small{grid-column:2}}`

interface Saved { profile?: string; enabled?: boolean; completed?: boolean; dismissed?: boolean }
interface Injected { form: ConfigForm<Saved>; hooks: { profile: SnapshotStore<{ value: Saved | null; ready: boolean }> } }
type Props = PropsRuntime<'settings.onboarding'> & InjectFace<Injected>
const NS = 'soul-profile'

export const name = 'soul-profile'
export const inject = ['slots', 'configForms']
export function apply(ctx: Context): void {
  ctx.effect(() => {
    const element = document.createElement('style')
    element.dataset.soulProfile = 'styles'
    element.textContent = STYLE
    document.head.append(element)
    return () => element.remove()
  }, 'soul-profile: styles')
  const form = ctx.configForms.get<Saved>(NS)
  const state = createSnapshotStore<{ value: Saved | null; ready: boolean }>({ value: form.getSnapshot().value ?? null, ready: form.getSnapshot().status === 'ready' })
  form.subscribe(() => state.update(snapshot => {
    const current = form.getSnapshot()
    snapshot.value = current.value ?? null
    snapshot.ready = current.status === 'ready'
  }))
  const injected = (): Injected => ({ form, hooks: { profile: state } })
  ctx.slots.inject('settings.onboarding', () => ctx.slots.register({
    name: 'settings.onboarding', id: 'soul-profile', order: 20, inject: injected,
  }, SoulProfileOnboarding))
  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section', id: 'soul-profile', order: 50,
    label: () => '灵魂画像 / Soul Profile', inject: injected,
  }, SoulProfileSettings))
}

function SoulProfileSettings(props: PropsRuntime<'settings.section'> & InjectFace<Injected>): ReactNode {
  const [open, setOpen] = useState(false)
  const state = props.useProfile(value => value.value)
  if (open) {
    const onboardingProps = {
      ...props, stepId: 'soul-profile', explicit: true, complete: () => setOpen(false), openSection: () => {},
    } as Props
    return <SoulProfileOnboarding {...onboardingProps} />
  }
  const hasProfile = Boolean(state?.profile)
  const enabled = state?.enabled !== false
  const status = !hasProfile
    ? '尚未填写档案。 / No profile yet.'
    : enabled
      ? '档案已启用，正在注入系统提示。 / Profile is enabled and injected into the system prompt.'
      : '档案已关闭，当前不会注入。 / Profile is off and no longer injected.'
  return <section className="soul-profile">
    <h2>灵魂画像 / Soul Profile</h2>
    <p>{status}</p>
    <p>这是一份可编辑的协作偏好摘要，不是人格测试或诊断。可随时重新填写、关闭或删除。 / An editable collaboration preference summary, not a personality test or diagnosis. Retake, disable, or delete it at any time.</p>
    <Button variant="primary" onClick={() => setOpen(true)}>{hasProfile ? '管理档案 / Manage profile' : '开始设置 / Set up profile'}</Button>
  </section>
}

type Screen = 'intro' | 'questions' | 'review' | 'manage' | null

/**
 * Draft answers live at module scope so an unmount caused by the host
 * (window focus change, settings refetch, slot re-render) cannot wipe the
 * answers a user is in the middle of giving.
 */
const draft: {
  screen: Screen
  index: number
  answers: Record<string, Answer>
  manual: Record<string, 'low' | 'high' | 'mixed' | 'unknown'>
  language: 'zh' | 'en'
  consented: boolean
} = { screen: null, index: 0, answers: {}, manual: {}, language: 'zh', consented: false }

function resetDraft(): void {
  draft.screen = null
  draft.index = 0
  draft.answers = {}
  draft.manual = {}
  draft.consented = false
}

function SoulProfileOnboarding(props: Props): ReactNode {
  const { complete, explicit = false, form, useProfile } = props
  const profileState = useProfile(s => s)
  const saved = profileState.value
  const [screen, setScreenState] = useState<Screen>(draft.screen)
  const [index, setIndex] = useState(draft.index)
  const [answers, setAnswers] = useState<Record<string, Answer>>(draft.answers)
  const [manual, setManual] = useState<Record<string, 'low'|'high'|'mixed'|'unknown'>>(draft.manual)
  const [language, setLanguage] = useState<'zh'|'en'>(draft.language)
  const [error, setError] = useState('')
  const [consented, setConsented] = useState(draft.consented)
  const question = QUESTIONS[index]
  const result = useMemo(() => score(answers), [answers])
  const t = (zh: string, en: string): string => language === 'zh' ? zh : en
  // A restored screen means this mount is a re-mount of work in progress: do not
  // re-decide the first screen, or the user lands back on the intro.
  const decided = useRef(draft.screen !== null)
  const readyOnce = useRef(profileState.ready)
  if (profileState.ready) readyOnce.current = true

  const setScreen = (next: Screen): void => {
    draft.screen = next
    setScreenState(next)
  }

  /** Close the dialog and drop the draft, so reopening starts clean. */
  const finish = (): void => {
    resetDraft()
    complete()
  }

  useEffect(() => {
    draft.index = index
    draft.answers = answers
    draft.manual = manual
    draft.language = language
    draft.consented = consented
  }, [index, answers, manual, language, consented])

  useEffect(() => {
    if (screen === null) return
    const root = document.getElementById('root')
    if (!root) return
    const wasInert = root.inert
    root.inert = true
    return () => { root.inert = wasInert }
  }, [screen])

  useEffect(() => {
    if (decided.current || !profileState.ready) return
    decided.current = true
    if (explicit) { setScreen(saved?.completed ? 'manage' : 'intro'); return }
    if (saved?.completed || saved?.dismissed) { complete(); return }
    setScreen('intro')
  }, [explicit, profileState.ready, saved?.completed, saved?.dismissed, complete])

  if (screen === null || !readyOnce.current) return null
  if (screen === 'intro') return <Modal open title={t('灵魂画像 · 协作偏好设置','Soul Profile · Collaboration preferences')} closeLabel={t('关闭','Close')} onClose={finish}>
    <div className="soul-profile"><p>{t('这是一份轻量、可修改的协作偏好设置，不是人格测试或心理诊断。约需 3 分钟，可跳过任何题目。','A short, editable collaboration preference setup—not a personality test or psychological assessment. About 3 minutes; every question can be skipped.')}</p>
      <p>{t('只有你点击“保存并启用”后，整理后的偏好才会保存在当前 Harness 配置中，并用于后续 Agent 提示词。原始答案不会保存。','Only after you choose “Save and enable” will the summarized preferences be stored in this Harness profile and used in later agent prompts. Raw answers are not stored.')}</p>
      <label><input type="checkbox" checked={consented} onChange={e => setConsented(e.target.checked)} /> {t('我同意回答这些偏好问题，并在保存后让 Agent 参考整理结果。','I agree to answer these preference questions and let the agent use the summary if I save it.')}</label>
      <div className="sp-actions"><Button onClick={finish}>{t('稍后','Later')}</Button><Button variant="primary" disabled={!consented} onClick={() => setScreen('questions')}>{t('开始','Start')}</Button></div>
    </div></Modal>
  if (screen === 'questions') return <Modal open title={t('你的协作偏好', 'Your collaboration preferences')} closeLabel={t('关闭','Close')} onClose={finish}>
    <div className="soul-profile"><div className="sp-progress">{t(`第 ${index+1} / ${QUESTIONS.length} 题`, `Question ${index+1} of ${QUESTIONS.length}`)}<progress value={index+1} max={QUESTIONS.length}/></div>
      <div className="sp-language"><button onClick={() => setLanguage('zh')}>中文</button><button onClick={() => setLanguage('en')}>English</button></div>
      <h3>{language === 'zh' ? question.scenario : question.scenario_en}</h3>
      <p className="sp-hint">{t('哪一项更像平时的你？','Which one is more like you?')}</p>
      {[["A",language === 'zh' ? question.a : question.a_en], ["B",language === 'zh' ? question.b : question.b_en]].map(([key,label]) => <button className={`sp-choice ${answers[question.id] === key ? 'selected':''}`} key={key} onClick={() => { setAnswers(v => ({...v,[question.id]:key as Answer})); setIndex(i => Math.min(QUESTIONS.length - 1,i+1)) }}>{label}</button>)}
      <button className="sp-skip" onClick={() => { setAnswers(v => ({...v,[question.id]:'skip'})); setIndex(i => Math.min(QUESTIONS.length - 1,i+1)) }}>{t('跳过 / 都可以','Skip / It depends')}</button>
      <div className="sp-actions"><Button disabled={index===0} onClick={() => setIndex(i => i-1)}>{t('上一步','Back')}</Button><Button variant="primary" onClick={() => index === QUESTIONS.length-1 ? setScreen('review') : setIndex(i => i+1)}>{index===QUESTIONS.length-1 ? t('查看摘要','Review') : t('下一题','Next')}</Button></div>
    </div></Modal>
  if (screen === 'review') return <Modal open title={t('检查并确认摘要','Review your summary')} closeLabel={t('关闭','Close')} onClose={finish}>
    <div className="soul-profile"><p>{t('以下只是根据已答题目生成的暂定协作偏好。可以修改任何一项，也可以不启用。','These are tentative collaboration preferences based only on answered items. You can change any item or choose not to enable them.')}</p>
      <div className="sp-results">{result.map(d => { const labels=language==='zh'?LABELS[d.id]:LABELS_EN[d.id]; return <label key={d.id}><span>{language==='zh'?DIMENSION_NAMES[d.id]:DIMENSION_NAMES_EN[d.id]}</span><select value={manual[d.id] ?? 'auto'} onChange={e => { const value=e.target.value; setManual(m => { const next={...m}; if (value==='auto') delete next[d.id]; else next[d.id]=value as typeof d.pole; return next }) }}><option value="auto">{t('按答题摘要','Use answers')}</option><option value="unknown">{t('暂不确定','Undetermined')}</option><option value="low">{labels[0]}</option><option value="mixed">{t('视情况而定','Depends on context')}</option><option value="high">{labels[1]}</option></select><small>{t(`依据 ${d.answered}/3 题` , `${d.answered}/3 answered`)}</small></label>})}</div>
      {error && <p role="alert">{error}</p>}<div className="sp-actions"><Button onClick={() => setScreen('questions')}>{t('返回修改','Edit answers')}</Button><Button onClick={() => { void form.set('dismissed', true).then(finish) }}>{t('不启用','Do not enable')}</Button><Button variant="primary" onClick={() => { const profile=renderProfile(result,language,manual); void form.set('profile',profile).then(ok => ok ? form.set('enabled',true).then(() => form.set('dismissed',false)).then(() => form.set('completed',true)).then(finish) : setError(t('保存失败，请重试。','Save failed. Please try again.'))) }}>{t('保存并启用','Save and enable')}</Button></div>
    </div></Modal>
  if (screen === 'manage') {
    const enabled = saved?.enabled !== false
    const retake = (): void => { setAnswers({}); setManual({}); setIndex(0); setScreen('questions') }
    const toggle = (): void => { void form.set('enabled', !enabled).then(finish) }
    const remove = (): void => { void form.set('profile', '').then(() => form.set('enabled', true)).then(() => form.set('completed', false)).then(() => form.set('dismissed', true)).then(finish) }
    return <Modal open title={t('管理灵魂画像','Manage Soul Profile')} closeLabel={t('关闭','Close')} onClose={finish}>
      <div className="soul-profile">
        <p>{enabled
          ? t('档案已启用，正在注入系统提示。','The profile is enabled and injected into the system prompt.')
          : t('档案已关闭，内容仍在，但不会注入。','The profile is off. Its content stays, but nothing is injected.')}</p>
        <p>{t('关闭只是暂停使用，随时可以再打开；删除会清空内容，无法恢复。','Disabling pauses it and can be undone; deleting clears the content for good.')}</p>
        <div className="sp-actions">
          <Button onClick={retake}>{t('重新填写','Retake')}</Button>
          <Button onClick={toggle}>{enabled ? t('关闭档案','Disable profile') : t('启用档案','Enable profile')}</Button>
          <Button onClick={remove}>{t('删除档案','Delete profile')}</Button>
        </div>
      </div>
    </Modal>
  }
  return null
}

/**
 * 注入提示词的正文：每一极写成一个可执行的动作，而不是形容用户的形容词。
 * 系统提示里命令句的遵守率明显高于描述句，所以这里全部用祈使句。
 * 改动时请同步 `skill/tools/profile.py` 的 `recommendations`，离线 CLI 用的是同一套文案。
 */
const INSTRUCTIONS: Record<string, [string, string]> = {
  structure: [
    '先给方向再细化——面对开放任务时先给 2–3 条可选路径，等我选定后再展开，不要一上来就输出完整计划。',
    '先给完整步骤——动手前列出步骤与顺序，标出下一步，再按顺序执行。',
  ],
  social_energy: [
    '保持一对一、低干扰的交流——不堆寒暄，也不引入多方视角，直接对着我说。',
    '可以更外向地展开——适度提议、追问、给出多方视角，保持交流的节奏。',
  ],
  information_style: [
    '先给具体例子——用一个真实案例开场，再归纳规律，不要先讲抽象框架。',
    '先给整体框架——用一两句话说明全貌和结构，再进入细节。',
  ],
  decision_basis: [
    '决策建议要说明对人的影响——除了证据，也指出这个选择会影响谁、代价是什么。',
    '决策建议要摆出证据和判断标准——说明依据是什么、用什么标准比较，再给结论。',
  ],
  expression: [
    '回答保持简短克制——先给结论，省略铺垫，不要为了完整而扩写。',
    '回答要补足背景——结论之后说明原因和必要上下文，不要只丢一个结论。',
  ],
  feedback: [
    '指出问题时先肯定再提异议——先说哪里做对了，再指出不一致的地方，避免直接否定。',
    '指出问题要直接——先说不一致的地方和影响，不要用缓冲语绕开。',
  ],
  autonomy: [
    '过程中保持同步——每完成一个阶段简短汇报，遇到岔路先问我。',
    '目标明确时直接做完再汇报——中途不要问“要不要继续”，只在需要我决策时停下。',
  ],
  stress_support: [
    '我说压力或麻烦时，先别急着给方案——先回应我说的事实和感受，再问要不要建议。',
    '我说压力或麻烦时，先给可执行的下一步——列出能做的一两件事，再补充说明。',
  ],
}

const INSTRUCTIONS_EN: Record<string, [string, string]> = {
  structure: [
    'Offer direction before detail: for open-ended work, give 2–3 routes and expand only after I pick one; do not open with a full plan.',
    'Give the full sequence: list the steps and their order before starting, name the next action, then work through them.',
  ],
  social_energy: [
    'Keep the exchange one-to-one and low-noise: skip pleasantries and multi-party framing, address me directly.',
    'Lean outward: offer suggestions, ask follow-ups, and bring in more than one angle to keep the exchange lively.',
  ],
  information_style: [
    'Lead with a concrete example: open with a real case, then generalise; do not start with an abstract framework.',
    'Lead with the whole picture: state the overall shape in one or two sentences, then go into detail.',
  ],
  decision_basis: [
    'When recommending, say who is affected: alongside the evidence, name who this choice touches and what it costs them.',
    'When recommending, state the evidence and the criteria: say what the basis is and what standard you compared against before concluding.',
  ],
  expression: [
    'Stay brief and understated: lead with the conclusion, drop preamble, and do not expand just to be complete.',
    'Add context: after the conclusion, explain the reasoning and the context that matters; do not hand over a bare conclusion.',
  ],
  feedback: [
    'When pointing out a problem, acknowledge first: say what works, then name the inconsistency; avoid flat negation.',
    'Be direct when pointing out a problem: name the inconsistency and its impact first, without cushioning phrases.',
  ],
  autonomy: [
    'Stay in sync while working: report briefly at each stage and ask before taking a fork.',
    'When the goal is clear, finish the work and report once: do not ask “shall I continue”; stop only where I must decide.',
  ],
  stress_support: [
    'When I describe stress or trouble, do not jump to solutions: acknowledge what I said and how it lands, then ask whether I want advice.',
    'When I describe stress or trouble, lead with a doable next step: name one or two things I can act on, then explain.',
  ],
}

function renderProfile(results: ReturnType<typeof score>, lang:'zh'|'en', manual: Record<string, 'low'|'high'|'mixed'|'unknown'>): string {
  const title=lang==='zh'?'## 用户的协作偏好（请照此协作）':'## User collaboration preferences (follow these)'
  const caveat=lang==='zh'?'下面每一条都是我确认过的协作方式，请在日常回答中照做。当我当前的要求与它们冲突时，以我当前的要求为准；某条不适用或含义不清时先问我，不要自行推测。':'Each line below is a collaboration preference I confirmed; follow it in normal replies. When my current request conflicts with one, my current request wins; ask me when a line does not apply or is unclear rather than guessing.'
  const lines=results.flatMap(d => { const pole=manual[d.id]??d.pole; if (pole!=='low' && pole!=='high') return []; const table=lang==='zh'?INSTRUCTIONS:INSTRUCTIONS_EN; const text=table[d.id]?.[pole==='low'?0:1]; if (!text) return []; const name=lang==='zh'?DIMENSION_NAMES[d.id]:DIMENSION_NAMES_EN[d.id]; return [`- ${name}：${text}`] })
  return [title,'',`> ${caveat}`,'',...(lines.length?lines:[lang==='zh'?'- 目前没有足够明确、可以照做的偏好；需要时直接问我。':'- No preference is clear enough to act on yet; ask me when it matters.'])].join('\n')
}

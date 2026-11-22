import { useState } from 'react'
import { bank } from './content/questions'
import type { Answer, Exercise, Task } from './content/questions'
import { parseNumber } from './grading'
import { draftsKey, isExercise, isTask, parseDraft, readDrafts, serializeDraft } from './teacher-drafts'

type Props = {
  t: (en: string, cn: string) => string
  preview: (task: Task, context: string) => React.ReactNode
  sample?: Exercise
}
const emptyTask: Task = { id: '', skill: '', difficulty: 'foundation', prompt: '', answer: { type: 'number', correct: 0 }, solution: '', misconception: '' }
const emptyExercise: Exercise = { id: '', title: '', context: '', tasks: [] }
type WorkedStep = NonNullable<Task['workedSteps']>[number]
const emptyWorkedStep: WorkedStep = { math: '', en: '', zh: '' }

function answerChoices(answer: Answer) {
  return 'choices' in answer ? answer.choices.join('\n') : ''
}

function answerInput(answer: Answer) {
  if ('choices' in answer) return answer.correct.map(position => position + 1).join(', ')
  return answer.type === 'number' ? String(answer.correct) : answer.correct.join(', ')
}

export function TeacherEditor({ t, preview, sample }: Props) {
  const [drafts, setDrafts] = useState(() => readDrafts({
    getItem: key => window.localStorage.getItem(key),
  }))
  const [exercise, setExercise] = useState<Exercise>(() => {
    if (!sample) return emptyExercise
    const draft = drafts.find(item => item.id === sample.id)
    return draft ? { ...sample, ...draft } : sample
  })
  const [index, setIndex] = useState(exercise.tasks.length ? 0 : -1)
  const [task, setTask] = useState<Task>(() => exercise.tasks[0] ?? emptyTask)
  const [choices, setChoices] = useState(() => index < 0 ? '' : answerChoices(task.answer))
  const [correct, setCorrect] = useState(() => index < 0 ? '' : answerInput(task.answer))
  const [message, setMessage] = useState('')
  const [previewTask, setPreviewTask] = useState<Task>()

  function editTask(value: Task, position: number) {
    setTask(value)
    setIndex(position)
    setChoices(position < 0 ? '' : answerChoices(value.answer))
    setCorrect(position < 0 ? '' : answerInput(value.answer))
    setPreviewTask(undefined)
    setMessage('')
  }

  function editWorkedStep(position: number, field: keyof WorkedStep, value: string) {
    setTask(current => ({
      ...current,
      workedSteps: current.workedSteps?.map((step, index) => index === position ? { ...step, [field]: value } : step),
    }))
  }

  function prepareTask(): Task | undefined {
    const fields = correct.split(',').map(value => value.trim())
    const type = task.answer.type
    const values = fields.map(value => type === 'single' || type === 'multiple' ? Number(value) : parseNumber(value) ?? Number(value))
    let answer: Answer
    const options = choices.split('\n').map(value => value.trim()).filter(Boolean)
    if (fields.some((value, i) => !value || !Number.isFinite(values[i]))) return
    if (type === 'number' && values.length === 1) answer = { type, correct: values[0] }
    else if ((type === 'vector' || type === 'root-pair') && values.length === 2) answer = { type, correct: [values[0], values[1]] }
    else if ((type === 'single' || type === 'multiple') && options.length >= 2 &&
      (type === 'multiple' || values.length === 1) && new Set(values).size === values.length &&
      values.every(value => Number.isInteger(value) && value >= 1 && value <= options.length)) {
      answer = { type, choices: options, correct: values.map(value => value - 1) }
    } else return
    const candidate = { ...task, id: task.id.trim(), answer }
    return isTask(candidate) ? candidate : undefined
  }

  function updateTask(save: boolean) {
    const candidate = prepareTask()
    if (!candidate || exercise.tasks.some((other, position) => position !== index && other.id === candidate.id)) {
      setMessage(t('Check the task ID, skill, question, answer and worked solution. Complete all three fields in each written step.', '请检查步骤 ID、技能、题干、答案和解析。每行书写步骤需要填写公式、英文说明和中文说明。'))
      return
    }
    setPreviewTask(candidate)
    if (save) {
      const next = [...exercise.tasks]
      next[index < 0 ? next.length : index] = candidate
      setExercise({ ...exercise, tasks: next })
      setIndex(index < 0 ? next.length - 1 : index)
    }
    setMessage(save ? t('Step saved to this draft.', '步骤已保存到当前草稿。') : '')
  }

  function exportDraft() {
    if (!isExercise(exercise)) {
      setMessage(t('Enter an exercise ID and title, and save at least one step.', '请填写练习 ID 和标题，并至少保存一个步骤。'))
      return
    }
    const url = URL.createObjectURL(new Blob([serializeDraft(exercise)], { type: 'application/json' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'mushroom-exercise.json'
    link.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  function openDraft(draft: Exercise) {
    setExercise(draft)
    editTask(draft.tasks[0], 0)
  }

  function saveDraft() {
    if (!isExercise(exercise)) {
      setMessage(t('Enter an exercise ID and title, and save at least one step.', '请填写练习 ID 和标题，并至少保存一个步骤。'))
      return
    }
    const draft = { ...exercise, id: exercise.id.trim(), title: exercise.title.trim() }
    try {
      const latest = readDrafts(window.localStorage)
      const next = [...latest.filter(item => item.id !== draft.id), draft]
      window.localStorage.setItem(draftsKey, JSON.stringify(next))
      setDrafts(next)
      setExercise(draft)
      setMessage(t('Draft saved in this browser.', '草稿已保存在此浏览器。'))
    } catch {
      setMessage(t('Browser storage is unavailable. Export the draft as JSON to keep it.', '浏览器存储不可用，请导出 JSON 保存草稿。'))
    }
  }

  async function importDraft(file: File) {
    try {
      const draft = parseDraft(await file.text())
      if (draft) {
        openDraft(draft)
        setMessage(t('Draft imported. Save it in this browser to keep it here.', '草稿已导入。可保存到此浏览器。'))
        return
      }
    } catch {
      // Both unreadable and invalid files leave the current exercise in place.
    }
    setMessage(t('Choose a valid Mushroom Lab P1 exercise JSON file.', '请选择有效的 Mushroom Lab P1 练习 JSON 文件。'))
  }

  return <>
    <h1 className="practice-title">{t('Question Builder', '教师题目编辑器')}</h1>
    <p>{t('Save each step, then save the exercise in this browser or export it as JSON.', '先保存各步骤，再把练习保存到此浏览器或导出为 JSON。')}</p>
    <div className="editor-layout">
      <section className="card editor-fields">
        <button type="button" onClick={() => { setExercise(emptyExercise); editTask(emptyTask, -1) }}>{t('New exercise', '新建练习')}</button>
        <label>{t('Open a saved draft', '打开本地草稿')}<select value="" onChange={event => {
          const draft = drafts.find(item => item.id === event.target.value)
          if (draft) openDraft(draft)
        }}><option value="">{t('Choose a draft', '选择草稿')}</option>{drafts.map(draft => <option key={draft.id} value={draft.id}>{draft.title} · {draft.id}</option>)}</select></label>
        <label>{t('Import an exercise JSON file', '导入练习 JSON')}<input type="file" accept=".json,application/json" onChange={event => {
          const file = event.target.files?.[0]
          event.target.value = ''
          if (file) void importDraft(file)
        }} /></label>
        <label>{t('Load a sample', '载入样题')}<select value="" onChange={event => {
          const sample = bank.exercises.find(item => item.id === event.target.value)
          if (sample) { setExercise(sample); editTask(sample.tasks[0], 0) }
        }}><option value="">{t('Choose an exercise', '选择练习')}</option>{bank.exercises.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label>
        <label>{t('Exercise ID', '练习 ID')}<input value={exercise.id} onChange={event => setExercise({ ...exercise, id: event.target.value })} /></label>
        <label>{t('Exercise title', '练习标题')}<input value={exercise.title} onChange={event => setExercise({ ...exercise, title: event.target.value })} /></label>
        <label>{t('Shared context', '共用题干')}<textarea value={exercise.context ?? ''} onChange={event => setExercise({ ...exercise, context: event.target.value })} /></label>
        <div className="actions">{exercise.tasks.map((item, position) => <button key={item.id} onClick={() => editTask(item, position)}>{item.id}</button>)}
          <button onClick={() => editTask(emptyTask, -1)}>{t('New step', '新增步骤')}</button></div>
        <div className="actions">
          <button type="button" onClick={saveDraft}>{t('Save draft in this browser', '保存到此浏览器')}</button>
          <button type="button" onClick={exportDraft}>{t('Export draft as JSON', '导出草稿 JSON')}</button>
        </div>
      </section>
      <section className="card editor-fields">
        <label>{t('Step ID', '步骤 ID')}<input value={task.id} onChange={event => setTask({ ...task, id: event.target.value })} /></label>
        <label>{t('Skill', '技能')}<input value={task.skill} onChange={event => setTask({ ...task, skill: event.target.value })} /></label>
        <label>{t('Question (wrap LaTeX in dollar signs)', '题干（用美元符号包裹 LaTeX）')}<textarea value={task.prompt} onChange={event => setTask({ ...task, prompt: event.target.value })} /></label>
        <label>{t('Answer type', '答案类型')}<select value={task.answer.type} onChange={event => {
          const type = event.target.value
          const answer: Answer = type === 'single' || type === 'multiple' ? { type, choices: [], correct: [] }
            : type === 'vector' || type === 'root-pair' ? { type, correct: [0, 0] } : { type: 'number', correct: 0 }
          setTask({ ...task, answer })
          setCorrect('')
        }}><option value="number">{t('Number', '数值')}</option><option value="root-pair">{t('Two distinct roots', '两个不同的根')}</option><option value="vector">{t('Column vector', '列向量')}</option><option value="single">{t('Single choice', '单选')}</option><option value="multiple">{t('Multiple choice', '多选')}</option></select></label>
        {'choices' in task.answer && <label>{t('Choices (one per line)', '选项（每行一个）')}<textarea value={choices} onChange={event => setChoices(event.target.value)} /></label>}
        <label>{t('Correct answer', '正确答案')}<input value={correct} onChange={event => setCorrect(event.target.value)} /></label>
        <small>{task.answer.type === 'vector' ? t('Enter the horizontal and vertical components, separated by a comma.', '按水平、竖直顺序填写，用英文逗号分隔。')
          : task.answer.type === 'root-pair' ? t('Enter two different numbers or fractions, separated by a comma. Either order is accepted.', '填写两个不同的数值或分数，用英文逗号分隔。学生可以按任意顺序作答。')
          : 'choices' in task.answer ? t('Enter option numbers starting at 1, separated by commas.', '选项从 1 开始编号，多个答案用英文逗号分隔。')
          : t('Enter the answer as a number.', '请输入数值。')}</small>
        <label>{t('Worked solution', '解题过程')}<textarea value={task.solution} onChange={event => setTask({ ...task, solution: event.target.value })} /></label>
        <fieldset className="editor-fields">
          <legend>{t('Written solution steps', '解析书写步骤')}</legend>
          <small>{t('Each row pairs one LaTeX line with a short explanation in both languages. Write the formula without dollar signs.', '每行填写一条 LaTeX 公式及中英文简要说明。公式无需美元符号。')}</small>
          {task.workedSteps?.map((step, position) => <fieldset key={position} className="editor-fields">
            <legend>{t('Row', '第')} {position + 1}{t('', ' 行')}</legend>
            <label>{t('Formula', '公式')}<textarea value={step.math} onChange={event => editWorkedStep(position, 'math', event.target.value)} /></label>
            <label>{t('Reason in English', '英文说明')}<input value={step.en} onChange={event => editWorkedStep(position, 'en', event.target.value)} /></label>
            <label>{t('Reason in Chinese', '中文说明')}<input value={step.zh} onChange={event => editWorkedStep(position, 'zh', event.target.value)} /></label>
            <button type="button" aria-label={t(`Remove row ${position + 1}`, `删除第 ${position + 1} 行`)}
              onClick={() => setTask(current => ({
                ...current, workedSteps: current.workedSteps?.filter((_, row) => row !== position),
              }))}>{t('Remove row', '删除该行')}</button>
          </fieldset>)}
          <button type="button" onClick={() => setTask(current => ({
            ...current, workedSteps: [...(current.workedSteps ?? []), emptyWorkedStep],
          }))}>{t('Add written step', '添加书写步骤')}</button>
        </fieldset>
        <label>{t('Hint in English', '英文提示')}<input value={task.hint ?? ''} onChange={event => setTask({ ...task, hint: event.target.value || undefined })} /></label>
        <label>{t('Hint in Chinese', '中文提示')}<input value={task.hintZh ?? ''} onChange={event => setTask({ ...task, hintZh: event.target.value || undefined })} /></label>
        <label>{t('Feedback for an incorrect answer', '答错时的反馈')}<input value={task.misconception} onChange={event => setTask({ ...task, misconception: event.target.value })} /></label>
        <label>{t('Incorrect-answer feedback in Chinese', '答错时的中文反馈')}<input value={task.misconceptionZh ?? ''} onChange={event => setTask({ ...task, misconceptionZh: event.target.value || undefined })} /></label>
        <div className="actions"><button onClick={() => updateTask(false)}>{t('Preview step', '预览步骤')}</button><button className="button" onClick={() => updateTask(true)}>{t('Save step', '保存步骤')}</button></div>
        <div aria-live="polite">{message}</div>
      </section>
    </div>
    {previewTask && <section className="editor-preview"><h2>{t('Student preview', '学生预览')}</h2>{preview(previewTask, exercise.context ?? '')}</section>}
  </>
}

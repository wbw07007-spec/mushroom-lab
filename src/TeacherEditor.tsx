import { useState } from 'react'
import { bank } from './content/questions'
import type { Answer, Exercise, Task } from './content/questions'

type Props = {
  t: (en: string, cn: string) => string
  preview: (task: Task, context: string) => React.ReactNode
}
const emptyTask: Task = { id: '', skill: '', difficulty: 'foundation', prompt: '', answer: { type: 'number', correct: 0 }, solution: '', misconception: '' }
const emptyExercise: Exercise = { id: '', title: '', context: '', tasks: [] }

export function TeacherEditor({ t, preview }: Props) {
  const [exercise, setExercise] = useState<Exercise>(emptyExercise)
  const [task, setTask] = useState<Task>(emptyTask)
  const [index, setIndex] = useState(-1)
  const [choices, setChoices] = useState('')
  const [correct, setCorrect] = useState('')
  const [message, setMessage] = useState('')
  const [previewTask, setPreviewTask] = useState<Task>()

  function editTask(value: Task, position: number) {
    setTask(value)
    setIndex(position)
    setChoices('choices' in value.answer ? value.answer.choices.join('\n') : '')
    setCorrect('choices' in value.answer ? value.answer.correct.map(i => i + 1).join(', ') : String(value.answer.correct))
    setPreviewTask(undefined)
    setMessage('')
  }

  function prepareTask(): Task | undefined {
    const fields = correct.split(',').map(value => value.trim())
    const values = fields.map(Number)
    let answer: Answer
    const type = task.answer.type
    const options = choices.split('\n').map(value => value.trim()).filter(Boolean)
    if (!task.id.trim() || !task.prompt.trim() || !task.skill.trim() || !task.solution.trim()) return
    if (fields.some((value, i) => !value || !Number.isFinite(values[i]))) return
    if (type === 'number' && values.length === 1) answer = { type, correct: values[0] }
    else if (type === 'vector' && values.length === 2) answer = { type, correct: [values[0], values[1]] }
    else if ((type === 'single' || type === 'multiple') && options.length >= 2 &&
      (type === 'multiple' || values.length === 1) && new Set(values).size === values.length &&
      values.every(value => Number.isInteger(value) && value >= 1 && value <= options.length)) {
      answer = { type, choices: options, correct: values.map(value => value - 1) }
    } else return
    return { ...task, id: task.id.trim(), answer }
  }

  function updateTask(save: boolean) {
    const candidate = prepareTask()
    if (!candidate || exercise.tasks.some((other, position) => position !== index && other.id === candidate.id)) {
      setMessage(t('Check the task ID, skill, question, answer and worked solution. Task IDs must be unique.', '请检查步骤 ID、技能、题干、答案和解析。步骤 ID 须唯一。'))
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
    if (!exercise.id.trim() || !exercise.title.trim() || !exercise.tasks.length) {
      setMessage(t('Enter an exercise ID and title, and save at least one step.', '请填写练习 ID 和标题，并至少保存一个步骤。'))
      return
    }
    const { exercises: _, ...metadata } = bank
    const url = URL.createObjectURL(new Blob([JSON.stringify({ ...metadata, exercises: [exercise] }, null, 2)], { type: 'application/json' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'mushroom-exercise.json'
    link.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  return <>
    <h1 className="practice-title">{t('Question Builder', '教师题目编辑器')}</h1>
    <p>{t('Create a draft or load a copy of a sample exercise. Save your steps, then export the draft as JSON.', '可新建草稿或载入样题副本。保存步骤后，将草稿导出为 JSON。')}</p>
    <div className="editor-layout">
      <section className="card editor-fields">
        <label>{t('Load a sample', '载入样题')}<select value="" onChange={event => {
          const sample = bank.exercises.find(item => item.id === event.target.value)
          if (sample) { setExercise(sample); editTask(sample.tasks[0], 0) }
        }}><option value="">{t('Choose an exercise', '选择练习')}</option>{bank.exercises.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label>
        <label>{t('Exercise ID', '练习 ID')}<input value={exercise.id} onChange={event => setExercise({ ...exercise, id: event.target.value })} /></label>
        <label>{t('Exercise title', '练习标题')}<input value={exercise.title} onChange={event => setExercise({ ...exercise, title: event.target.value })} /></label>
        <label>{t('Shared context', '共用题干')}<textarea value={exercise.context ?? ''} onChange={event => setExercise({ ...exercise, context: event.target.value })} /></label>
        <div className="actions">{exercise.tasks.map((item, position) => <button key={item.id} onClick={() => editTask(item, position)}>{item.id}</button>)}
          <button onClick={() => editTask(emptyTask, -1)}>{t('New step', '新增步骤')}</button></div>
        <button onClick={exportDraft}>{t('Export saved draft', '导出已保存的草稿')}</button>
      </section>
      <section className="card editor-fields">
        <label>{t('Step ID', '步骤 ID')}<input value={task.id} onChange={event => setTask({ ...task, id: event.target.value })} /></label>
        <label>{t('Skill', '技能')}<input value={task.skill} onChange={event => setTask({ ...task, skill: event.target.value })} /></label>
        <label>{t('Question (wrap LaTeX in dollar signs)', '题干（用美元符号包裹 LaTeX）')}<textarea value={task.prompt} onChange={event => setTask({ ...task, prompt: event.target.value })} /></label>
        <label>{t('Answer type', '答案类型')}<select value={task.answer.type} onChange={event => {
          const type = event.target.value
          const answer: Answer = type === 'single' || type === 'multiple' ? { type, choices: [], correct: [] }
            : type === 'vector' ? { type, correct: [0, 0] } : { type: 'number', correct: 0 }
          setTask({ ...task, answer })
          setCorrect('')
        }}><option value="number">{t('Number', '数值')}</option><option value="vector">{t('Column vector', '列向量')}</option><option value="single">{t('Single choice', '单选')}</option><option value="multiple">{t('Multiple choice', '多选')}</option></select></label>
        {'choices' in task.answer && <label>{t('Choices (one per line)', '选项（每行一个）')}<textarea value={choices} onChange={event => setChoices(event.target.value)} /></label>}
        <label>{t('Correct answer', '正确答案')}<input value={correct} onChange={event => setCorrect(event.target.value)} /></label>
        <small>{task.answer.type === 'vector' ? t('Enter the horizontal and vertical components, separated by a comma.', '按水平、竖直顺序填写，用英文逗号分隔。')
          : 'choices' in task.answer ? t('Enter option numbers starting at 1, separated by commas.', '选项从 1 开始编号，多个答案用英文逗号分隔。')
          : t('Enter the answer as a number.', '请输入数值。')}</small>
        <label>{t('Worked solution', '解题过程')}<textarea value={task.solution} onChange={event => setTask({ ...task, solution: event.target.value })} /></label>
        <label>{t('Feedback for an incorrect answer', '答错时的反馈')}<input value={task.misconception} onChange={event => setTask({ ...task, misconception: event.target.value })} /></label>
        <div className="actions"><button onClick={() => updateTask(false)}>{t('Preview step', '预览步骤')}</button><button className="button" onClick={() => updateTask(true)}>{t('Save step', '保存步骤')}</button></div>
        <div aria-live="polite">{message}</div>
      </section>
    </div>
    {previewTask && <section className="editor-preview"><h2>{t('Student preview', '学生预览')}</h2>{preview(previewTask, exercise.context ?? '')}</section>}
  </>
}

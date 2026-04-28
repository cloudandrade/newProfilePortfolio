import { jsPDF } from 'jspdf'
import type { TFunction } from 'i18next'
import { buildResumeTemplate } from './resumeTemplate'

export function generateResumePdf(t: TFunction) {
  const template = buildResumeTemplate(t)
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 44
  const contentWidth = pageWidth - margin * 2
  const lineHeight = 15

  let y = margin

  const ensureSpace = (needed: number) => {
    if (y + needed <= pageHeight - margin) return
    doc.addPage()
    y = margin
  }

  const writeWrapped = (text: string, fontSize = 11, extraGap = 0) => {
    doc.setFontSize(fontSize)
    const lines = doc.splitTextToSize(text, contentWidth)
    ensureSpace(lines.length * lineHeight + extraGap)
    doc.text(lines, margin, y)
    y += lines.length * lineHeight + extraGap
  }

  doc.setFont('helvetica', 'bold')
  writeWrapped(template.name, 22, 4)

  doc.setFont('helvetica', 'normal')
  writeWrapped(template.headline, 13, 8)
  writeWrapped(template.contacts.join(' | '), 10, 14)

  for (const section of template.sections) {
    doc.setFont('helvetica', 'bold')
    writeWrapped(section.title, 13, 4)
    doc.setFont('helvetica', 'normal')
    for (const line of section.lines) {
      writeWrapped(line, 11, 2)
    }
    y += 8
  }

  doc.save(template.fileName)
}

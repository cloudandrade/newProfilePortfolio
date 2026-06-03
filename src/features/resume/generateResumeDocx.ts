import {
  AlignmentType,
  BorderStyle,
  Document,
  ExternalHyperlink,
  Packer,
  Paragraph,
  TabStopType,
  TextRun,
  type IParagraphOptions,
} from 'docx'
import type { TFunction } from 'i18next'
import { portfolioEnabled } from '../../data/profile'
import type { ResumeOverlayLocale } from '../../data/resumeAtsOverlay'
import type {
  ResumePdfDocument,
  ResumePdfEducationEntry,
  ResumePdfExperienceEntry,
  ResumePdfSection,
} from './resumeTemplate'
import { buildResumeTemplate } from './resumeTemplate'

const BODY_SIZE = 22 // half-points → 11pt
const SMALL_SIZE = 18
const NAME_SIZE = 32
const HEADLINE_SIZE = 20
const SECTION_SIZE = 20

function bodyText(text: string, bold = false): TextRun {
  return new TextRun({ text, size: BODY_SIZE, font: 'Calibri', bold })
}

function sectionTitleParagraph(title: string): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 240, after: 120 },
    border: {
      top: { style: BorderStyle.SINGLE, size: 4, color: 'BEBEBE' },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: 'BEBEBE' },
    },
    children: [
      new TextRun({
        text: title.toUpperCase(),
        bold: true,
        size: SECTION_SIZE,
        font: 'Calibri',
        color: '2A2A2A',
      }),
    ],
  })
}

function bulletParagraph(text: string): Paragraph {
  return new Paragraph({
    spacing: { after: 80 },
    indent: { left: 360, hanging: 180 },
    children: [bodyText(`- ${text}`)],
  })
}

function twoColumnRow(leftBold: string, right: string): Paragraph {
  const rightLines = right.split('\n').filter(Boolean)
  const rightText = rightLines.join(' · ') || right

  return new Paragraph({
    spacing: { after: 100 },
    tabStops: [{ type: TabStopType.RIGHT, position: 9026 }],
    children: [
      new TextRun({ text: leftBold, bold: true, size: BODY_SIZE, font: 'Calibri' }),
      new TextRun({ text: '\t' }),
      new TextRun({ text: rightText, size: BODY_SIZE, font: 'Calibri' }),
    ],
  })
}

function plainParagraph(text: string, opts?: Partial<IParagraphOptions>): Paragraph {
  return new Paragraph({
    spacing: { after: 80 },
    ...opts,
    children: [bodyText(text)],
  })
}

function skillGroupParagraph(category: string, skillsJoined: string): Paragraph {
  return new Paragraph({
    spacing: { after: 100 },
    indent: { left: 360, hanging: 180 },
    children: [
      new TextRun({ text: '- ', size: BODY_SIZE, font: 'Calibri' }),
      new TextRun({ text: `${category}: `, bold: true, size: BODY_SIZE, font: 'Calibri' }),
      new TextRun({ text: skillsJoined, size: BODY_SIZE, font: 'Calibri' }),
    ],
  })
}

function renderExperience(entries: ResumePdfExperienceEntry[]): Paragraph[] {
  const out: Paragraph[] = []
  for (const e of entries) {
    out.push(twoColumnRow(e.leftTitle, e.rightMeta))
    for (const b of e.bullets) {
      out.push(bulletParagraph(b))
    }
  }
  return out
}

function renderEducation(entries: ResumePdfEducationEntry[]): Paragraph[] {
  const out: Paragraph[] = []
  for (const e of entries) {
    out.push(twoColumnRow(e.institution.toUpperCase(), e.period))
    out.push(plainParagraph(e.degreeLine))
    if (e.detailBullet) out.push(bulletParagraph(e.detailBullet))
  }
  return out
}

function renderCertRows(rows: { left: string; right: string }[]): Paragraph[] {
  const out: Paragraph[] = []
  for (const r of rows) {
    if (r.right.trim()) out.push(twoColumnRow(r.left, r.right))
    else {
      out.push(
        new Paragraph({
          spacing: { after: 80 },
          children: [new TextRun({ text: r.left, bold: true, size: BODY_SIZE, font: 'Calibri' })],
        }),
      )
    }
  }
  return out
}

function renderSection(section: ResumePdfSection): Paragraph[] {
  const blocks: Paragraph[] = [sectionTitleParagraph(section.title)]
  const body = section.body

  switch (body.kind) {
    case 'skillGroups':
      for (const g of body.groups) {
        blocks.push(skillGroupParagraph(g.category, g.skillsJoined))
      }
      break
    case 'experience':
      blocks.push(...renderExperience(body.entries))
      break
    case 'education':
      blocks.push(...renderEducation(body.entries))
      break
    case 'certRows':
      blocks.push(...renderCertRows(body.rows))
      break
    case 'bullets':
      for (const item of body.items) {
        blocks.push(bulletParagraph(item))
      }
      break
    default:
      break
  }

  return blocks
}

function buildHeaderParagraphs(doc: ResumePdfDocument): Paragraph[] {
  const { header } = doc
  const paragraphs: Paragraph[] = []

  paragraphs.push(
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: header.name.toUpperCase(),
          bold: true,
          size: NAME_SIZE,
          font: 'Calibri',
        }),
      ],
    }),
  )

  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { after: 60 },
      children: [
        new TextRun({ text: header.email, size: SMALL_SIZE, font: 'Calibri' }),
        new TextRun({ text: '\n', break: 1 }),
        new TextRun({ text: header.phone, size: SMALL_SIZE, font: 'Calibri' }),
      ],
    }),
  )

  paragraphs.push(
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: header.headlineRole,
          size: HEADLINE_SIZE,
          font: 'Calibri',
          color: '2A2A2A',
        }),
      ],
    }),
  )

  const social: { label: string; url?: string }[] = [
    { label: header.linkedinLabel, url: header.linkedinUrl },
    { label: header.githubLabel, url: header.githubUrl },
    ...(portfolioEnabled && header.portfolioHref
      ? [{ label: header.portfolioLabel, url: header.portfolioHref }]
      : []),
  ]

  const linkChildren: (TextRun | ExternalHyperlink)[] = []
  social.forEach((item, index) => {
    if (index > 0) {
      linkChildren.push(new TextRun({ text: ' - ', size: SMALL_SIZE, color: '646464', font: 'Calibri' }))
    }
    if (item.url) {
      linkChildren.push(
        new ExternalHyperlink({
          link: item.url,
          children: [
            new TextRun({
              text: item.label,
              size: SMALL_SIZE,
              font: 'Calibri',
              color: '1155CC',
              underline: {},
            }),
          ],
        }),
      )
    } else {
      linkChildren.push(
        new TextRun({ text: item.label, size: SMALL_SIZE, font: 'Calibri', color: '787878' }),
      )
    }
  })

  paragraphs.push(
    new Paragraph({
      spacing: { after: 200 },
      children: linkChildren,
    }),
  )

  return paragraphs
}

export function buildResumeDocxDocument(model: ResumePdfDocument): Document {
  const children: Paragraph[] = [...buildHeaderParagraphs(model)]

  for (const section of model.sections) {
    children.push(...renderSection(section))
  }

  return new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, right: 720, bottom: 720, left: 720 },
          },
        },
        children,
      },
    ],
  })
}

export async function generateResumeDocxBuffer(
  t: TFunction,
  locale?: ResumeOverlayLocale,
): Promise<{ buffer: Buffer; fileName: string }> {
  const model = buildResumeTemplate(t, locale)
  const wordDoc = buildResumeDocxDocument(model)
  const buffer = Buffer.from(await Packer.toBuffer(wordDoc))
  const fileName = model.fileName.replace(/\.pdf$/i, '.docx')
  return { buffer, fileName }
}

export async function writeResumeDocxFile(
  t: TFunction,
  outputPath: string,
  locale?: ResumeOverlayLocale,
): Promise<string> {
  const { buffer, fileName } = await generateResumeDocxBuffer(t, locale)
  const fs = await import('node:fs/promises')
  const path = await import('node:path')
  const resolved =
    outputPath.endsWith('.docx') || outputPath.includes(path.sep)
      ? outputPath
      : path.join(outputPath, fileName)
  await fs.mkdir(path.dirname(resolved), { recursive: true })
  await fs.writeFile(resolved, buffer)
  return resolved
}

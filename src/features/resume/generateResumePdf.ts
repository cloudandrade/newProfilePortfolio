import { jsPDF } from 'jspdf'
import type { TFunction } from 'i18next'
import type { ResumePdfEducationEntry } from './resumeTemplate'
import { buildResumeTemplate } from './resumeTemplate'

const LINK_RGB: [number, number, number] = [17, 85, 204]
const MUTED_RGB: [number, number, number] = [120, 120, 120]
const RULE_RGB: [number, number, number] = [190, 190, 190]

type PdfCtx = {
  doc: jsPDF
  y: number
  margin: number
  contentW: number
  pageW: number
  pageH: number
}

function ensure(ctx: PdfCtx, needed: number) {
  if (ctx.y + needed <= ctx.pageH - ctx.margin) return
  ctx.doc.addPage()
  ctx.y = ctx.margin
}

export function generateResumePdf(t: TFunction) {
  const m = buildResumeTemplate(t)
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  const margin = 44

  const ctx: PdfCtx = {
    doc,
    y: margin,
    margin,
    contentW: pageW - margin * 2,
    pageW,
    pageH,
  }

  const BODY = 10
  const LH = 14
  const GAP_MD = 8
  const GAP_SM = 4

  const wrap = (txt: string, maxW: number) => ctx.doc.splitTextToSize(txt, maxW)

  const writePlainLines = (
    txt: string,
    opts?: {
      bold?: boolean
      italic?: boolean
      size?: number
      color?: [number, number, number]
      x?: number
    },
  ) => {
    const fs = opts?.size ?? BODY
    const x0 = opts?.x ?? ctx.margin
    const style =
      opts?.italic && opts?.bold ? 'bolditalic'
      : opts?.italic ? 'italic'
      : opts?.bold ? 'bold'
      : 'normal'
    ctx.doc.setFont('helvetica', style as 'italic' | 'bold' | 'normal' | 'bolditalic')
    ctx.doc.setFontSize(fs)
    if (opts?.color) ctx.doc.setTextColor(...opts.color)
    else ctx.doc.setTextColor(0, 0, 0)
    const lines = wrap(txt, ctx.contentW - (x0 - ctx.margin))
    ensure(ctx, lines.length * LH + GAP_SM)
    for (const ln of lines) {
      ctx.doc.text(ln, x0, ctx.y)
      ctx.y += LH
    }
  }

  const writeTwoCol = (leftBold: string, right: string, leftFrac = 0.56) => {
    ctx.doc.setTextColor(0, 0, 0)
    const gapMid = 8
    const leftW = ctx.contentW * leftFrac - gapMid / 2
    const rightW = ctx.contentW * (1 - leftFrac) - gapMid / 2

    ctx.doc.setFontSize(BODY)
    ctx.doc.setFont('helvetica', 'bold')
    const L = wrap(leftBold, leftW)
    ctx.doc.setFont('helvetica', 'normal')
    const R = right.trim() ? wrap(right, rightW) : []
    const n = Math.max(L.length, R.length, 1)

    ensure(ctx, n * LH + GAP_SM)
    const y0 = ctx.y
    for (let i = 0; i < n; i++) {
      const lineY = y0 + i * LH
      if (L[i]) {
        ctx.doc.setFont('helvetica', 'bold')
        ctx.doc.setFontSize(BODY)
        ctx.doc.text(L[i], ctx.margin, lineY)
      }
      if (R[i]) {
        ctx.doc.setFont('helvetica', 'normal')
        ctx.doc.setFontSize(BODY)
        ctx.doc.text(R[i], ctx.margin + ctx.contentW, lineY, { align: 'right' })
      }
    }
    ctx.y = y0 + n * LH + GAP_SM
  }

  const writeBullets = (items: string[]) => {
    ctx.doc.setTextColor(0, 0, 0)
    const indent = ctx.margin + 12
    for (const raw of items) {
      ctx.doc.setFont('helvetica', 'normal')
      ctx.doc.setFontSize(BODY)
      const prefixed = `- ${raw}`
      const lines = wrap(prefixed, ctx.contentW - 12 - 4)
      ensure(ctx, lines.length * LH + GAP_SM)
      for (const ln of lines) {
        ctx.doc.text(ln, indent, ctx.y)
        ctx.y += LH
      }
    }
  }

  const drawRuleThin = () => {
    ctx.doc.setDrawColor(...RULE_RGB)
    ctx.doc.setLineWidth(0.4)
    ctx.doc.line(ctx.margin, ctx.y, ctx.pageW - ctx.margin, ctx.y)
  }

  const renderSectionTitle = (title: string) => {
    ctx.y += GAP_SM
    drawRuleThin()
    ctx.y += GAP_MD
    ensure(ctx, LH + GAP_MD)
    ctx.doc.setFont('helvetica', 'bold')
    ctx.doc.setFontSize(10)
    ctx.doc.setTextColor(42, 42, 42)
    ctx.doc.text(title.toUpperCase(), ctx.pageW / 2, ctx.y, { align: 'center' })
    ctx.y += LH + GAP_SM
    drawRuleThin()
    ctx.y += GAP_MD
    ctx.doc.setTextColor(0, 0, 0)
  }

  const renderSkillBullets = (groups: { category: string; skillsJoined: string }[]) => {
    const indentBullet = ctx.margin + 12
    for (const g of groups) {
      ctx.doc.setFontSize(BODY)
      ctx.doc.setTextColor(0, 0, 0)
      const dash = '- '
      ctx.doc.setFont('helvetica', 'normal')
      const dashW = ctx.doc.getTextWidth(dash)

      ctx.doc.setFont('helvetica', 'bold')
      const catPart = `${g.category}: `
      const catW = ctx.doc.getTextWidth(catPart)

      const bodyX = indentBullet + dashW + catW
      const maxW = ctx.margin + ctx.contentW - bodyX
      ctx.doc.setFont('helvetica', 'normal')
      const bodyLines = wrap(g.skillsJoined, maxW)

      const totalH = LH * Math.max(1, bodyLines.length)
      ensure(ctx, totalH + LH + GAP_SM)

      const blockStart = ctx.y
      ctx.doc.text(dash, indentBullet, blockStart)
      ctx.doc.setFont('helvetica', 'bold')
      ctx.doc.text(catPart, indentBullet + dashW, blockStart)

      ctx.doc.setFont('helvetica', 'normal')
      if (bodyLines[0]) ctx.doc.text(bodyLines[0], bodyX, blockStart)
      for (let j = 1; j < bodyLines.length; j++) {
        const lineY = blockStart + j * LH
        ctx.doc.text(bodyLines[j], bodyX, lineY)
      }

      ctx.y = blockStart + Math.max(bodyLines.length, 1) * LH + GAP_SM
    }
  }

  /* --- Header (duas colunas no topo como no exemplo) --- */
  {
    const { header } = m
    const NAME_FS = 17
    const CONTACT_FS = 10
    const HEADLINE_FS = 11
    /** Alinha o topo das duas colunas sem “recuo” pelo baseline de fontes diferentes */
    const nameLinePitch = Math.ceil(NAME_FS * 1.1)
    const contactLinePitch = Math.ceil(CONTACT_FS * 1.25)

    const leftW = ctx.contentW * 0.53
    const rightW = ctx.contentW - leftW - 12
    const nameLines = wrap(header.name.toUpperCase(), leftW)
    ctx.doc.setTextColor(0, 0, 0)

    ctx.doc.setFont('helvetica', 'bold')
    const contactLinesRaw = `${header.email}\n${header.phone}`
    ctx.doc.setFontSize(CONTACT_FS)
    ctx.doc.setFont('helvetica', 'normal')
    const contactLines = ctx.doc.splitTextToSize(contactLinesRaw, rightW)

    /** Metade do espaço que antes usávamos só com GAP_SM após o bloco nome/contato */
    const gapAfterNameBand = Math.max(2, GAP_SM / 2)
    const gapAfterHeadline = Math.ceil(GAP_MD / 2)

    ensure(
      ctx,
      Math.max(nameLines.length * nameLinePitch, contactLines.length * contactLinePitch)
        + gapAfterNameBand
        + HEADLINE_FS
        + gapAfterHeadline
        + 14,
    )
    const bandTop = ctx.y

    ctx.doc.setFontSize(NAME_FS)
    ctx.doc.setFont('helvetica', 'bold')
    for (let i = 0; i < nameLines.length; i++) {
      ctx.doc.text(nameLines[i], ctx.margin, bandTop + i * nameLinePitch, { baseline: 'top' })
    }

    ctx.doc.setFontSize(CONTACT_FS)
    ctx.doc.setFont('helvetica', 'normal')
    for (let i = 0; i < contactLines.length; i++) {
      ctx.doc.text(contactLines[i], ctx.pageW - ctx.margin, bandTop + i * contactLinePitch, {
        align: 'right',
        baseline: 'top',
      })
    }

    const nameBandH = nameLines.length * nameLinePitch
    const contactBandH = contactLines.length * contactLinePitch
    ctx.y = bandTop + Math.max(nameBandH, contactBandH) + gapAfterNameBand

    ctx.doc.setFont('helvetica', 'normal')
    ctx.doc.setFontSize(HEADLINE_FS)
    ctx.doc.setTextColor(42, 42, 42)
    ctx.doc.text(header.headlineRole, ctx.margin, ctx.y, { baseline: 'top' })
    ctx.y += Math.ceil(HEADLINE_FS * 1.08) + gapAfterHeadline

    const linkFont = 9
    const social: { label: string; url?: string }[] = [
      { label: header.linkedinLabel, url: header.linkedinUrl },
      { label: header.githubLabel, url: header.githubUrl },
      { label: header.portfolioLabel, url: header.portfolioHref || undefined },
    ]
    ensure(ctx, LH + GAP_SM)
    ctx.doc.setFontSize(linkFont)
    ctx.doc.setFont('helvetica', 'normal')
    const linkRowTop = ctx.y
    let x = ctx.margin
    const sepText = ' - '
    const linkH = linkFont * 1.25
    for (let i = 0; i < social.length; i++) {
      if (i > 0) {
        ctx.doc.setTextColor(100, 100, 100)
        ctx.doc.text(sepText, x, linkRowTop, { baseline: 'top' })
        x += ctx.doc.getTextWidth(sepText)
      }
      const { label, url } = social[i]
      const hasHref = typeof url === 'string' && url.length > 0
      ctx.doc.setTextColor(...(hasHref ? LINK_RGB : MUTED_RGB))
      ctx.doc.text(label, x, linkRowTop, { baseline: 'top' })
      const lw = ctx.doc.getTextWidth(label)
      if (hasHref) {
        ctx.doc.link(x, linkRowTop, lw, linkH, { url: url })
      }
      x += lw
    }
    ctx.doc.setTextColor(0, 0, 0)
    ctx.y += linkH + GAP_SM

    ctx.doc.setFontSize(BODY)

    ctx.y += GAP_MD
    ctx.doc.setDrawColor(...RULE_RGB)
    ctx.doc.setLineWidth(0.55)
    ctx.doc.line(ctx.margin, ctx.y, ctx.pageW - ctx.margin, ctx.y)
    ctx.y += GAP_MD
  }

  /* --- Sections --- */

  const renderEducation = (entries: ResumePdfEducationEntry[]) => {
    for (const e of entries) {
      writeTwoCol(e.institution.toUpperCase(), e.period, 0.58)
      writePlainLines(e.degreeLine)
      if (e.detailBullet) writeBullets([e.detailBullet])
      ctx.y += GAP_SM
    }
  }

  const renderCertRows = (rows: { left: string; right: string }[]) => {
    for (const r of rows) {
      if (r.right.trim()) writeTwoCol(r.left, r.right, 0.66)
      else writePlainLines(r.left, { bold: true })
      ctx.y += GAP_SM
    }
  }

  for (const section of m.sections) {
    renderSectionTitle(section.title)
    switch (section.body.kind) {
      case 'skillGroups':
        renderSkillBullets(section.body.groups)
        break
      case 'experience':
        for (const e of section.body.entries) {
          writeTwoCol(e.leftTitle, e.rightMeta)
          writeBullets(e.bullets)
          if (e.techLine) {
            writePlainLines(e.techLine, { size: 9, italic: true, x: ctx.margin + 12 })
          }
          ctx.y += GAP_MD
        }
        break
      case 'education':
        renderEducation(section.body.entries)
        break
      case 'certRows':
        renderCertRows(section.body.rows)
        break
      case 'bullets':
        writeBullets(section.body.items)
        break
      default:
        break
    }
    ctx.y += GAP_SM
  }

  doc.save(m.fileName)
}

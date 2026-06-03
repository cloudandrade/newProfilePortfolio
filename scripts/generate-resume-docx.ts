/**
 * Gera currículo editável (.docx) com o mesmo conteúdo do PDF.
 *
 * Uso:
 *   npm run resume:docx
 *   npm run resume:docx -- --lang en
 *   npm run resume:docx -- --lang pt --out ./output/meu-cv.docx
 */
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { ResumeOverlayLocale } from '../src/data/resumeAtsOverlay'
import { writeResumeDocxFile } from '../src/features/resume/generateResumeDocx'
import { initI18nForNode } from '../src/i18n/forNode'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

function parseArgs(argv: string[]) {
  let lang: ResumeOverlayLocale = 'pt'
  let out = path.join(ROOT, 'output', 'jan-andrade-resume.docx')

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--lang' || arg === '-l') {
      const v = argv[++i]
      if (v === 'en' || v === 'es' || v === 'pt') lang = v
    } else if (arg === '--out' || arg === '-o') {
      const v = argv[++i]
      if (v) out = path.isAbsolute(v) ? v : path.join(ROOT, v)
    } else if (arg === '--help' || arg === '-h') {
      console.log(`Uso: npm run resume:docx -- [--lang pt|en|es] [--out caminho.docx]`)
      process.exit(0)
    }
  }

  return { lang, out }
}

async function main() {
  const { lang, out } = parseArgs(process.argv.slice(2))
  const i18n = await initI18nForNode(lang)
  const t = i18n.t.bind(i18n)
  const written = await writeResumeDocxFile(t, out, lang)
  console.log(`Currículo Word gerado: ${written}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

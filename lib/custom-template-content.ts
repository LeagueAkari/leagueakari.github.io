import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const customTemplateRoot = join(process.cwd(), 'public', 'custom-templates')

export function readCustomTemplateSkill() {
  return readFileSync(join(customTemplateRoot, 'league-akari-custom-template.skill.md'), 'utf8')
}

export function readCustomTemplateCode(fileName: string) {
  return readFileSync(join(customTemplateRoot, 'templates', fileName), 'utf8')
}
